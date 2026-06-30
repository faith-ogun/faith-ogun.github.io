import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { Bg, Label, Reveal } from '../components';
import { C, FONT_DISPLAY, FONT_MONO } from '../theme';

// 12,631 tumour genomes -> recurrent mutations pile up at one lncRNA position
// (positive selection) -> the RBP that normally represses the lncRNA falls off.
export const LncrnaDrivers: React.FC = () => {
  const frame = useCurrentFrame();
  const rows = 9;
  const cols = 26;
  const ox = 120;
  const oy = 110;
  const cw = 30;
  const ch = 14;
  const hot = 13; // recurrent position column
  const lines = [];
  for (let r = 0; r < rows; r++) {
    lines.push(<line key={`l${r}`} x1={ox} y1={oy + r * ch} x2={ox + cols * cw * 0.62} y2={oy + r * ch}
      stroke={C.line} strokeWidth={1} />);
  }
  // mutations: scattered early, then concentrate on the hot column
  const muts = [];
  let k = 0;
  for (let r = 0; r < rows; r++) {
    const onHot = r % 1 === 0 && r < 7; // most rows mutate the hotspot
    const col = onHot ? hot : (r * 7 + 3) % cols;
    const t = 18 + k * 3.2;
    const a = interpolate(frame, [t, t + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    muts.push(<circle key={`m${r}`} cx={ox + col * cw * 0.62} cy={oy + r * ch} r={5}
      fill={onHot ? C.coral : C.muted} opacity={a} />);
    k++;
  }
  const stack = interpolate(frame, [62, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const rbpDrop = interpolate(frame, [98, 125], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Bg>
      <Reveal from={0}>
        <Label>Johnson lab 2026 · 12,631 tumour genomes</Label>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 36, color: C.white, marginTop: 8 }}>
          Recurrence at the <span style={{ color: C.coral }}>same position</span> = selection
        </div>
      </Reveal>
      <svg width={1152} height={440} style={{ marginTop: 14 }}>
        {lines}
        {muts}
        {/* recurrence callout column */}
        <rect x={ox + hot * cw * 0.62 - 9} y={oy - 16} width={18} height={rows * ch + 8} rx={4}
          fill={C.coral} opacity={stack * 0.14} />
        <text x={ox + hot * cw * 0.62} y={oy - 24} fill={C.coral} fontFamily={FONT_MONO} fontSize={13}
          textAnchor="middle" opacity={stack}>driver lncRNA</text>

        {/* RBP releasing from the lncRNA */}
        <g transform="translate(560, 330)">
          <rect x={-260} y={-8} width={520} height={16} rx={8} fill={C.indigoDeep} opacity={0.9} />
          <text x={-262} y={6} fill={C.muted} fontFamily={FONT_MONO} fontSize={13} textAnchor="end">lncRNA</text>
          {/* RBP protein, drifts away as mutation disrupts the site */}
          <g transform={`translate(${rbpDrop * -10}, ${rbpDrop * -70}) rotate(${rbpDrop * -18})`} opacity={1 - rbpDrop * 0.15}>
            <circle cx={0} cy={-22} r={26} fill={C.teal} opacity={0.92} />
            <text x={0} y={-18} fill={C.navy} fontFamily={FONT_MONO} fontSize={13} fontWeight={700} textAnchor="middle">RBP</text>
          </g>
          <circle cx={0} cy={0} r={5} fill={C.coral} />
        </g>
        <Reveal from={108}>
          <text x={576} y={420} fill={C.muted} fontFamily={FONT_MONO} fontSize={15} textAnchor="middle">
            mutation reduces RBP binding → oncogenic lncRNA released
          </text>
        </Reveal>
      </svg>
    </Bg>
  );
};
