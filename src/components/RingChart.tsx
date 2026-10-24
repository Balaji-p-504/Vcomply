import React from 'react';
import { useAnimatedCounter, useInView } from '../hooks/useAnimations';

interface RingChartProps {
  value: number;
  maxValue?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trailColor?: string;
  label?: string;
  sublabel?: string;
  suffix?: string;
}

export const RingChart: React.FC<RingChartProps> = ({
  value,
  maxValue = 100,
  size = 120,
  strokeWidth = 8,
  color = '#6366f1',
  trailColor = 'rgba(255,255,255,0.06)',
  label,
  sublabel,
  suffix = '',
}) => {
  const [ref, isInView] = useInView(0.3);
  const animatedValue = useAnimatedCounter(isInView ? value : 0, 1400);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const animatedPercentage = Math.min(animatedValue / maxValue, 1);
  const strokeDashoffset = circumference * (1 - animatedPercentage);

  return (
    <div ref={ref} className="ring-chart-container">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Trail circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trailColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: 'stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)',
            filter: `drop-shadow(0 0 6px ${color}40)`,
          }}
        />
      </svg>
      <div className="ring-chart-center">
        <span className="ring-chart-value" style={{ color }}>
          {animatedValue}{suffix}
        </span>
        {label && <span className="ring-chart-label">{label}</span>}
        {sublabel && <span className="ring-chart-sublabel">{sublabel}</span>}
      </div>
    </div>
  );
};
