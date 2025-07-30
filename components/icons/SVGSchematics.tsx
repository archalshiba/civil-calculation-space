
import React from 'react';

export const RectangularColumnSVG = ({ width: inputWidth = 1, depth: inputDepth = 1 }: { width?: number; depth?: number }) => {
    // Calculate a sane aspect ratio for visualization, preventing extreme shapes
    const aspectRatio = Math.max(0.4, Math.min(2.5, (inputWidth || 1) / (inputDepth || 1)));
    
    // Adjust dimensions while trying to maintain a similar visual area
    const svgW = 70 * Math.sqrt(aspectRatio);
    const svgH = 70 / Math.sqrt(aspectRatio);

    return (
      <svg width="200" height="150" viewBox="0 0 200 150" className="max-w-full h-auto transition-all duration-300 text-text-secondary">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
          </marker>
        </defs>
        
        {/* Elevation */}
        <g transform="translate(20, 10)">
          <rect x="0" y="0" width="60" height="130" fill="none" stroke="currentColor" strokeWidth="2" />
          <text x="30" y="120" fontFamily="sans-serif" fontSize="12" fill="currentColor" textAnchor="middle">Elevation</text>
        </g>
        
        {/* Dimension H */}
        <line x1="90" y1="10" x2="90" y2="140" stroke="currentColor" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
        <text x="100" y="75" fontFamily="sans-serif" fontSize="14" fill="currentColor">H</text>

        {/* Cross-section */}
        <g transform={`translate(${155 - svgW / 2}, ${85 - svgH / 2})`}>
            <rect x="0" y="0" width={svgW} height={svgH} fill="none" stroke="currentColor" strokeWidth="2" />
            
            {/* Dots for rebar */}
            <circle cx={svgW * 0.15} cy={svgH * 0.15} r="3" fill="currentColor" />
            <circle cx={svgW * 0.85} cy={svgH * 0.15} r="3" fill="currentColor" />
            <circle cx={svgW * 0.15} cy={svgH * 0.85} r="3" fill="currentColor" />
            <circle cx={svgW * 0.85} cy={svgH * 0.85} r="3" fill="currentColor" />
            
            <text x={svgW / 2} y={svgH + 15} fontFamily="sans-serif" fontSize="12" fill="currentColor" textAnchor="middle">Cross-section</text>
        </g>

        {/* Dimension b */}
        <line x1={155 - svgW / 2} y1="35" x2={155 + svgW / 2} y2="35" stroke="currentColor" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
        <text x="155" y="30" fontFamily="sans-serif" fontSize="14" fill="currentColor" textAnchor="middle">b</text>

        {/* Dimension h */}
        <line x1="105" y1={85 - svgH / 2} x2="105" y2={85 + svgH / 2} stroke="currentColor" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
        <text x="95" y="85" fontFamily="sans-serif" fontSize="14" fill="currentColor" textAnchor="middle">h</text>
      </svg>
    );
};

export const BundledBarsSVG = () => {
    return (
        <svg width="80" height="80" viewBox="0 0 80 80" className="max-w-full h-auto text-text-secondary">
            <g stroke="currentColor" strokeWidth="2" fill="currentColor">
                <g transform="translate(20, 20)">
                    <circle cx="0" cy="0" r="4" />
                    <circle cx="12" cy="0" r="4" />
                    <text x="0" y="25" fill="currentColor" fontSize="10" textAnchor="middle">2-Bar</text>
                </g>
                <g transform="translate(55, 20)">
                    <circle cx="0" cy="0" r="4" />
                    <circle cx="12" cy="0" r="4" />
                    <circle cx="6" cy="-10" r="4" />
                    <text x="6" y="25" fill="currentColor" fontSize="10" textAnchor="middle">3-Bar</text>
                </g>
                 <g transform="translate(37, 55)">
                    <circle cx="0" cy="0" r="4" />
                    <circle cx="12" cy="0" r="4" />
                    <circle cx="0" cy="-12" r="4" />
                    <circle cx="12" cy="-12" r="4" />
                    <text x="6" y="20" fill="currentColor" fontSize="10" textAnchor="middle">4-Bar</text>
                </g>
            </g>
        </svg>
    )
}

export const TieShapeSVG = () => {
    return (
        <svg width="200" height="150" viewBox="0 0 200 150" className="max-w-full h-auto text-text-secondary">
             <g fill="none" stroke="currentColor" strokeWidth="2">
                {/* Rectangular Tie */}
                <rect x="10" y="10" width="80" height="130" rx="8" />
                <path d="M 80 10 L 90 20 L 80 30" />
                <circle cx="20" cy="20" r="4" fill="currentColor" />
                <circle cx="80" cy="20" r="4" fill="currentColor" />
                <circle cx="20" cy="130" r="4" fill="currentColor" />
                <circle cx="80" cy="130" r="4" fill="currentColor" />
                <text x="50" y="100" fill="currentColor" fontSize="12" textAnchor="middle">Rectangular</text>

                {/* Circular/Spiral Tie */}
                <circle cx="150" cy="75" r="40" />
                <circle cx="150" cy="35" r="4" fill="currentColor" />
                <circle cx="185" cy="75" r="4" fill="currentColor" />
                <circle cx="150" cy="115" r="4" fill="currentColor" />
                <circle cx="115" cy="75" r="4" fill="currentColor" />
                <text x="150" y="135" fill="currentColor" fontSize="12" textAnchor="middle">Circular / Spiral</text>
            </g>
        </svg>
    )
}

export const CircularColumnSVG = () => {
    return (
      <svg width="200" height="150" viewBox="0 0 200 150" className="max-w-full h-auto text-text-secondary">
        <defs>
          <marker id="arrow-circ" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
          </marker>
        </defs>
        
        {/* Elevation */}
        <g transform="translate(20, 10)">
          <rect x="0" y="0" width="60" height="130" fill="none" stroke="currentColor" strokeWidth="2" />
          <text x="30" y="120" fontFamily="sans-serif" fontSize="12" fill="currentColor" textAnchor="middle">Elevation</text>
        </g>
        
        {/* Dimension H */}
        <line x1="90" y1="10" x2="90" y2="140" stroke="currentColor" strokeWidth="1" markerStart="url(#arrow-circ)" markerEnd="url(#arrow-circ)" />
        <text x="100" y="75" fontFamily="sans-serif" fontSize="14" fill="currentColor">H</text>

        {/* Cross-section */}
        <g transform="translate(155, 85)">
            <circle cx="0" cy="-15" r="35" fill="none" stroke="currentColor" strokeWidth="2" />
            
            {/* Dots for rebar */}
            <circle cx="0" cy="-45" r="3" fill="currentColor" />
            <circle cx="30.3" cy="-30" r="3" fill="currentColor" />
            <circle cx="30.3" cy="0" r="3" fill="currentColor" />
            <circle cx="0" cy="15" r="3" fill="currentColor" />
            <circle cx="-30.3" cy="0" r="3" fill="currentColor" />
            <circle cx="-30.3" cy="-30" r="3" fill="currentColor" />

            <text x="0" y="35" fontFamily="sans-serif" fontSize="12" fill="currentColor" textAnchor="middle">Cross-section</text>
        </g>

        {/* Dimension D */}
        <line x1="120" y1="70" x2="190" y2="70" stroke="currentColor" strokeWidth="1" markerStart="url(#arrow-circ)" markerEnd="url(#arrow-circ)" />
        <text x="155" y="65" fontFamily="sans-serif" fontSize="14" fill="currentColor" textAnchor="middle">D</text>
      </svg>
    );
};

export const SpiralReinforcementSVG = () => {
    return (
        <svg width="120" height="150" viewBox="0 0 120 150" className="max-w-full h-auto text-text-secondary">
            <defs>
              <marker id="arrow-spiral" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
              </marker>
            </defs>
            <g fill="none" stroke="currentColor" strokeWidth="2">
                {/* Column outline */}
                <line x1="30" y1="10" x2="30" y2="140" />
                <line x1="90" y1="10" x2="90" y2="140" />
                
                {/* Spiral */}
                <path d="M 60 20 C 80 20, 80 35, 60 35 C 40 35, 40 50, 60 50 C 80 50, 80 65, 60 65 C 40 65, 40 80, 60 80 C 80 80, 80 95, 60 95 C 40 95, 40 110, 60 110 C 80 110, 80 125, 60 125" />
            </g>
            {/* Pitch dimension */}
            <line x1="15" y1="50" x2="15" y2="65" stroke="currentColor" strokeWidth="1" markerStart="url(#arrow-spiral)" markerEnd="url(#arrow-spiral)" />
            <text x="5" y="60" fill="currentColor" fontSize="12" textAnchor="start">p</text>
            <text x="60" y="145" fill="currentColor" fontSize="12" textAnchor="middle">Spiral Elevation</text>
        </svg>
    )
}

export const RectangularBeamSVG = () => {
  return (
    <svg width="200" height="150" viewBox="0 0 200 150" className="max-w-full h-auto text-text-secondary">
        <defs>
          <marker id="arrow-beam" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
          </marker>
        </defs>
        
        {/* Elevation */}
        <g transform="translate(10, 50)">
          <rect x="0" y="0" width="180" height="50" fill="none" stroke="currentColor" strokeWidth="2" />
          <line x1="0" y1="45" x2="180" y2="45" stroke="currentColor" strokeDasharray="4 2" />
          <line x1="0" y1="5" x2="180" y2="5" stroke="currentColor" strokeDasharray="4 2" />
        </g>
        
        {/* Dimension L */}
        <line x1="10" y1="115" x2="190" y2="115" stroke="currentColor" strokeWidth="1" markerStart="url(#arrow-beam)" markerEnd="url(#arrow-beam)" />
        <text x="100" y="130" fontFamily="sans-serif" fontSize="14" fill="currentColor" textAnchor="middle">Span (L)</text>

        {/* Support symbols */}
        <path d="M 10 100 l 10 10 l -20 0 z" fill="currentColor" />
        <circle cx="190" cy="105" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
        <line x1="180" y1="110" x2="200" y2="110" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
};

export const TBeamSVG = () => {
  return (
    <svg width="200" height="150" viewBox="0 0 200 150" className="max-w-full h-auto text-text-secondary">
        <defs>
          <marker id="arrow-tbeam" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
          </marker>
        </defs>
        {/* T-Beam Shape */}
        <path d="M 20 20 H 180 V 50 H 110 V 130 H 90 V 50 H 20 Z" fill="none" stroke="currentColor" strokeWidth="2" />

        {/* Dimensions */}
        <g fill="currentColor" fontSize="12" fontFamily="sans-serif">
            {/* Flange Width (bf) */}
            <line x1="20" y1="15" x2="180" y2="15" stroke="currentColor" strokeWidth="1" markerStart="url(#arrow-tbeam)" markerEnd="url(#arrow-tbeam)" />
            <text x="100" y="10" textAnchor="middle">bf</text>

            {/* Flange Thickness (hf) */}
            <line x1="185" y1="20" x2="185" y2="50" stroke="currentColor" strokeWidth="1" markerStart="url(#arrow-tbeam)" markerEnd="url(#arrow-tbeam)" />
            <text x="190" y="35">hf</text>

            {/* Web Width (bw) */}
            <line x1="90" y1="135" x2="110" y2="135" stroke="currentColor" strokeWidth="1" markerStart="url(#arrow-tbeam)" markerEnd="url(#arrow-tbeam)" />
            <text x="100" y="145" textAnchor="middle">bw</text>

            {/* Overall Depth (h) */}
            <line x1="15" y1="20" x2="15" y2="130" stroke="currentColor" strokeWidth="1" markerStart="url(#arrow-tbeam)" markerEnd="url(#arrow-tbeam)" />
            <text x="5" y="75">h</text>
        </g>
    </svg>
  );
};

export const StirrupConfigSVG = () => {
  return (
    <svg width="150" height="100" viewBox="0 0 150 100" className="max-w-full h-auto text-text-secondary">
      <g fill="none" stroke="currentColor" strokeWidth="2">
        {/* Closed Stirrup */}
        <g transform="translate(10, 10)">
            <rect x="0" y="0" width="50" height="80" rx="5" />
            <path d="M 40 0 L 50 10 L 40 20" />
            <text x="25" y="95" fill="currentColor" fontSize="12" textAnchor="middle">Closed</text>
        </g>
        {/* Open Stirrup */}
        <g transform="translate(80, 10)">
            <path d="M 0 80 V 5 a 5 5 0 0 1 5 -5 h 40 a 5 5 0 0 1 5 5 v 75" />
            <path d="M 5 0 L -5 10" />
            <path d="M 45 0 L 55 10" />
            <text x="25" y="95" fill="currentColor" fontSize="12" textAnchor="middle">Open</text>
        </g>
      </g>
    </svg>
  );
};

export const OneWaySlabSVG = () => {
  return (
    <svg width="200" height="150" viewBox="0 0 200 150" className="max-w-full h-auto text-text-secondary">
        <defs>
          <marker id="arrow-slab" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
          </marker>
        </defs>
        
        {/* Slab Cross-section */}
        <g transform="translate(10, 50)">
          <rect x="0" y="0" width="180" height="30" fill="none" stroke="currentColor" strokeWidth="2" />
          
          {/* Main Reinforcement (bottom) */}
          <circle cx="20" cy="20" r="3" fill="currentColor" />
          <circle cx="50" cy="20" r="3" fill="currentColor" />
          <circle cx="80" cy="20" r="3" fill="currentColor" />
          <circle cx="110" cy="20" r="3" fill="currentColor" />
          <circle cx="140" cy="20" r="3" fill="currentColor" />
          <circle cx="170" cy="20" r="3" fill="currentColor" />
          <text x="95" y="45" fontFamily="sans-serif" fontSize="10" fill="currentColor" textAnchor="middle">Main Reinforcement</text>
          
          {/* Temp/Shrinkage Reinforcement (top) */}
          <circle cx="35" cy="10" r="2.5" fill="currentColor" opacity="0.7"/>
          <circle cx="95" cy="10" r="2.5" fill="currentColor" opacity="0.7"/>
          <circle cx="155" cy="10" r="2.5" fill="currentColor" opacity="0.7"/>
          <text x="95" y="-5" fontFamily="sans-serif" fontSize="10" fill="currentColor" textAnchor="middle">Temp/Shrinkage Bars</text>

        </g>
        <text x="100" y="110" fontFamily="sans-serif" fontSize="12" fill="currentColor" textAnchor="middle">Cross-section</text>

        
        {/* Dimension h (thickness) */}
        <line x1="195" y1="50" x2="195" y2="80" stroke="currentColor" strokeWidth="1" markerStart="url(#arrow-slab)" markerEnd="url(#arrow-slab)" />
        <text x="185" y="65" fontFamily="sans-serif" fontSize="14" fill="currentColor" textAnchor="end">h</text>
    </svg>
  );
};

export const TwoWaySlabSVG = () => {
  return (
    <svg width="200" height="150" viewBox="0 0 200 150" className="max-w-full h-auto text-text-secondary">
        {/* Slab Outline */}
        <rect x="10" y="10" width="180" height="130" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" />

        {/* Reinforcement Grid */}
        <g stroke="currentColor" strokeWidth="1" strokeOpacity="0.7">
            {/* Long Direction Bars (Vertical) */}
            <line x1="30" y1="10" x2="30" y2="140" />
            <line x1="60" y1="10" x2="60" y2="140" />
            <line x1="90" y1="10" x2="90" y2="140" />
            <line x1="120" y1="10" x2="120" y2="140" />
            <line x1="150" y1="10" x2="150" y2="140" />
            <line x1="180" y1="10" x2="180" y2="140" />

            {/* Short Direction Bars (Horizontal) */}
            <line x1="10" y1="30" x2="190" y2="30" strokeOpacity="1" strokeWidth="1.5" />
            <line x1="10" y1="60" x2="190" y2="60" strokeOpacity="1" strokeWidth="1.5" />
            <line x1="10" y1="90" x2="190" y2="90" strokeOpacity="1" strokeWidth="1.5" />
            <line x1="10" y1="120" x2="190" y2="120" strokeOpacity="1" strokeWidth="1.5" />
        </g>
        
        <text x="100" y="80" fontFamily="sans-serif" fontSize="10" fill="currentColor" textAnchor="middle">Plan View</text>
    </svg>
  );
};

export const IsolatedFootingSVG = () => {
    return (
        <svg width="200" height="150" viewBox="0 0 200 150" className="max-w-full h-auto text-text-secondary">
            <defs>
              <marker id="arrow-footing" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
              </marker>
            </defs>
            
            <g stroke="currentColor" strokeWidth="1.5">
                {/* Base of footing */}
                <path d="M 20 120 L 70 140 L 180 100 L 130 80 Z" strokeOpacity="0.5" fill="currentColor" fillOpacity="0.1"/>
                {/* Top of footing */}
                <path d="M 20 90 L 70 110 L 180 70 L 130 50 Z" strokeOpacity="0.8" fill="currentColor" fillOpacity="0.2" />
                {/* Vertical edges */}
                <line x1="20" y1="90" x2="20" y2="120" />
                <line x1="70" y1="110" x2="70" y2="140" />
                <line x1="180" y1="70" x2="180" y2="100" />
                <line x1="130" y1="50" x2="130" y2="80" />
            </g>

            {/* Dowel bars */}
             <g stroke="currentColor" strokeWidth="2" fill="none">
                <line x1="95" y1="40" x2="95" y2="80" />
                <line x1="105" y1="38" x2="105" y2="78" />
                <line x1="115" y1="36" x2="115" y2="76" />
                <line x1="125" y1="34" x2="125" y2="74" />
             </g>

            {/* Dimensions */}
            <g fill="currentColor" fontSize="14" fontFamily="sans-serif">
                {/* Length (L) */}
                <line x1="75" y1="145" x2="185" y2="105" stroke="currentColor" strokeWidth="1" markerStart="url(#arrow-footing)" markerEnd="url(#arrow-footing)" />
                <text x="135" y="135">L</text>
                {/* Width (W) */}
                <line x1="15" y1="125" x2="65" y2="145" stroke="currentColor" strokeWidth="1" markerStart="url(#arrow-footing)" markerEnd="url(#arrow-footing)" />
                <text x="30" y="145">W</text>
                 {/* Depth (H) */}
                <line x1="185" y1="75" x2="185" y2="105" stroke="currentColor" strokeWidth="1" markerStart="url(#arrow-footing)" markerEnd="url(#arrow-footing)" />
                <text x="190" y="90">H</text>
            </g>
        </svg>
    )
};

export const CombinedFootingSVG = () => {
    return (
        <svg width="200" height="150" viewBox="0 0 200 150" className="max-w-full h-auto text-text-secondary">
            <defs>
              <marker id="arrow-footing-comb" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
              </marker>
            </defs>
            
            {/* Footing body */}
            <g stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2">
                <rect x="10" y="80" width="180" height="40" />
            </g>

            {/* Columns */}
            <g stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.5">
                <rect x="40" y="50" width="30" height="30" />
                <rect x="130" y="50" width="30" height="30" />
            </g>

            {/* Dimensions */}
            <g fill="currentColor" fontSize="12" fontFamily="sans-serif">
                {/* Length (L) */}
                <line x1="10" y1="130" x2="190" y2="130" stroke="currentColor" strokeWidth="1" markerStart="url(#arrow-footing-comb)" markerEnd="url(#arrow-footing-comb)" />
                <text x="100" y="145" textAnchor="middle">Length (L)</text>
                
                {/* Width (W) */}
                <line x1="195" y1="80" x2="195" y2="120" stroke="currentColor" strokeWidth="1" markerStart="url(#arrow-footing-comb)" markerEnd="url(#arrow-footing-comb)" />
                <text x="185" y="100" writingMode="vertical-rl" textAnchor="middle">W</text>
                
                {/* Column Spacing (S) */}
                <line x1="55" y1="45" x2="145" y2="45" stroke="currentColor" strokeWidth="1" markerStart="url(#arrow-footing-comb)" markerEnd="url(#arrow-footing-comb)" />
                <text x="100" y="38" textAnchor="middle">Spacing (S)</text>
            </g>
        </svg>
    )
};

export const StripFootingSVG = () => {
    return (
        <svg width="200" height="150" viewBox="0 0 200 150" className="max-w-full h-auto text-text-secondary">
            <defs>
                <marker id="arrow-strip" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
                </marker>
            </defs>
            
            <g stroke="currentColor" strokeWidth="1.5" fill="currentColor">
                {/* Front face of footing */}
                <path d="M 20 130 L 20 80 L 180 80 L 180 130 Z" strokeOpacity="0.5" fillOpacity="0.1"/>
                {/* Top face */}
                <path d="M 20 80 L 40 65 L 200 65 L 180 80 Z" strokeOpacity="0.8" fillOpacity="0.2" />
                {/* Side face */}
                <path d="M 180 80 L 200 65 L 200 115 L 180 130 Z" strokeOpacity="0.8" fillOpacity="0.2" />
            </g>

            {/* Reinforcement */}
            <g stroke="currentColor" strokeWidth="1" strokeOpacity="0.7">
                {/* Longitudinal bars */}
                <line x1="30" y1="75" x2="190" y2="75" />
                <line x1="30" y1="85" x2="190" y2="85" />
                {/* Transverse bars (dots in this view) */}
                <circle cx="50" cy="110" r="2" fill="currentColor"/>
                <circle cx="80" cy="110" r="2" fill="currentColor"/>
                <circle cx="110" cy="110" r="2" fill="currentColor"/>
                <circle cx="140" cy="110" r="2" fill="currentColor"/>
            </g>

            {/* Wall on top */}
            <rect x="20" y="30" width="160" height="50" fill="none" stroke="currentColor" strokeDasharray="4 2"/>
            <text x="100" y="55" fill="currentColor" fontSize="12" textAnchor="middle">Load-Bearing Wall</text>

            {/* Dimensions */}
            <g fill="currentColor" fontSize="14" fontFamily="sans-serif">
                {/* Width (W) */}
                <line x1="40" y1="60" x2="200" y2="60" stroke="currentColor" strokeWidth="1" markerStart="url(#arrow-strip)" markerEnd="url(#arrow-strip)" />
                <text x="120" y="55" textAnchor="middle">Width (W)</text>
                {/* Thickness (H) */}
                <line x1="15" y1="80" x2="15" y2="130" stroke="currentColor" strokeWidth="1" markerStart="url(#arrow-strip)" markerEnd="url(#arrow-strip)" />
                <text x="5" y="105">H</text>
            </g>
        </svg>
    )
};

export const PileCapSVG = () => {
    return (
        <svg width="200" height="150" viewBox="0 0 200 150" className="max-w-full h-auto text-text-secondary">
            <defs>
                <marker id="arrow-pilecap" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
                </marker>
            </defs>

            {/* Pile Cap Body */}
            <g stroke="currentColor" strokeWidth="1.5" fill="currentColor">
                <path d="M 20 100 L 20 50 L 180 50 L 180 100 Z" strokeOpacity="0.5" fillOpacity="0.1" /> {/* Front Face */}
                <path d="M 20 50 L 40 35 L 200 35 L 180 50 Z" strokeOpacity="0.8" fillOpacity="0.2" /> {/* Top Face */}
                <path d="M 180 50 L 200 35 L 200 85 L 180 100 Z" strokeOpacity="0.8" fillOpacity="0.2" /> {/* Side Face */}
            </g>

            {/* Piles (4-pile group example) */}
            <g fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1">
                <ellipse cx="60" cy="100" rx="15" ry="5" />
                <ellipse cx="140" cy="100" rx="15" ry="5" />
                <ellipse cx="80" cy="85" rx="15" ry="5" />
                <ellipse cx="160" cy="85" rx="15" ry="5" />
            </g>

            {/* Dimensions */}
            <g fill="currentColor" fontSize="12" fontFamily="sans-serif">
                {/* Length (L) */}
                <line x1="20" y1="110" x2="180" y2="110" stroke="currentColor" strokeWidth="1" markerStart="url(#arrow-pilecap)" markerEnd="url(#arrow-pilecap)" />
                <text x="100" y="125" textAnchor="middle">Length</text>
                
                {/* Thickness (H) */}
                <line x1="185" y1="50" x2="185" y2="100" stroke="currentColor" strokeWidth="1" markerStart="url(#arrow-pilecap)" markerEnd="url(#arrow-pilecap)" />
                <text x="190" y="75">H</text>
                
                {/* Pile Spacing (S) */}
                <line x1="60" y1="105" x2="140" y2="105" stroke="currentColor" strokeWidth="1" markerStart="url(#arrow-pilecap)" markerEnd="url(#arrow-pilecap)" />
                <text x="100" y="95" textAnchor="middle">Spacing</text>
            </g>
        </svg>
    )
};

export const RectangularWallSVG = () => {
    return (
        <svg width="200" height="150" viewBox="0 0 200 150" className="max-w-full h-auto text-text-secondary">
            <defs>
                <marker id="arrow-wall" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
                </marker>
            </defs>
            
            <g stroke="currentColor" strokeWidth="1.5" fill="currentColor">
                {/* Front face of wall */}
                <path d="M 20 140 L 20 20 L 180 20 L 180 140 Z" strokeOpacity="0.5" fillOpacity="0.1"/>
                {/* Top face */}
                <path d="M 20 20 L 40 5 L 200 5 L 180 20 Z" strokeOpacity="0.8" fillOpacity="0.2" />
                {/* Side face */}
                <path d="M 180 20 L 200 5 L 200 125 L 180 140 Z" strokeOpacity="0.8" fillOpacity="0.2" />
            </g>

            {/* Reinforcement grid */}
                <g stroke="currentColor" strokeWidth="1" strokeOpacity="0.5">
                {/* Vertical bars */}
                <line x1="40" y1="25" x2="40" y2="135" />
                <line x1="70" y1="25" x2="70" y2="135" />
                <line x1="100" y1="25" x2="100" y2="135" />
                <line x1="130" y1="25" x2="130" y2="135" />
                <line x1="160" y1="25" x2="160" y2="135" />
                {/* Horizontal bars */}
                <line x1="20" y1="40" x2="180" y2="40" />
                <line x1="20" y1="70" x2="180" y2="70" />
                <line x1="20" y1="100" x2="180" y2="100" />
                <line x1="20" y1="130" x2="180" y2="130" />
                </g>

            {/* Dimensions */}
            <g fill="currentColor" fontSize="14" fontFamily="sans-serif">
                {/* Length (L) */}
                <line x1="20" y1="145" x2="180" y2="145" stroke="currentColor" strokeWidth="1" markerStart="url(#arrow-wall)" markerEnd="url(#arrow-wall)" />
                <text x="100" y="135" textAnchor="middle">L</text>
                {/* Height (H) */}
                <line x1="15" y1="20" x2="15" y2="140" stroke="currentColor" strokeWidth="1" markerStart="url(#arrow-wall)" markerEnd="url(#arrow-wall)" />
                <text x="5" y="80">H</text>
                    {/* Thickness (t) */}
                <line x1="20" y1="15" x2="40" y2="0" stroke="currentColor" strokeWidth="1" markerStart="url(#arrow-wall)" markerEnd="url(#arrow-wall)" />
                <text x="45" y="10">t</text>
            </g>
        </svg>
    )
};

export const RetainingWallSVG = () => {
    return (
        <svg width="200" height="150" viewBox="0 0 200 150" className="max-w-full h-auto text-text-secondary">
            <defs>
              <marker id="arrow-retaining" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
              </marker>
            </defs>
            
            {/* Wall Shape */}
            <path d="M 70 20 L 85 20 L 100 120 L 10 120 L 10 135 L 190 135 L 190 120 L 100 120 Z" fill="none" stroke="currentColor" strokeWidth="2" />
    
            {/* Retained soil */}
            <path d="M 100 120 L 100 20 L 190 20 L 190 120 Z" fill="currentColor" fillOpacity="0.1" />
            <text x="145" y="70" fill="currentColor" fontSize="10" textAnchor="middle">Retained Soil</text>
    
            {/* Dimensions */}
            <g fill="currentColor" fontSize="12" fontFamily="sans-serif">
                {/* Stem Height */}
                <line x1="65" y1="20" x2="65" y2="120" stroke="currentColor" strokeWidth="1" markerStart="url(#arrow-retaining)" markerEnd="url(#arrow-retaining)" />
                <text x="45" y="70">Stem H</text>
    
                {/* Footing Thickness */}
                <line x1="5" y1="120" x2="5" y2="135" stroke="currentColor" strokeWidth="1" markerStart="url(#arrow-retaining)" markerEnd="url(#arrow-retaining)" />
                <text x="10" y="115" writingMode="vertical-rl" textAnchor="middle">Footing H</text>
                
                {/* Toe Length */}
                <line x1="10" y1="140" x2="100" y2="140" stroke="currentColor" strokeWidth="1" markerStart="url(#arrow-retaining)" markerEnd="url(#arrow-retaining)" />
                <text x="55" y="135" textAnchor="middle">Toe</text>
    
                {/* Heel Length */}
                <line x1="100" y1="140" x2="190" y2="140" stroke="currentColor" strokeWidth="1" markerStart="url(#arrow-retaining)" markerEnd="url(#arrow-retaining)" />
                <text x="145" y="135" textAnchor="middle">Heel</text>
    
                {/* Stem Thickness Top */}
                <line x1="70" y1="15" x2="85" y2="15" stroke="currentColor" strokeWidth="1" markerStart="url(#arrow-retaining)" markerEnd="url(#arrow-retaining)" />
                <text x="77" y="10" textAnchor="middle">t_top</text>
            </g>
        </svg>
      );
};

export const DiaphragmSVG = () => {
    return (
        <svg width="200" height="150" viewBox="0 0 200 150" className="max-w-full h-auto text-text-secondary">
            <g stroke="currentColor" strokeWidth="1.5" fill="none">
                {/* Diaphragm outline */}
                <rect x="10" y="10" width="180" height="130" fill="currentColor" fillOpacity="0.1" />

                {/* Chord Reinforcement */}
                <line x1="10" y1="15" x2="190" y2="15" stroke="currentColor" strokeWidth="2" />
                <line x1="10" y1="135" x2="190" y2="135" stroke="currentColor" strokeWidth="2" />
                <text x="100" y="30" fill="currentColor" fontSize="10" textAnchor="middle">Chord Reinforcement</text>

                {/* Collector Reinforcement */}
                <rect x="70" y="10" width="60" height="130" stroke="currentColor" strokeOpacity="0.5" strokeDasharray="4 4" />
                <text x="100" y="80" fill="currentColor" opacity="0.8" fontSize="10" textAnchor="middle" transform="rotate(90 100 80)">Collector</text>

                {/* Main Field Reinforcement */}
                <text x="40" y="80" fill="currentColor" opacity="0.8" fontSize="10" textAnchor="middle">Main Field</text>
            </g>
        </svg>
    )
};

export const BracketCorbelSVG = () => {
    return (
        <svg width="200" height="150" viewBox="0 0 200 150" className="max-w-full h-auto text-text-secondary">
            <defs>
              <marker id="arrow-corbel" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
              </marker>
            </defs>
            
            {/* Column and Bracket Outline */}
            <g stroke="currentColor" strokeWidth="2" fill="none">
                <path d="M 20 10 L 20 140" /> {/* Column line */}
                <path d="M 20 30 L 120 30 L 150 70 L 150 120 L 20 120" /> {/* Bracket shape */}
            </g>

            {/* Strut-and-Tie Model */}
            <g stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="5 3">
                <line x1="135" y1="35" x2="40" y2="110" /> {/* Compression Strut (dashed) */}
                <line x1="25" y1="35" x2="135" y2="35" /> {/* Tension Tie (dashed) */}
                <path d="M 135 35 v 15" /> {/* Applied Load Path */}
            </g>
            
            {/* Load Arrow */}
            <g fill="currentColor">
                <path d="M 135 50 L 130 40 L 140 40 Z" />
                <text x="145" y="45" fontSize="12">Vu</text>
            </g>

            {/* Dimensions */}
            <g fill="currentColor" fontSize="14" fontFamily="sans-serif">
                {/* Effective Depth (d) */}
                <line x1="155" y1="30" x2="155" y2="120" stroke="currentColor" strokeWidth="1" markerStart="url(#arrow-corbel)" markerEnd="url(#arrow-corbel)" />
                <text x="160" y="75">d</text>
                {/* Shear Span (av) */}
                <line x1="20" y1="25" x2="135" y2="25" stroke="currentColor" strokeWidth="1" markerStart="url(#arrow-corbel)" markerEnd="url(#arrow-corbel)" />
                <text x="77" y="20" textAnchor="middle">av</text>
            </g>
        </svg>
    )
};

export const BeamColumnJointSVG = () => {
    return (
        <svg width="200" height="150" viewBox="0 0 200 150" className="max-w-full h-auto text-text-secondary">
            <defs>
              <marker id="arrow-joint" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
              </marker>
            </defs>

            {/* Column and Beam Outline */}
            <g stroke="currentColor" strokeWidth="2" fill="none">
                <rect x="20" y="10" width="60" height="130" /> {/* Column */}
                <rect x="80" y="40" width="110" height="40" /> {/* Beam */}
            </g>

            {/* Joint Core Area Highlight */}
            <rect x="20" y="40" width="60" height="40" fill="var(--color-primary)" fillOpacity="0.2" stroke="var(--color-primary)" strokeWidth="1" />
            <text x="50" y="65" fill="currentColor" fontSize="10" textAnchor="middle">Joint Core</text>

            {/* Dimensions */}
            <g fill="currentColor" fontSize="14" fontFamily="sans-serif">
                {/* Column Depth (h_col) */}
                <line x1="15" y1="10" x2="15" y2="140" stroke="currentColor" strokeWidth="1" markerStart="url(#arrow-joint)" markerEnd="url(#arrow-joint)" />
                <text x="5" y="80" writingMode="vertical-rl" textAnchor="middle">h_col</text>

                {/* Beam Depth (h_beam) */}
                <line x1="80" y1="35" x2="190" y2="35" stroke="currentColor" strokeWidth="1" markerStart="url(#arrow-joint)" markerEnd="url(#arrow-joint)" />
                <text x="135" y="30" textAnchor="middle">h_beam</text>
            </g>
        </svg>
    )
};

export const AnchorageSVG = () => {
    return (
        <svg width="200" height="150" viewBox="0 0 200 150" className="max-w-full h-auto text-text-secondary">
            <defs>
                <marker id="arrow-anchor" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
                </marker>
            </defs>

            {/* Concrete block */}
            <path d="M 10 140 L 10 30 L 70 5 L 190 5 L 190 110 Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" />
            <path d="M 70 5 L 70 80" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <line x1="70" y1="80" x2="10" y2="105" stroke="currentColor" strokeWidth="1.5" />
            <line x1="70" y1="80" x2="190" y2="80" stroke="currentColor" strokeWidth="1.5" />

            {/* Anchors */}
            <g fill="currentColor" stroke="currentColor" strokeWidth="1">
                {/* Anchor 1 (for hef and ca1) */}
                <line x1="100" y1="5" x2="100" y2="50" />
                <rect x="95" y="50" width="10" height="5" />

                {/* Anchor 2 (for spacing) */}
                <line x1="140" y1="5" x2="140" y2="50" />
                <rect x="135" y="50" width="10" height="5" />
            </g>

            {/* Dimensions */}
            <g fill="currentColor" fontSize="12" fontFamily="sans-serif">
                {/* Embedment Depth (hef) */}
                <line x1="95" y1="5" x2="95" y2="50" stroke="currentColor" strokeWidth="1" markerStart="url(#arrow-anchor)" markerEnd="url(#arrow-anchor)" />
                <text x="80" y="30">hef</text>

                {/* Edge Distance (ca1) */}
                <line x1="100" y1="0" x2="190" y2="0" stroke="currentColor" strokeWidth="1" markerStart="url(#arrow-anchor)" markerEnd="url(#arrow-anchor)" />
                <text x="145" y="15" textAnchor="middle">ca1</text>

                {/* Spacing (s) */}
                <line x1="100" y1="60" x2="140" y2="60" stroke="currentColor" strokeWidth="1" markerStart="url(#arrow-anchor)" markerEnd="url(#arrow-anchor)" />
                <text x="120" y="75" textAnchor="middle">s</text>
            </g>
        </svg>
    );
};
