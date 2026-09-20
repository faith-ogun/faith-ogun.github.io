import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { Bg, Label, Reveal } from '../components';
import { C, FONT_DISPLAY, FONT_MONO } from '../theme';

/**
 * Why we stopped reading the leaderboard as a measurement.
 *
 * Every row here is the SAME agent. Not a variant, not a retune: the identical
 * binary, scored again. The spread is the scoreboard's own noise, which is why
 * the campaign was run against a local instrument with control cells instead.
 */

const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

const LO = 640;
const HI = 1160;
const X0 = 60;
const X1 = 1090;
const px = (r: number) => X0 + ((r - LO) / (HI - LO)) * (X1 - X0);

type Row = { label: string; note: string; y: number; t: number; col: string; vals: number[] };

const ROWS: Row[] = [
  {
    label: 'our merge binary, submitted 7×',
    note: 'unchanged file',
    y: 150,
    t: 40,
    col: C.indigo,
    vals: [836, 883, 768, 809, 813, 899, 902],
  },
  {
    label: 'one agent, 13 hours apart',
    note: 'same file',
    y: 252,
    t: 110,
    col: C.coral,
    vals: [741.9, 933.7],
  },
  {
    label: 'a competitor, byte-identical',
    note: 'same bytes',
    y: 354,
    t: 168,
    col: C.teal,
    vals: [687.4, 1104.6],
  },
];

export const PtcgLeaderboardNoise: React.FC = () => {
  const f = useCurrentFrame();

  return (
    <Bg>
      <Reveal from={0}>
        <Label>What the scoreboard actually measures</Label>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 34, color: C.white, marginTop: 6 }}>
          Every row is the <span style={{ color: C.coral }}>same agent</span>
        </div>
      </Reveal>

      <svg width={1152} height={418} style={{ marginTop: 8 }}>
        <g transform="translate(0,-50)">
        {/* axis */}
        <g opacity={ease(f, 18, 34)}>
          <line x1={X0} y1={410} x2={X1} y2={410} stroke={C.line} strokeWidth={1.5} />
          {[700, 800, 900, 1000, 1100].map((t) => (
            <g key={t}>
              <line x1={px(t)} y1={406} x2={px(t)} y2={414} stroke={C.line} strokeWidth={1.5} />
              <text x={px(t)} y={432} fill={C.muted} fontFamily={FONT_MONO} fontSize={11} textAnchor="middle">
                {t}
              </text>
            </g>
          ))}
          <text x={X1} y={452} fill={C.muted} fontFamily={FONT_MONO} fontSize={10} textAnchor="end">
            final skill rating →
          </text>
        </g>

        {ROWS.map((row) => {
          const on = ease(f, row.t, row.t + 16);
          const lo = Math.min(...row.vals);
          const hi = Math.max(...row.vals);
          const spread = hi - lo;
          const tBr = ease(f, row.t + 26, row.t + 46);
          return (
            <g key={row.label}>
              <text x={X0} y={row.y - 30} fill={row.col} fontFamily={FONT_MONO} fontSize={13} opacity={on}>
                {row.label}
              </text>
              <text x={X0} y={row.y - 14} fill={C.muted} fontFamily={FONT_MONO} fontSize={10} opacity={on}>
                {row.note} · {row.vals.length} runs
              </text>

              {/* the span these identical runs covered */}
              <line
                x1={px(lo)}
                y1={row.y + 14}
                x2={interpolate(tBr, [0, 1], [px(lo), px(hi)])}
                y2={row.y + 14}
                stroke={row.col}
                strokeWidth={2}
                opacity={0.35}
              />
              <g opacity={tBr}>
                <text
                  x={(px(lo) + px(hi)) / 2}
                  y={row.y + 36}
                  fill={row.col}
                  fontFamily={FONT_MONO}
                  fontSize={13}
                  textAnchor="middle"
                >
                  {spread.toFixed(0)} points apart
                </text>
              </g>

              {/* each submission. On the crowded row the ratings sit 4 points
                  apart, so only the extremes carry a label; the dots still show
                  the clustering. */}
              {row.vals.map((v, i) => {
                const dot = ease(f, row.t + 4 + i * 5, row.t + 18 + i * 5);
                const labelled = row.vals.length <= 3 || v === lo || v === hi;
                return (
                  <g key={i} opacity={dot}>
                    <circle cx={px(v)} cy={row.y + 14} r={7} fill={row.col} />
                    <circle cx={px(v)} cy={row.y + 14} r={13} fill="none" stroke={row.col} strokeWidth={1} opacity={0.35} />
                    {labelled && (
                      <text
                        x={px(v)}
                        y={row.y - 4}
                        fill={C.paper}
                        fontFamily={FONT_MONO}
                        fontSize={11}
                        textAnchor="middle"
                        opacity={0.8}
                      >
                        {Number.isInteger(v) ? v : v.toFixed(1)}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}
        </g>
      </svg>

      <Reveal from={226} style={{ textAlign: 'center', marginTop: -14, color: C.muted, fontSize: 14, fontFamily: FONT_MONO }}>
        scheduling is rating-scaled, so an early streak anneals in place · anything inside ±4 pp is unresolvable
      </Reveal>
    </Bg>
  );
};
