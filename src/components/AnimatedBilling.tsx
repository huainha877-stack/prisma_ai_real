import { useEffect, useState } from 'react';

export function AnimatedBilling() {
  const [scanLine, setScanLine] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine(prev => (prev >= 100 ? 0 : prev + 2));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-32 h-40 animate-float" style={{ animationDelay: '0.5s' }}>
      <svg viewBox="0 0 120 160" className="w-full h-full">
        <defs>
          <linearGradient id="billGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
          <filter id="billGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Paper Background */}
        <rect x="10" y="10" width="100" height="140" rx="8" fill="hsl(var(--card))" stroke="url(#billGradient)" strokeWidth="2"/>
        
        {/* Header */}
        <rect x="20" y="20" width="80" height="20" rx="4" fill="hsl(var(--primary) / 0.1)"/>
        <text x="60" y="34" textAnchor="middle" fill="hsl(var(--primary))" fontSize="10" fontWeight="bold">UTILITY BILL</text>

        {/* Content lines */}
        <g className="animate-pulse-soft">
          <rect x="20" y="50" width="60" height="6" rx="3" fill="hsl(var(--muted-foreground) / 0.3)"/>
          <rect x="20" y="62" width="45" height="6" rx="3" fill="hsl(var(--muted-foreground) / 0.2)"/>
          <rect x="20" y="74" width="55" height="6" rx="3" fill="hsl(var(--muted-foreground) / 0.25)"/>
          <rect x="20" y="86" width="40" height="6" rx="3" fill="hsl(var(--muted-foreground) / 0.2)"/>
        </g>

        {/* Amount Box */}
        <rect x="20" y="100" width="80" height="25" rx="5" fill="hsl(var(--primary) / 0.1)" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1"/>
        <text x="60" y="117" textAnchor="middle" fill="hsl(var(--primary))" fontSize="12" fontWeight="bold">Rs. 2,450</text>

        {/* Due Date */}
        <g className="animate-pulse">
          <rect x="20" y="132" width="50" height="12" rx="3" fill="hsl(var(--accent) / 0.2)"/>
          <text x="45" y="141" textAnchor="middle" fill="hsl(var(--accent))" fontSize="7">Due: 25 Jan</text>
        </g>

        {/* Scan Line Effect */}
        <rect 
          x="10" 
          y={10 + (scanLine * 1.4)} 
          width="100" 
          height="3" 
          fill="hsl(var(--primary) / 0.4)" 
          filter="url(#billGlow)"
          rx="1"
        />

        {/* Corner Fold */}
        <path d="M 90 10 L 110 10 L 110 30 Z" fill="hsl(var(--primary) / 0.1)"/>
        <path d="M 90 10 L 110 30" stroke="url(#billGradient)" strokeWidth="1" fill="none"/>

        {/* Checkmark Animation */}
        <g className="animate-scale-in" style={{ transformOrigin: '85px 108px' }}>
          <circle cx="85" cy="108" r="8" fill="hsl(var(--primary))" filter="url(#billGlow)"/>
          <path d="M 81 108 L 84 111 L 90 105" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
      </svg>

      {/* Sparkles */}
      <div className="absolute -top-1 right-2 w-2 h-2 bg-primary rounded-full animate-ping opacity-60"/>
      <div className="absolute top-8 -left-2 w-1.5 h-1.5 bg-accent rounded-full animate-ping opacity-50" style={{ animationDelay: '0.3s' }}/>
    </div>
  );
}
