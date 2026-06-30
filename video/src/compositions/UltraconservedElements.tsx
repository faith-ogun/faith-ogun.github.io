import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { Bg, Label, Reveal } from '../components';
import { C, FONT_DISPLAY, FONT_MONO } from '../theme';

// Ultraconserved elements: a block identical across 5 mammals, a somatic
// mutation lands in it, and a burden test pushes it past a context-matched null.
export const UltraconservedElements: React.FC = () => {
  const frame = useCurrentFrame();
  const species = ['Human', 'Mouse', 'Dog', 'Cow', 'Elephant'];
  const bases = 'GTACCGTTAGCAGTCCAGTAGCT'.split('');
  const uceStart = 6;
  const uceEnd = 16;
  const bw = 24;
  const ox = 230;
  const oy = 110;
  // somatic mutation appears in human UCE
  const mutCol = 10;
  const mut = interpolate(frame, [70, 82], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // burden bar exceeds null
  const burden = interpolate(frame, [95, 125], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Bg>
      <Reveal from={0}>
        <Label>Bayraktar et al. 2025 · ncUCEs</Label>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 34, color: C.white, marginTop: 8 }}>
          100% identical across mammals, <span style={{ color: C.coral }}>then mutated</span>
        </div>
      </Reveal>
      <svg width={1152} height={300} style={{ marginTop: 16 }}>
        {/* UCE highlight band */}
        <rect x={ox + uceStart * bw - 3} y={oy - 22} width={(uceEnd - uceStart) * bw} height={species.length * 28 + 14}
          rx={6} fill={C.indigo} opacity={0.12} />
        <text x={ox + (uceStart + (uceEnd - uceStart) / 2) * bw} y={oy - 30} fill={C.indigo}
          fontFamily={FONT_MONO} fontSize={13} textAnchor="middle">ultraconserved element</text>
        {species.map((sp, r) => {
          const rowA = interpolate(frame, [10 + r * 6, 24 + r * 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return (
            <g key={sp} opacity={rowA}>
              <text x={ox - 16} y={oy + r * 28 + 5} fill={C.muted} fontFamily={FONT_MONO} fontSize={13} textAnchor="end">{sp}</text>
              {bases.map((b, c) => {
                const inUce = c >= uceStart && c < uceEnd;
                const isMut = r === 0 && c === mutCol;
                const fill = isMut && mut > 0 ? C.coral : inUce ? C.paper : C.muted;
                return (
                  <text key={c} x={ox + c * bw} y={oy + r * 28 + 5} fill={fill} fontFamily={FONT_MONO}
                    fontSize={15} textAnchor="middle" opacity={inUce ? 1 : 0.4}>
                    {isMut && mut > 0 ? 'A' : b}
                  </text>
                );
              })}
            </g>
          );
        })}
        {mut > 0 && (
          <circle cx={ox + mutCol * bw} cy={oy} r={interpolate(mut, [0, 1], [0, 13])} fill="none" stroke={C.coral} strokeWidth={2} />
        )}
      </svg>

      {/* burden vs null */}
      <svg width={1000} height={120} style={{ marginTop: 4 }}>
        <text x={0} y={20} fill={C.muted} fontFamily={FONT_MONO} fontSize={14} opacity={burden}>mutation burden vs context-matched null</text>
        <rect x={0} y={34} width={520} height={20} rx={5} fill={C.line} />
        <rect x={0} y={34} width={interpolate(burden, [0, 1], [0, 500])} height={20} rx={5} fill={C.coral} />
        {/* null threshold marker */}
        <line x1={360} y1={26} x2={360} y2={62} stroke={C.white} strokeWidth={2} strokeDasharray="4 4" opacity={burden} />
        <text x={360} y={80} fill={C.white} fontFamily={FONT_MONO} fontSize={12} textAnchor="middle" opacity={burden}>top 0.5% null</text>
      </svg>
      <Reveal from={128} style={{ color: C.muted, fontSize: 15, fontFamily: FONT_MONO, marginTop: 2 }}>
        excess burden beyond chance → a non-coding driver candidate
      </Reveal>
    </Bg>
  );
};
