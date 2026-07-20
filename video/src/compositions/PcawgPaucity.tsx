import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { Bg, Label, Reveal } from '../components';
import { C, FONT_DISPLAY, FONT_MONO } from '../theme';

// 2018-2021: 2,658 genomes, many candidate peaks, but aggressive filtering of
// mutational-process artefacts leaves essentially only TERT standing.
export const PcawgPaucity: React.FC = () => {
  const frame = useCurrentFrame();
  const ox = 90;
  const baseY = 300;
  const peaks = Array.from({ length: 22 }).map((_, i) => {
    const x = ox + 20 + i * 46;
    const isTert = i === 14;
    const h = isTert ? 150 : 30 + ((i * 37) % 60);
    return { x, h, isTert };
  });
  const rise = interpolate(frame, [12, 45], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // filter sweep removes non-TERT peaks
  const filter = interpolate(frame, [60, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Bg>
      <Reveal from={0}>
        <Label>2020 · PCAWG · 2,658 genomes</Label>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 36, color: C.white, marginTop: 8 }}>
          Filter the artefacts, and <span style={{ color: C.coral }}>only TERT</span> remains
        </div>
      </Reveal>
      <svg width={1152} height={400} style={{ marginTop: 20 }}>
        <line x1={ox} y1={baseY} x2={ox + 1010} y2={baseY} stroke={C.line} strokeWidth={2} />
        {peaks.map((p, i) => {
          const fade = p.isTert ? 1 : 1 - filter; // non-TERT fade out
          const h = p.h * rise;
          const col = p.isTert ? C.coral : C.indigoDeep;
          return (
            <g key={i} opacity={fade}>
              <rect x={p.x - 8} y={baseY - h} width={16} height={h} rx={3} fill={col} opacity={p.isTert ? 0.95 : 0.7} />
              {p.isTert && (
                <text x={p.x} y={baseY - h - 10} fill={C.coral} fontFamily={FONT_MONO} fontSize={15} textAnchor="middle" fontWeight={700}>TERT</text>
              )}
            </g>
          );
        })}
        <Reveal from={70}>
          <text x={ox + 10} y={baseY + 34} fill={C.muted} fontFamily={FONT_MONO} fontSize={13}>
            46% of hits discarded as APOBEC / UV / AID artefacts
          </text>
        </Reveal>
      </svg>
      <Reveal from={114} style={{ textAlign: 'center', color: C.muted, fontSize: 15, fontFamily: FONT_MONO }}>
        ~96 promoter drivers, 73 of them TERT, "surprisingly limited"
      </Reveal>
    </Bg>
  );
};
