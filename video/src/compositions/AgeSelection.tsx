import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { Bg, Label, Reveal } from '../components';
import { C, FONT_DISPLAY, FONT_MONO } from '../theme';

// two age-distribution curves: causation skews young (coral), selection skews old (indigo)
const curve = (peak: number, color: string, p: number) => {
  const W = 900, H = 240, x0 = 120, y0 = 380;
  const pts: string[] = [];
  for (let i = 0; i <= 60; i++) {
    const t = i / 60;
    const x = x0 + t * W;
    const g = Math.exp(-Math.pow((t - peak) / 0.18, 2));
    const y = y0 - g * H;
    pts.push(`${x},${y}`);
  }
  const shown = Math.floor(interpolate(p, [0, 1], [0, pts.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  return <polyline points={pts.slice(0, shown).join(' ')} fill="none" stroke={color} strokeWidth={3.5} strokeLinejoin="round" strokeLinecap="round" />;
};

export const AgeSelection: React.FC = () => {
  const frame = useCurrentFrame();
  const p1 = interpolate(frame, [20, 70], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const p2 = interpolate(frame, [40, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Bg>
      <Reveal from={0}>
        <Label>Selection vs causation · patient age</Label>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 38, color: C.white, marginTop: 8 }}>
          Same enrichment, different <span style={{ color: C.coral }}>age signature</span>
        </div>
      </Reveal>
      <svg width={1152} height={420} style={{ marginTop: 16 }}>
        <line x1={120} y1={380} x2={1020} y2={380} stroke={C.line} strokeWidth={2} />
        <text x={120} y={408} fill={C.muted} fontFamily={FONT_MONO} fontSize={14}>younger patients</text>
        <text x={1020} y={408} fill={C.muted} fontFamily={FONT_MONO} fontSize={14} textAnchor="end">older patients</text>
        {curve(0.3, C.coral, p1)}
        {curve(0.72, C.indigo, p2)}
      </svg>
      <Reveal from={78} style={{ display: 'flex', justifyContent: 'center', gap: 50, marginTop: -8 }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 16, color: C.coral }}>● strong driver → younger</div>
        <div style={{ fontFamily: FONT_MONO, fontSize: 16, color: C.indigo }}>● selected, not causal → older</div>
      </Reveal>
    </Bg>
  );
};
