import React from 'react';

export const BackgroundWatermark: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden">
      {/* Radial red spotlight in the center */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-red-950/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[600px] h-[500px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Futuristic Command Grid */}
      <div className="absolute inset-0 bg-command-grid opacity-30" />

      {/* Subtle Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#050608_100%)]" />

      {/* Centered Large Big Boss Surveillance Eye Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.035] flex flex-col items-center justify-center">
        <svg
          viewBox="0 0 500 500"
          className="w-[650px] h-[650px] text-red-500 fill-none stroke-current"
          strokeWidth="6"
        >
          {/* Outer Command Target Rings */}
          <circle cx="250" cy="250" r="230" strokeDasharray="16 12" strokeWidth="3" />
          <circle cx="250" cy="250" r="200" strokeWidth="4" />
          <circle cx="250" cy="250" r="160" strokeDasharray="8 8" strokeWidth="2" />
          
          {/* Eye Outline */}
          <path
            d="M 50,250 Q 250,70 450,250 Q 250,430 50,250 Z"
            strokeWidth="8"
          />

          {/* Iris */}
          <circle cx="250" cy="250" r="85" strokeWidth="6" />
          <circle cx="250" cy="250" r="45" strokeWidth="8" fill="currentColor" />

          {/* Crosshairs & Compass Tick marks */}
          <line x1="250" y1="20" x2="250" y2="70" strokeWidth="4" />
          <line x1="250" y1="430" x2="250" y2="480" strokeWidth="4" />
          <line x1="20" y1="250" x2="70" y2="250" strokeWidth="4" />
          <line x1="430" y1="250" x2="480" y2="250" strokeWidth="4" />

          <text
            x="250"
            y="310"
            textAnchor="middle"
            fill="currentColor"
            fontSize="18"
            fontWeight="bold"
            letterSpacing="6"
            stroke="none"
          >
            BIG BOSS
          </text>
        </svg>
      </div>
    </div>
  );
};
