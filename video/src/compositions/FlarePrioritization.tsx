import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { Bg, Label, Reveal } from '../components';
import { C, FONT_DISPLAY, FONT_MONO } from '../theme';

// Marderstein & Montgomery: ChromBPNet predicts a variant's regulatory effect
// across 132 cell types; FLARE combines that with evolutionary constraint
// (phyloP) and flags variants that are large-effect AND constrained.
export const FlarePrioritization: React.FC = () => {
  const frame = useCurrentFrame();
  // plot frame
  const ox = 300, oy = 78, w = 620, h = 272; // top-left of plot box
  const bx = ox, by = oy + h; // origin (bottom-left)

  // deterministic scatter: [effectFrac, constraintFrac]
  const pts: [number, number][] = [
    [0.12, 0.2], [0.22, 0.14], [0.3, 0.35], [0.18, 0.55], [0.42, 0.24],
    [0.35, 0.62], [0.5, 0.4], [0.26, 0.28], [0.6, 0.3], [0.15, 0.72],
    [0.7, 0.66], [0.82, 0.74], [0.66, 0.82], [0.78, 0.58], [0.9, 0.68],
    [0.55, 0.7], [0.48, 0.5], [0.72, 0.44], [0.38, 0.18], [0.86, 0.86],
    [0.62, 0.55], [0.28, 0.44],
  ];
  const isFlagged = (e: number, c: number) => e > 0.6 && c > 0.6;

  const appear = interpolate(frame, [24, 70], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const zone = interpolate(frame, [78, 100], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const flag = interpolate(frame, [100, 124], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <Bg>
      <Reveal from={0}>
        <Label>Marderstein &amp; Montgomery · ChromBPNet + phyloP</Label>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 34, color: C.white, marginTop: 8 }}>
          Big effect where <span style={{ color: C.coral }}>evolution</span> says it matters
        </div>
      </Reveal>

      <svg width={1152} height={420} style={{ marginTop: 6 }}>
        {/* prioritised quadrant highlight */}
        <rect x={bx + w * 0.6} y={by - h} width={w * 0.4} height={h * 0.4}
          fill={C.coral} opacity={0.1 * zone} />
        <line x1={bx + w * 0.6} y1={by - h} x2={bx + w * 0.6} y2={by} stroke={C.coral} strokeWidth={1} strokeDasharray="4 5" opacity={0.5 * zone} />
        <line x1={bx} y1={by - h * 0.6} x2={bx + w} y2={by - h * 0.6} stroke={C.coral} strokeWidth={1} strokeDasharray="4 5" opacity={0.5 * zone} />

        {/* axes */}
        <line x1={bx} y1={by} x2={bx + w} y2={by} stroke={C.line} strokeWidth={2} />
        <line x1={bx} y1={by} x2={bx} y2={by - h} stroke={C.line} strokeWidth={2} />
        <text x={bx + w / 2} y={by + 44} fill={C.muted} fontFamily={FONT_MONO} fontSize={14} textAnchor="middle">
          predicted regulatory effect (ChromBPNet)
        </text>
        <text x={bx - 40} y={by - h / 2} fill={C.muted} fontFamily={FONT_MONO} fontSize={14} textAnchor="middle"
          transform={`rotate(-90 ${bx - 40} ${by - h / 2})`}>
          evolutionary constraint (phyloP)
        </text>

        {/* points */}
        {pts.map(([e, c], i) => {
          const px = bx + e * w;
          const py = by - c * h;
          const flagged = isFlagged(e, c);
          const r = 6;
          const op = flagged ? appear * (0.35 + 0.65 * flag) : appear * 0.9;
          const col = flagged ? C.coral : C.indigo;
          return (
            <g key={i}>
              {flagged && flag > 0 && (
                <circle cx={px} cy={py} r={r + 5 * flag} fill="none" stroke={C.coral} strokeWidth={1.5} opacity={0.5 * flag} />
              )}
              <circle cx={px} cy={py} r={r} fill={col} opacity={op} />
            </g>
          );
        })}

        {/* FLARE label on the quadrant */}
        <g opacity={flag}>
          <text x={bx + w * 0.8} y={by - h - 8} fill={C.coral} fontFamily={FONT_MONO} fontSize={15} fontWeight={700} textAnchor="middle">
            FLARE-prioritised
          </text>
        </g>
      </svg>

      <Reveal from={128} style={{ textAlign: 'center', marginTop: 0, color: C.muted, fontSize: 15, fontFamily: FONT_MONO }}>
        132 cell types · rare, constrained, large-effect variants rise to the top
      </Reveal>
    </Bg>
  );
};
