import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { C, FONT_MONO } from './theme';

export const Bg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(120% 120% at 50% 0%, ${C.navy2} 0%, ${C.navy} 60%)`,
      fontFamily: FONT_MONO,
      color: C.paper,
      padding: 64,
    }}
  >
    {children}
  </AbsoluteFill>
);

export const Label: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      fontFamily: FONT_MONO,
      fontSize: 18,
      letterSpacing: 3,
      textTransform: 'uppercase',
      color: C.indigo,
      ...style,
    }}
  >
    {children}
  </div>
);

// fade/slide a child in over a frame window
export const Reveal: React.FC<{
  from: number;
  dur?: number;
  y?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ from, dur = 16, y = 18, children, style }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [from, from + dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ty = interpolate(f, [from, from + dur], [y, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <div style={{ opacity: o, transform: `translateY(${ty}px)`, ...style }}>{children}</div>;
};
