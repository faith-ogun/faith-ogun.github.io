import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { Bg, Label, Reveal } from '../components';
import { C, FONT_DISPLAY, FONT_MONO } from '../theme';

// Wang & Hon: single-cell CRISPRi builds an enhancer-to-gene network.
// The memorable motif is multiple-to-one: three enhancers on different
// chromosomes each reach TP53 indirectly, through a local target gene.
export const EnhancerNetworks: React.FC = () => {
  const frame = useCurrentFrame();
  const gene = { x: 980, y: 215 };
  const rows = [
    { enh: 'chr17 enhancer', via: 'MED1', y: 95, col: C.coral, t: 22 },
    { enh: 'chr6 enhancer', via: 'SERAC1', y: 215, col: C.indigo, t: 40 },
    { enh: 'chr9 enhancer', via: 'local TF', y: 335, col: C.teal, t: 58 },
  ];
  const ex = 120; // enhancer x
  const vx = 540; // intermediate (via) x

  const dashDraw = (p: number, len: number) =>
    interpolate(p, [0, 1], [len, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const genePulse = interpolate(frame, [78, 96, 150], [0, 1, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <Bg>
      <Reveal from={0}>
        <Label>Wang &amp; Hon · single-cell CRISPRi</Label>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 36, color: C.white, marginTop: 8 }}>
          Enhancers reach cancer genes <span style={{ color: C.coral }}>indirectly</span>
        </div>
      </Reveal>

      <svg width={1152} height={420} style={{ marginTop: 14 }}>
        {rows.map((r) => {
          const on = interpolate(frame, [r.t, r.t + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const direct = interpolate(frame, [r.t + 6, r.t + 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const indirect = interpolate(frame, [r.t + 18, r.t + 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          // direct: enhancer -> via (solid). indirect: via -> TP53 (dashed curve)
          const q = `M ${vx + 60} ${r.y} Q ${(vx + gene.x) / 2} ${(r.y + gene.y) / 2 - 40} ${gene.x - 66} ${gene.y}`;
          return (
            <g key={r.enh} opacity={on}>
              {/* direct solid arm */}
              <line x1={ex + 108} y1={r.y} x2={vx - 60} y2={r.y} stroke={r.col} strokeWidth={3}
                strokeDasharray={vx - 60 - (ex + 108)} strokeDashoffset={dashDraw(direct, vx - 60 - (ex + 108))} />
              {/* indirect dashed arm to gene */}
              <path d={q} fill="none" stroke={r.col} strokeWidth={2.5} strokeDasharray="6 6" opacity={0.55 * indirect} />
              {/* enhancer node */}
              <rect x={ex - 8} y={r.y - 20} width={112} height={40} rx={7} fill="none" stroke={r.col} strokeWidth={2} />
              <text x={ex + 48} y={r.y + 4} fill={r.col} fontFamily={FONT_MONO} fontSize={11.5} textAnchor="middle">{r.enh}</text>
              {/* via node */}
              <circle cx={vx} cy={r.y} r={30} fill="none" stroke={C.muted} strokeWidth={1.5} />
              <text x={vx} y={r.y + 4} fill={C.paper} fontFamily={FONT_MONO} fontSize={12} textAnchor="middle">{r.via}</text>
            </g>
          );
        })}

        {/* TP53 target */}
        <g opacity={interpolate(frame, [16, 34], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}>
          <circle cx={gene.x} cy={gene.y} r={54 + genePulse * 4} fill={C.paper} />
          <circle cx={gene.x} cy={gene.y} r={54 + genePulse * 4} fill="none" stroke={C.coral} strokeWidth={2 + genePulse * 2} opacity={genePulse} />
          <text x={gene.x} y={gene.y - 2} fill={C.navy} fontFamily={FONT_MONO} fontSize={17} fontWeight={700} textAnchor="middle">TP53</text>
          <text x={gene.x} y={gene.y + 17} fill={C.navy} fontFamily={FONT_MONO} fontSize={9} textAnchor="middle" opacity={0.7}>tumour suppressor</text>
        </g>
      </svg>

      <Reveal from={104} style={{ textAlign: 'center', marginTop: 2, color: C.muted, fontSize: 15, fontFamily: FONT_MONO }}>
        three enhancers · three chromosomes · one gene — not the nearest one
      </Reveal>
    </Bg>
  );
};
