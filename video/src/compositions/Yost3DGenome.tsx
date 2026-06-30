import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { Bg, Label, Reveal } from '../components';
import { C, FONT_DISPLAY, FONT_MONO } from '../theme';

// Hi-C contact map of a primary tumour: a triangular contact matrix fills in,
// with TAD blocks emerging along the diagonal.
export const Yost3DGenome: React.FC = () => {
  const frame = useCurrentFrame();
  const N = 16;
  const cell = 22;
  const ox = 360;
  const oy = 120;
  // TAD block boundaries (indices) for a little structure
  const tad = (i: number, j: number) => {
    const blocks = [[0, 4], [4, 9], [9, 12], [12, 16]];
    for (const [a, b] of blocks) if (i >= a && i < b && j >= a && j < b) return true;
    return false;
  };
  const cells = [];
  for (let i = 0; i < N; i++) {
    for (let j = i; j < N; j++) {
      const d = j - i;
      const base = Math.max(0, 1 - d / 7); // contact decays with distance
      const boost = tad(i, j) ? 0.35 : 0;
      const intensity = Math.min(1, base + boost);
      const appear = interpolate(frame, [20 + (i + d) * 1.6, 32 + (i + d) * 1.6], [0, 1], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
      });
      const col = intensity > 0.66 ? C.coral : intensity > 0.33 ? C.indigo : C.indigoDeep;
      cells.push(
        <rect key={`${i}-${j}`} x={ox + j * cell} y={oy + i * cell} width={cell - 1.5} height={cell - 1.5}
          rx={2} fill={col} opacity={appear * (0.18 + intensity * 0.82)} />
      );
    }
  }
  return (
    <Bg>
      <Reveal from={0}>
        <Label>Yost et al. 2025 · Hi-C in primary tumours</Label>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 38, color: C.white, marginTop: 8 }}>
          The genome folds: <span style={{ color: C.coral }}>contact maps</span> of real cancers
        </div>
      </Reveal>
      <svg width={1152} height={460} style={{ marginTop: 12 }}>
        {cells}
        {/* diagonal guide */}
        <line x1={ox} y1={oy} x2={ox + N * cell} y2={oy + N * cell} stroke={C.line} strokeWidth={1.5} />
        <text x={ox} y={oy - 14} fill={C.muted} fontFamily={FONT_MONO} fontSize={13}>chromosome position →</text>
        {/* TAD callout */}
        <Reveal from={70}>
          <g>
            <rect x={ox + 4 * cell} y={oy + 4 * cell} width={5 * cell} height={5 * cell} rx={4}
              fill="none" stroke={C.white} strokeWidth={2} strokeDasharray="6 5" />
            <text x={ox + 6.5 * cell} y={oy + 4 * cell - 8} fill={C.white} fontFamily={FONT_MONO}
              fontSize={13} textAnchor="middle">TAD</text>
          </g>
        </Reveal>
      </svg>
      <Reveal from={96} style={{ textAlign: 'center', marginTop: 6, color: C.muted, fontSize: 15, fontFamily: FONT_MONO }}>
        bright off-diagonal blocks = regions that physically touch
      </Reveal>
    </Bg>
  );
};
