import React from 'react';
import { useCurrentFrame, interpolate, random } from 'remotion';
import { Bg, Label, Reveal } from '../components';
import { C, FONT_DISPLAY, FONT_MONO } from '../theme';

export const MpraGrammar: React.FC = () => {
  const frame = useCurrentFrame();
  const bars = 16;
  return (
    <Bg>
      <Reveal from={0}>
        <Label>MPRA · sequence → activity</Label>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 38, color: C.white, marginTop: 8 }}>
          Millions of fragments, each scored for <span style={{ color: C.coral }}>promoter activity</span>
        </div>
      </Reveal>

      {/* fragments dropping into a reporter, producing an activity bar chart */}
      <svg width={1152} height={460} style={{ marginTop: 20 }}>
        {/* reporter construct line */}
        <text x={80} y={90} fill={C.muted} fontFamily={FONT_MONO} fontSize={14}>DNA fragments</text>
        <text x={80} y={300} fill={C.muted} fontFamily={FONT_MONO} fontSize={14}>measured activity →</text>
        {Array.from({ length: bars }, (_, i) => {
          const x = 90 + i * 64;
          const drop = interpolate(frame, [i * 3, i * 3 + 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const fy = interpolate(drop, [0, 1], [110, 170]);
          const act = 30 + random(`h${i}`) * 150;
          const grow = interpolate(frame, [i * 3 + 14, i * 3 + 34], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const strong = act > 120;
          return (
            <g key={i}>
              {/* fragment chip */}
              <rect x={x} y={fy} width={48} height={20} rx={4} fill="none" stroke={C.indigo} strokeWidth={1.6} opacity={0.5 + drop * 0.5} />
              {/* activity bar */}
              <rect x={x + 6} y={400 - act * grow} width={36} height={act * grow} rx={3} fill={strong ? C.coral : C.teal} opacity={0.9} />
            </g>
          );
        })}
        <line x1={80} y1={400} x2={1080} y2={400} stroke={C.line} strokeWidth={2} />
      </svg>

      <Reveal from={70} style={{ textAlign: 'center', color: C.muted, fontSize: 15, fontFamily: FONT_MONO, marginTop: -4 }}>
        causal, not correlative — a CNN learns the grammar from the labels
      </Reveal>
    </Bg>
  );
};
