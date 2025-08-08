import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Outer ring with gradient */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <linearGradient id="innerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>
        </defs>
        
        {/* Outer ring */}
        <circle
          cx="24"
          cy="24"
          r="22"
          stroke="url(#logoGradient)"
          strokeWidth="2"
          fill="none"
          className="animate-pulse"
        />
        
        {/* Inner geometric shape representing AI/Neural network */}
        <g transform="translate(24, 24)">
          {/* Central node */}
          <circle
            cx="0"
            cy="0"
            r="4"
            fill="url(#innerGradient)"
            className="animate-ping"
          />
          
          {/* Connecting lines representing neural connections */}
          <line
            x1="-8"
            y1="-8"
            x2="0"
            y2="0"
            stroke="url(#logoGradient)"
            strokeWidth="1.5"
            className="animate-pulse"
          />
          <line
            x1="8"
            y1="-8"
            x2="0"
            y2="0"
            stroke="url(#logoGradient)"
            strokeWidth="1.5"
            className="animate-pulse"
          />
          <line
            x1="-8"
            y1="8"
            x2="0"
            y2="0"
            stroke="url(#logoGradient)"
            strokeWidth="1.5"
            className="animate-pulse"
          />
          <line
            x1="8"
            y1="8"
            x2="0"
            y2="0"
            stroke="url(#logoGradient)"
            strokeWidth="1.5"
            className="animate-pulse"
          />
          
          {/* Outer nodes representing 3D transformation */}
          <circle
            cx="-8"
            cy="-8"
            r="2"
            fill="url(#innerGradient)"
            className="animate-bounce"
          />
          <circle
            cx="8"
            cy="-8"
            r="2"
            fill="url(#innerGradient)"
            className="animate-bounce"
            style={{ animationDelay: '0.1s' }}
          />
          <circle
            cx="-8"
            cy="8"
            r="2"
            fill="url(#innerGradient)"
            className="animate-bounce"
            style={{ animationDelay: '0.2s' }}
          />
          <circle
            cx="8"
            cy="8"
            r="2"
            fill="url(#innerGradient)"
            className="animate-bounce"
            style={{ animationDelay: '0.3s' }}
          />
        </g>
        
        {/* Futuristic accent lines */}
        <path
          d="M 6 24 L 12 24 M 36 24 L 42 24"
          stroke="url(#logoGradient)"
          strokeWidth="1"
          className="animate-pulse"
        />
        <path
          d="M 24 6 L 24 12 M 24 36 L 24 42"
          stroke="url(#logoGradient)"
          strokeWidth="1"
          className="animate-pulse"
        />
      </svg>
    </div>
  );
};
