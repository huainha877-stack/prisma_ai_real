import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, category, mimeType } = await req.json();
    
    if (!imageBase64 || !category) {
      return new Response(
        JSON.stringify({ error: 'Image and category are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use user-provided Gemini API key via OpenRouter
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: 'Gemini API key not configured. Please add your API key in settings.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid user session' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing document for user ${user.id}, category: ${category}`);

    // Call Gemini via OpenRouter API
    const systemPrompt = `You are Prisma AI, a professional document analysis assistant. Your task is to:

1. Extract ALL text from the uploaded document image using OCR
2. Format the extracted text cleanly and organized
3. Identify the document type and provide a brief summary
4. Detect any important dates (appointments, due dates, expiry dates, deadlines)
5. Never generate medical or legal advice

Respond ONLY in this JSON format:
{
  "title": "Brief descriptive title for this document",
  "extractedText": "The full extracted text, cleanly formatted",
  "summary": "A 2-3 sentence summary of what this document contains",
  "detectedDates": [
    {
      "date": "YYYY-MM-DD",
      "description": "What this date represents",
      "isImportant": true/false
    }
  ]
}

Category context: ${category}
Be accurate and factual. Only extract what you can see.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GEMINI_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://prisma-clarity.lovable.app",
        "X-Title": "Prisma AI"
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType || 'image/jpeg'};base64,${imageBase64}`
                }
              },
              {
                type: "text",
                text: "Please analyze this document image and extract all text content."
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", response.status, errorText);
      
      if (response.status === 401) {
        return new Response(
          JSON.stringify({ error: 'Invalid Gemini API key. Please check your API key.' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'API usage limit reached. Please check your OpenRouter account.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to analyze document' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      console.error("No content in AI response");
      return new Response(
        JSON.stringify({ error: 'No analysis result received' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the JSON response from AI
    let parsedResult;
    try {
      // Try to extract JSON from the response (might be wrapped in markdown)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError, content);
      // Fallback - return raw text
      parsedResult = {
        title: "Extracted Document",
        extractedText: content,
        summary: "Document analysis completed",
        detectedDates: []
      };
    }

    // Save document to database
    const { data: document, error: docError } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        category: category,
        title: parsedResult.title || "Untitled Document",
        extracted_text: parsedResult.extractedText || content,
        summary: parsedResult.summary
      })
      .select()
      .single();

    if (docError) {
      console.error("Failed to save document:", docError);
      return new Response(
        JSON.stringify({ error: 'Failed to save document' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create reminders for detected important dates
    if (parsedResult.detectedDates && parsedResult.detectedDates.length > 0) {
      const reminders = parsedResult.detectedDates
        .filter((d: any) => d.date && d.isImportant)
        .map((d: any) => ({
          user_id: user.id,
          document_id: document.id,
          title: d.description || "Important Date",
          due_date: d.date,
          is_acknowledged: false
        }));

      if (reminders.length > 0) {
        const { error: reminderError } = await supabase
          .from('reminders')
          .insert(reminders);

        if (reminderError) {
          console.error("Failed to create reminders:", reminderError);
        }
      }
    }

    console.log(`Document ${document.id} saved successfully`);

    return new Response(
      JSON.stringify({
        success: true,
        document: document,
        detectedDates: parsedResult.detectedDates || []
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("analyze-document error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
