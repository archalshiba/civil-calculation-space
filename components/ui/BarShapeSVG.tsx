import React from 'react';
import type { ReinforcementBar } from '../../types';

interface BarShapeSVGProps {
  shapeCode: ReinforcementBar['shapeCode'];
  className?: string;
}

const BarShapeSVG: React.FC<BarShapeSVGProps> = ({ shapeCode, className = 'w-16 h-12' }) => {
  const strokeColor = "#e5e7eb";
  const strokeWidth = "2";

  const getShape = () => {
    switch (shapeCode) {
      case 'straight':
        return <line x1="5" y1="20" x2="55" y2="20" />;
      case 'L-bend':
        return <path d="M 10 5 v 30 h 30" />;
      case 'stirrup':
        return (
            <>
                <path d="M 10 35 v -25 a 5 5 0 0 1 5 -5 h 20 a 5 5 0 0 1 5 5 v 25" />
                <path d="M 15 5 L 5 15" />
                <path d="M 35 5 L 45 15" />
            </>
        );
      case 'tie':
        return (
            <>
                <rect x="10" y="5" width="30" height="30" rx="3" />
                <path d="M 30 5 L 40 15 L 30 25" />
            </>
        );
      case 'spiral':
         return <path d="M 30 5 C 45 5, 45 15, 30 15 C 15 15, 15 25, 30 25 C 45 25, 45 35, 30 35" />;
      default:
        return <line x1="5" y1="20" x2="55" y2="20" />;
    }
  };

  return (
    <svg viewBox="0 0 60 40" className={className} stroke={strokeColor} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round">
      {getShape()}
    </svg>
  );
};

export default BarShapeSVG;