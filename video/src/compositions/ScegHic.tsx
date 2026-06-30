import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { Bg, Label, Reveal } from '../components';
import { C, FONT_DISPLAY, FONT_MONO } from '../theme';

// SCEG-HiC: single-cell multi-omics (ATAC + RNA) + a prior Hi-C map combine to
// call a confident enhancer -> gene link.
export const ScegHic: React.FC = () => {
  const frame = useCurrentFrame();
  const enh = { x: 250, y: 300 };
  const gene = { x: 900, y: 300 };
  // single cells appearing (left input)
  const cells = Array.from({ length: 14 }).map((_, i) => {
    const a = interpolate(frame, [10 + i * 2, 22 + i * 2], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const cx = 130 + (i % 7) * 26;
    const cy = 110 + Math.floor(i / 7) * 26;
    return <circle key={i} cx={cx} cy={cy} r={8} fill={i % 2 ? C.indigo : C.teal} opacity={a * 0.9} />;
  });
  // prior Hi-C contact arc strength
  const prior = interpolate(frame, [55, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // final link confidence
  const link = interpolate(frame, [90, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const dash = 760;
  return (
    <Bg>
      <Reveal from={0}>
        <Label>Liang et al. 2026 · SCEG-HiC</Label>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 38, color: C.white, marginTop: 8 }}>
          Single-cell signal <span style={{ color: C.coral }}>+ a Hi-C prior</span> = the link
        </div>
      </Reveal>
      <svg width={1152} height={420} style={{ marginTop: 16 }}>
        {/* input clouds */}
        {cells}
        <text x={165} y={185} fill={C.muted} fontFamily={FONT_MONO} fontSize={12} textAnchor="middle">single-cell ATAC + RNA</text>

        <line x1={120} y1={300} x2={1040} y2={300} stroke={C.line} strokeWidth={2} />
        {/* prior hi-c arc (faint, behind) */}
        <path d={`M ${enh.x} ${enh.y} Q ${(enh.x + gene.x) / 2} ${enh.y - 150} ${gene.x} ${gene.y}`}
          fill="none" stroke={C.indigo} strokeWidth={10} opacity={prior * 0.18} />
        <text x={(enh.x + gene.x) / 2} y={enh.y - 158} fill={C.indigo} fontFamily={FONT_MONO} fontSize={13}
          textAnchor="middle" opacity={prior}>prior Hi-C contact</text>
        {/* final confident link */}
        <path d={`M ${enh.x} ${enh.y} Q ${(enh.x + gene.x) / 2} ${enh.y - 150} ${gene.x} ${gene.y}`}
          fill="none" stroke={C.coral} strokeWidth={4} strokeDasharray={dash}
          strokeDashoffset={interpolate(link, [0, 1], [dash, 0])} opacity={0.95} />
        {/* enhancer + gene */}
        <rect x={enh.x - 60} y={enh.y - 16} width={120} height={32} rx={6} fill="none" stroke={C.teal} strokeWidth={2} />
        <text x={enh.x} y={enh.y + 5} fill={C.teal} fontFamily={FONT_MONO} fontSize={14} textAnchor="middle">enhancer</text>
        <rect x={gene.x - 50} y={gene.y - 18} width={110} height={36} rx={6} fill={C.paper} />
        <text x={gene.x} y={gene.y + 6} fill={C.navy} fontFamily={FONT_MONO} fontSize={15} fontWeight={700} textAnchor="middle">GENE</text>
      </svg>
      <Reveal from={124} style={{ textAlign: 'center', marginTop: 4, color: C.muted, fontSize: 15, fontFamily: FONT_MONO }}>
        correlation alone is noisy; the Hi-C prior makes the call trustworthy
      </Reveal>
    </Bg>
  );
};
