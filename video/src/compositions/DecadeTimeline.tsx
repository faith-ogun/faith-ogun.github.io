import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { Bg, Label, Reveal } from '../components';
import { C, FONT_DISPLAY, FONT_MONO } from '../theme';

const MILESTONES = [
  { yr: '2015', t: 'Hotspot scans', d: '50 bp windows', color: C.indigo },
  { yr: '2017', t: 'Recurrence + conservation', d: 'Piraino & Furney', color: C.indigo },
  { yr: '2020', t: 'PCAWG paucity', d: 'beyond TERT, few', color: C.coral },
  { yr: '2024', t: 'Genome-wide', d: 'Dietlein sliding window', color: C.teal },
  { yr: '2025', t: 'Functional era', d: 'CRISPR validation', color: C.coral },
];

export const DecadeTimeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // line near the bottom; every label sits ABOVE it so nothing is clipped
  const x0 = 110, x1 = 1050, lineY = 470;
  const lineP = interpolate(frame, [10, 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Bg>
      <Reveal from={0}>
        <Label>A decade in the non-coding genome</Label>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 40, color: C.white, marginTop: 8 }}>
          From <span style={{ color: C.indigo }}>hotspots</span> to <span style={{ color: C.coral }}>function</span> · 2015–2025
        </div>
      </Reveal>
      <svg width={1152} height={520} style={{ marginTop: 18 }}>
        <line x1={x0} y1={lineY} x2={interpolate(lineP, [0, 1], [x0, x1])} y2={lineY} stroke={C.line} strokeWidth={3} />
        {MILESTONES.map((m, i) => {
          const mx = x0 + (i / (MILESTONES.length - 1)) * (x1 - x0);
          const start = 40 + i * 16;
          const s = spring({ frame: frame - start, fps, config: { damping: 200 }, durationInFrames: 30 });
          // two tiers, both above the line: even sit higher, odd sit lower
          const tier = i % 2 === 0 ? 250 : 360;       // y of the YEAR text
          const rise = (1 - s) * 24;                   // gentle entrance
          const yYear = tier + rise;
          return (
            <g key={m.yr} opacity={s}>
              <line x1={mx} y1={lineY} x2={mx} y2={tier + 26} stroke={m.color} strokeWidth={2} opacity={0.45} />
              <circle cx={mx} cy={lineY} r={8} fill={m.color} />
              <text x={mx} y={yYear} fill={m.color} fontFamily={FONT_MONO} fontSize={24} fontWeight={700} textAnchor="middle">{m.yr}</text>
              <text x={mx} y={yYear + 26} fill={C.paper} fontFamily={FONT_DISPLAY} fontSize={18} textAnchor="middle">{m.t}</text>
              <text x={mx} y={yYear + 48} fill={C.muted} fontFamily={FONT_MONO} fontSize={12.5} textAnchor="middle">{m.d}</text>
            </g>
          );
        })}
      </svg>
    </Bg>
  );
};
