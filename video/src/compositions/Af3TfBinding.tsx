import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { Bg, Label, Reveal } from '../components';
import { C, FONT_DISPLAY, FONT_MONO } from '../theme';

// Gerasimavicius: AlphaFold 3 models a TF bound to DNA for the reference and
// the alternative allele; the change in AF3's own confidence (ΔipTM) tracks
// which allele the TF prefers.
const Panel: React.FC<{
  x: number;
  frame: number;
  t: number;
  title: string;
  ipTM: number;
  col: string;
  flip: boolean;
}> = ({ x, frame, t, title, ipTM, col, flip }) => {
  const on = interpolate(frame, [t, t + 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const dock = interpolate(frame, [t + 8, t + 30], [26, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const val = interpolate(frame, [t + 20, t + 40], [0, ipTM], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cy = 250;
  const bases = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const varIdx = 4;
  return (
    <g opacity={on} transform={`translate(${x},0)`}>
      <text x={175} y={70} fill={col} fontFamily={FONT_MONO} fontSize={16} letterSpacing={2} textAnchor="middle">{title}</text>
      {/* DNA duplex */}
      <line x1={40} y1={cy} x2={310} y2={cy} stroke={C.line} strokeWidth={2} />
      <line x1={40} y1={cy + 26} x2={310} y2={cy + 26} stroke={C.line} strokeWidth={2} />
      {bases.map((b) => {
        const bx = 55 + b * 29;
        const isVar = b === varIdx;
        return (
          <line key={b} x1={bx} y1={cy} x2={bx} y2={cy + 26}
            stroke={isVar ? (flip ? C.coral : C.teal) : C.muted}
            strokeWidth={isVar ? 4 : 2} opacity={isVar ? 1 : 0.5} />
        );
      })}
      {/* variant tick label */}
      <text x={55 + varIdx * 29} y={cy + 48} fill={flip ? C.coral : C.teal} fontFamily={FONT_MONO} fontSize={13} textAnchor="middle">
        {flip ? 'alt' : 'ref'}
      </text>
      {/* TF blob docking onto the variant base */}
      <g transform={`translate(0,${-dock})`}>
        <ellipse cx={55 + varIdx * 29} cy={cy - 58} rx={78} ry={46} fill={col} opacity={flip ? 0.28 : 0.42} />
        <ellipse cx={55 + varIdx * 29} cy={cy - 58} rx={78} ry={46} fill="none" stroke={col} strokeWidth={2}
          strokeDasharray={flip ? '5 6' : undefined} />
        <text x={55 + varIdx * 29} y={cy - 53} fill={C.white} fontFamily={FONT_MONO} fontSize={14} textAnchor="middle">TF</text>
      </g>
      {/* ipTM read-out */}
      <text x={175} y={cy + 92} fill={C.muted} fontFamily={FONT_MONO} fontSize={13} textAnchor="middle">ipTM</text>
      <text x={175} y={cy + 122} fill={col} fontFamily={FONT_MONO} fontSize={30} fontWeight={700} textAnchor="middle">
        {val.toFixed(2)}
      </text>
    </g>
  );
};

export const Af3TfBinding: React.FC = () => {
  const frame = useCurrentFrame();
  const delta = interpolate(frame, [96, 118], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Bg>
      <Reveal from={0}>
        <Label>Gerasimavicius · AlphaFold 3 + FoldX</Label>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 36, color: C.white, marginTop: 8 }}>
          One base changes <span style={{ color: C.coral }}>the fit</span>
        </div>
      </Reveal>

      <svg width={1152} height={430} style={{ marginTop: 6 }}>
        <Panel x={70} frame={frame} t={20} title="REFERENCE" ipTM={0.74} col={C.teal} flip={false} />
        <Panel x={710} frame={frame} t={44} title="ALTERNATIVE" ipTM={0.55} col={C.coral} flip={true} />
        {/* delta badge in the middle */}
        <g opacity={delta} transform="translate(576,250)">
          <text y={-70} fill={C.muted} fontFamily={FONT_MONO} fontSize={13} textAnchor="middle">Δ ipTM</text>
          <text y={-30} fill={C.white} fontFamily={FONT_MONO} fontSize={34} fontWeight={700} textAnchor="middle">0.19</text>
          <text y={4} fill={C.indigo} fontFamily={FONT_MONO} fontSize={12} textAnchor="middle">confidence</text>
          <text y={22} fill={C.indigo} fontFamily={FONT_MONO} fontSize={12} textAnchor="middle">shift</text>
        </g>
      </svg>

      <Reveal from={124} style={{ textAlign: 'center', marginTop: 0, color: C.muted, fontSize: 15, fontFamily: FONT_MONO }}>
        AF3's own confidence shift beats the physics-based energies
      </Reveal>
    </Bg>
  );
};
