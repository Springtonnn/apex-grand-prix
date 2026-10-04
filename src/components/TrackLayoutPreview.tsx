import React from 'react';
import { getTrackLayout, TrackLayoutData } from '../data/trackLayouts';

interface TrackLayoutPreviewProps {
  circuitId?: string;
  circuitName?: string;
  path?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  strokeColor?: string;
  glowColor?: string;
  showStartFinish?: boolean;
  showDirectionArrow?: boolean;
  showBadge?: boolean;
  interactive?: boolean;
}

/**
 * Reusable F1 Top-Down Track Layout Preview Component.
 * Pure SVG vector closed loop with authentic corners, start/finish line, and direction indicator.
 */
export const TrackLayoutPreview: React.FC<TrackLayoutPreviewProps> = ({
  circuitId,
  circuitName,
  path,
  className = '',
  width = 120,
  height = 75,
  strokeColor = '#f59e0b',
  glowColor = 'rgba(245, 158, 11, 0.4)',
  showStartFinish = true,
  showDirectionArrow = true,
  showBadge = false,
  interactive = false,
}) => {
  const layout: TrackLayoutData = getTrackLayout(circuitId || circuitName);
  const trackPath = path || layout.path;
  const filterId = `track-glow-${layout.id}`;
  const gradientId = `track-grad-${layout.id}`;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${
        interactive ? 'group hover:scale-105 transition-transform duration-200' : ''
      } ${className}`}
      style={{ width, height }}
      title={`${layout.name} Layout (${layout.circuitType})`}
    >
      <svg
        viewBox="0 0 160 100"
        className="w-full h-full overflow-visible drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle Outer Neon Glow Filter */}
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Premium Metallic / Neon Track Gradient */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>

        {/* 1. Track Asphalt Foundation Ribbon (Thick Sub-Layer) */}
        <path
          d={trackPath}
          stroke="#182232"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.8"
        />

        {/* 2. Soft Ambient Underglow */}
        <path
          d={trackPath}
          stroke={glowColor}
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter={`url(#${filterId})`}
          opacity="0.5"
        />

        {/* 3. Crisp Racing Line Ribbon (Primary Neon Path) */}
        <path
          d={trackPath}
          stroke={`url(#${gradientId})`}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className="transition-all duration-300"
        />

        {/* 4. Start / Finish Line Indicator (Perpendicular White/Black Bar) */}
        {showStartFinish && (
          <g
            transform={`translate(${layout.startFinish.x}, ${layout.startFinish.y}) rotate(${layout.startFinish.angle})`}
          >
            {/* White Checkered / Tick Mark Across Track */}
            <line
              x1="0"
              y1="-5.5"
              x2="0"
              y2="5.5"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="square"
            />
            <line
              x1="-1.5"
              y1="-5.5"
              x2="-1.5"
              y2="5.5"
              stroke="#ef4444"
              strokeWidth="1.2"
              opacity="0.9"
            />
          </g>
        )}

        {/* 5. Direction of Travel Chevron / Arrow */}
        {showDirectionArrow && (
          <g
            transform={`translate(${layout.arrow.x}, ${layout.arrow.y}) rotate(${layout.arrow.angle})`}
          >
            <polygon
              points="-3,-3 4,0 -3,3 -1,0"
              fill="#fbbf24"
              stroke="#0f172a"
              strokeWidth="0.6"
              className="drop-shadow"
            />
          </g>
        )}
      </svg>

      {/* Optional Circuit Type Badge */}
      {showBadge && (
        <span className="absolute bottom-1 right-1 text-[8px] font-mono uppercase bg-slate-900/80 text-slate-300 px-1.5 py-0.2 rounded border border-slate-700/60 backdrop-blur-sm pointer-events-none">
          {layout.circuitType === 'Street Circuit'
            ? 'STREET'
            : layout.circuitType === 'Road Circuit'
            ? 'ROAD'
            : 'RACE'}
        </span>
      )}
    </div>
  );
};

/**
 * Global helper function to render track layout directly.
 */
export function renderTrackLayout(
  circuitId?: string,
  options?: {
    circuitName?: string;
    path?: string;
    width?: number | string;
    height?: number | string;
    className?: string;
    showBadge?: boolean;
  }
) {
  return (
    <TrackLayoutPreview
      circuitId={circuitId}
      circuitName={options?.circuitName}
      path={options?.path}
      width={options?.width ?? 120}
      height={options?.height ?? 75}
      className={options?.className}
      showBadge={options?.showBadge}
    />
  );
}

export default TrackLayoutPreview;
