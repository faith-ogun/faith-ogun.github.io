import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { Bg, Label, Reveal } from '../components';
import { C, FONT_DISPLAY, FONT_MONO } from '../theme';

// Variformer: fine-tune Enformer on personal genomes. Two-sided result:
// sign-agreement on variant direction jumps 60.2% -> 97.4%, but it still
// fails to generalise to unseen genes.
export const Variformer: React.FC = () => {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [40, 95], [60.2, 97.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const barW = (v: number) => interpolate(v, [0, 100], [0, 520]);
  const before = 60.2;
  const seenA = interpolate(frame, [100, 116], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const unseenA = interpolate(frame, [116, 132], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Bg>
      <Reveal from={0}>
        <Label>Drusinsky et al. 2026 · Variformer</Label>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 36, color: C.white, marginTop: 8 }}>
          Fine-tune Enformer on <span style={{ color: C.coral }}>personal genomes</span>
        </div>
      </Reveal>

      {/* sign-agreement bars */}
      <svg width={1000} height={240} style={{ marginTop: 30 }}>
        <text x={0} y={40} fill={C.muted} fontFamily={FONT_MONO} fontSize={15}>variant-direction sign agreement</text>
        {/* before */}
        <text x={0} y={90} fill={C.muted} fontFamily={FONT_MONO} fontSize={14}>Enformer</text>
        <rect x={150} y={74} width={barW(before)} height={26} rx={5} fill={C.indigoDeep} opacity={0.8} />
        <text x={150 + barW(before) + 12} y={93} fill={C.muted} fontFamily={FONT_MONO} fontSize={15}>60.2%</text>
        {/* after */}
        <text x={0} y={150} fill={C.coral} fontFamily={FONT_MONO} fontSize={14}>Variformer</text>
        <rect x={150} y={134} width={barW(grow)} height={26} rx={5} fill={C.coral} />
        <text x={150 + barW(grow) + 12} y={153} fill={C.white} fontFamily={FONT_MONO} fontSize={16}>{grow.toFixed(1)}%</text>
      </svg>

      {/* the catch */}
      <svg width={1000} height={120} style={{ marginTop: 4 }}>
        <g opacity={seenA}>
          <rect x={0} y={20} width={300} height={64} rx={10} fill="none" stroke={C.teal} strokeWidth={2} />
          <text x={150} y={48} fill={C.teal} fontFamily={FONT_MONO} fontSize={15} textAnchor="middle">seen genes</text>
          <text x={150} y={72} fill={C.teal} fontFamily={FONT_MONO} fontSize={18} textAnchor="middle">✓ works</text>
        </g>
        <g opacity={unseenA}>
          <rect x={360} y={20} width={300} height={64} rx={10} fill="none" stroke={C.coral} strokeWidth={2} strokeDasharray="6 5" />
          <text x={510} y={48} fill={C.coral} fontFamily={FONT_MONO} fontSize={15} textAnchor="middle">unseen genes</text>
          <text x={510} y={72} fill={C.coral} fontFamily={FONT_MONO} fontSize={18} textAnchor="middle">✗ no transfer</text>
        </g>
      </svg>
      <Reveal from={134} style={{ color: C.muted, fontSize: 15, fontFamily: FONT_MONO, marginTop: 2 }}>
        better variant calls, but still no generalisable grammar
      </Reveal>
    </Bg>
  );
};
