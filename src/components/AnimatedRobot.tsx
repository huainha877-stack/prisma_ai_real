import { useEffect, useState } from 'react';

export function AnimatedRobot() {
  const [blink, setBlink] = useState(false);
  const [wave, setWave] = useState(false);

  useEffect(() => {
    // Blink animation
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 3000);

    // Wave animation
    const waveInterval = setInterval(() => {
      setWave(true);
      setTimeout(() => setWave(false), 1000);
    }, 5000);

    return () => {
      clearInterval(blinkInterval);
      clearInterval(waveInterval);
    };
  }, []);

  return (
    <div className="relative w-40 h-40 animate-float">
      {/* Robot Body */}
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Glow Effect */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id="robotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
          <linearGradient id="screenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary) / 0.3)" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0.1)" />
          </linearGradient>
        </defs>

        {/* Antenna */}
        <g className="animate-pulse">
          <line x1="100" y1="25" x2="100" y2="40" stroke="url(#robotGradient)" strokeWidth="4" strokeLinecap="round"/>
          <circle cx="100" cy="20" r="8" fill="url(#robotGradient)" filter="url(#glow)" className="animate-pulse"/>
        </g>

        {/* Head */}
        <rect x="55" y="40" width="90" height="70" rx="15" fill="hsl(var(--card))" stroke="url(#robotGradient)" strokeWidth="3"/>
        
        {/* Screen/Face */}
        <rect x="65" y="50" width="70" height="50" rx="10" fill="url(#screenGradient)" className="animate-pulse-soft"/>

        {/* Eyes */}
        <g>
          <circle 
            cx="85" 
            cy="75" 
            r={blink ? 1 : 8} 
            fill="hsl(var(--primary))" 
            className="transition-all duration-150"
            filter="url(#glow)"
          />
          <circle 
            cx="115" 
            cy="75" 
            r={blink ? 1 : 8} 
            fill="hsl(var(--primary))" 
            className="transition-all duration-150"
            filter="url(#glow)"
          />
          {/* Eye shine */}
          {!blink && (
            <>
              <circle cx="88" cy="72" r="3" fill="white" opacity="0.8"/>
              <circle cx="118" cy="72" r="3" fill="white" opacity="0.8"/>
            </>
          )}
        </g>

        {/* Mouth - animated smile */}
        <path 
          d="M 85 90 Q 100 100 115 90" 
          stroke="hsl(var(--primary))" 
          strokeWidth="3" 
          fill="none" 
          strokeLinecap="round"
          filter="url(#glow)"
        />

        {/* Body */}
        <rect x="60" y="115" width="80" height="50" rx="10" fill="hsl(var(--card))" stroke="url(#robotGradient)" strokeWidth="3"/>
        
        {/* Chest display */}
        <rect x="75" y="125" width="50" height="30" rx="5" fill="url(#screenGradient)"/>
        <g className="animate-pulse">
          <rect x="82" y="132" width="36" height="4" rx="2" fill="hsl(var(--primary) / 0.6)"/>
          <rect x="82" y="140" width="24" height="4" rx="2" fill="hsl(var(--primary) / 0.4)"/>
          <rect x="82" y="148" width="30" height="4" rx="2" fill="hsl(var(--primary) / 0.5)"/>
        </g>

        {/* Left Arm */}
        <g className={wave ? 'animate-wave origin-[50px_130px]' : ''}>
          <rect x="30" y="120" width="25" height="12" rx="6" fill="hsl(var(--card))" stroke="url(#robotGradient)" strokeWidth="2"/>
          <circle cx="25" cy="126" r="10" fill="hsl(var(--card))" stroke="url(#robotGradient)" strokeWidth="2"/>
        </g>

        {/* Right Arm */}
        <rect x="145" y="120" width="25" height="12" rx="6" fill="hsl(var(--card))" stroke="url(#robotGradient)" strokeWidth="2"/>
        <circle cx="175" cy="126" r="10" fill="hsl(var(--card))" stroke="url(#robotGradient)" strokeWidth="2"/>

        {/* Legs */}
        <rect x="70" y="165" width="15" height="25" rx="5" fill="hsl(var(--card))" stroke="url(#robotGradient)" strokeWidth="2"/>
        <rect x="115" y="165" width="15" height="25" rx="5" fill="hsl(var(--card))" stroke="url(#robotGradient)" strokeWidth="2"/>
        
        {/* Feet */}
        <ellipse cx="77" cy="192" rx="12" ry="6" fill="hsl(var(--card))" stroke="url(#robotGradient)" strokeWidth="2"/>
        <ellipse cx="122" cy="192" rx="12" ry="6" fill="hsl(var(--card))" stroke="url(#robotGradient)" strokeWidth="2"/>
      </svg>

      {/* Floating particles */}
      <div className="absolute -top-2 -right-2 w-3 h-3 bg-primary rounded-full animate-float-particle opacity-60" style={{ animationDelay: '0s' }}/>
      <div className="absolute top-4 -left-3 w-2 h-2 bg-accent rounded-full animate-float-particle opacity-50" style={{ animationDelay: '0.5s' }}/>
      <div className="absolute bottom-8 -right-4 w-2 h-2 bg-primary rounded-full animate-float-particle opacity-40" style={{ animationDelay: '1s' }}/>
    </div>
  );
}
