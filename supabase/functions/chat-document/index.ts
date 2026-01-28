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
    const { documentId, message, language } = await req.json();
    
    if (!documentId || !message) {
      return new Response(
        JSON.stringify({ error: 'Document ID and message are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Determine response language
    const langMap: Record<string, string> = {
      'ur': 'Urdu',
      'en': 'English',
      'hi': 'Hindi',
      'ar': 'Arabic'
    };
    const responseLang = langMap[language] || 'English';

    // Medical disclaimer in multiple languages
    const medicalDisclaimers: Record<string, string> = {
      'English': 'Please consult with a doctor before taking Result.',
      'Urdu': 'ان ادویات کے استعمال سے پہلے ڈاکٹر سے مشورہ ضرور کریں۔',
      'Hindi': 'इन दवाइयों को लेने से पहले कृपया डॉक्टर से सलाह लें।',
      'Arabic': 'يرجى استشارة الطبيب قبل تناول هذه الأدوية.'
    };
    const medicalDisclaimer = medicalDisclaimers[responseLang] || medicalDisclaimers['English'];

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

    // Fetch the document (RLS ensures user owns it)
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError || !document) {
      return new Response(
        JSON.stringify({ error: 'Document not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For medical reports, fetch previous medical documents for Health Journey Map
    let healthJourneyContext = '';
    if (document.category === 'medical') {
      const { data: previousMedicalDocs } = await supabase
        .from('documents')
        .select('title, extracted_text, summary, created_at')
        .eq('category', 'medical')
        .eq('user_id', user.id)
        .neq('id', documentId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (previousMedicalDocs && previousMedicalDocs.length > 0) {
        healthJourneyContext = `

HEALTH JOURNEY MAP - Previous Medical Reports for comparison:
${previousMedicalDocs.map((doc: any, i: number) => `
Report ${i + 1} (${new Date(doc.created_at).toLocaleDateString()}):
Title: ${doc.title}
Summary: ${doc.summary || 'No summary'}
Key content: ${doc.extracted_text.substring(0, 500)}...
`).join('\n')}

When the user asks about health progress, compare current values with previous reports and highlight improvements or concerns.`;
      }
    }

    // Fetch previous chat messages for context
    const { data: previousMessages } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('document_id', documentId)
      .order('created_at', { ascending: true })
      .limit(20);

    // Save user message
    await supabase
      .from('chat_messages')
      .insert({
        user_id: user.id,
        document_id: documentId,
        role: 'user',
        content: message
      });

    console.log(`Chat request for document ${documentId}, language: ${responseLang}`);

    const systemPrompt = `You are Prisma AI, a helpful document assistant. You answer questions ONLY based on the document content provided below. You MUST respond in ${responseLang}.

DOCUMENT TITLE: ${document.title}
DOCUMENT CATEGORY: ${document.category}
DOCUMENT CONTENT:
${document.extracted_text}

${document.summary ? `DOCUMENT SUMMARY: ${document.summary}` : ''}
${healthJourneyContext}

IMPORTANT RULES:
1. Answer ONLY based on the document content above
2. If the information is not in the document, say "This information is not found in the document" (in ${responseLang})
3. Never make assumptions or add information not present in the document
4. Be clear, concise, and helpful
5. Respond STRICTLY in ${responseLang} language
6. If asked about dates, reference only what's in the document
7. For medical reports with medicines, always add this disclaimer after listing medicines: "${medicalDisclaimer}"
8. If comparing with previous reports (Health Journey Map), show progress with clear comparisons
9. For Hajj/Umrah documents, help with event planning and date tracking`;

    // Build conversation history
    const conversationMessages = [
      { role: "system", content: systemPrompt },
      ...(previousMessages || []).map((m: any) => ({
        role: m.role,
        content: m.content
      })),
      { role: "user", content: message }
    ];

    // Call Gemini via OpenRouter API
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
        messages: conversationMessages,
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
        JSON.stringify({ error: 'Failed to process chat' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiResponse = await response.json();
    const assistantMessage = aiResponse.choices?.[0]?.message?.content;

    if (!assistantMessage) {
      console.error("No content in AI response");
      return new Response(
        JSON.stringify({ error: 'No response received' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Save assistant response
    await supabase
      .from('chat_messages')
      .insert({
        user_id: user.id,
        document_id: documentId,
        role: 'assistant',
        content: assistantMessage
      });

    return new Response(
      JSON.stringify({
        success: true,
        message: assistantMessage
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("chat-document error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
