import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { Bg, Label, Reveal } from '../components';
import { C, FONT_DISPLAY, FONT_MONO } from '../theme';

// 2022-2024: Dietlein integrates three significance tests (epigenomic,
// inter-tumour, positional clustering) into one combined call.
export const DietleinGenomewide: React.FC = () => {
  const frame = useCurrentFrame();
  const tracks = [
    { name: 'epigenomic', col: C.indigo, t: 18 },
    { name: 'inter-tumour', col: C.teal, t: 34 },
    { name: 'positional clustering', col: C.indigoDeep, t: 50 },
  ];
  const ox = 120;
  const wave = (y: number, amp: number, phase: number, a: number) => {
    const pts = [];
    for (let x = 0; x <= 760; x += 16) {
      const yy = y + Math.sin((x + phase) / 48) * amp * Math.exp(-Math.pow((x - 520) / 130, 2)) * 0;
      // peak bump near x=520
      const bump = Math.exp(-Math.pow((x - 520) / 70, 2)) * amp;
      pts.push(`${ox + x},${y - bump * a}`);
    }
    return pts.join(' ');
  };
  const merge = interpolate(frame, [70, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Bg>
      <Reveal from={0}>
        <Label>2024 · Dietlein et al.</Label>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 36, color: C.white, marginTop: 8 }}>
          Three tests, <span style={{ color: C.coral }}>one combined</span> signal
        </div>
      </Reveal>
      <svg width={1152} height={420} style={{ marginTop: 18 }}>
        {tracks.map((tr, i) => {
          const a = interpolate(frame, [tr.t, tr.t + 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const y = 90 + i * 70;
          return (
            <g key={tr.name} opacity={a}>
              <line x1={ox} y1={y} x2={ox + 760} y2={y} stroke={C.line} strokeWidth={1} />
              <polyline points={wave(y, 40, i * 30, a)} fill="none" stroke={tr.col} strokeWidth={2.5} />
              <text x={ox + 772} y={y + 4} fill={tr.col} fontFamily={FONT_MONO} fontSize={13}>{tr.name}</text>
            </g>
          );
        })}
        {/* combined track */}
        <g opacity={merge}>
          <line x1={ox} y1={350} x2={ox + 760} y2={350} stroke={C.line} strokeWidth={1.5} />
          <polyline points={wave(350, 95, 0, merge)} fill="none" stroke={C.coral} strokeWidth={4} />
          <text x={ox + 772} y={354} fill={C.coral} fontFamily={FONT_MONO} fontSize={14} fontWeight={700}>combined call</text>
          {/* arrows merging down */}
          {[90, 160, 230].map((y, i) => (
            <line key={i} x1={ox + 520} y1={y + 6} x2={ox + 520} y2={330} stroke={C.muted} strokeWidth={1} strokeDasharray="3 4" opacity={0.4} />
          ))}
        </g>
      </svg>
      <Reveal from={114} style={{ textAlign: 'center', color: C.muted, fontSize: 15, fontFamily: FONT_MONO }}>
        detect non-coding drivers by integrating patterns, not recurrence alone
      </Reveal>
    </Bg>
  );
};
