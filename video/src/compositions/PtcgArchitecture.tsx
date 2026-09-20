import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { Bg, Label, Reveal } from '../components';
import { C, FONT_DISPLAY, FONT_MONO } from '../theme';

/**
 * The PTCG agent, end to end.
 *
 * The point of the picture is the SPLIT: a hand-written policy answers most
 * menus instantly, and only the genuinely close calls are escalated into
 * search. Everything expensive sits on the minority branch, which is what
 * makes the thing affordable on 1.6 vCPUs.
 */

const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

// a stroke that draws itself
const Draw: React.FC<{
  d: string;
  len: number;
  p: number;
  col: string;
  w?: number;
  dash?: string;
  op?: number;
}> = ({ d, len, p, col, w = 2.5, dash, op = 1 }) => (
  <path
    d={d}
    fill="none"
    stroke={col}
    strokeWidth={w}
    opacity={op}
    strokeDasharray={dash ?? len}
    strokeDashoffset={dash ? 0 : len * (1 - p)}
  />
);

const Node: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  p: number;
  col: string;
  title: string;
  sub?: string;
  fill?: string;
  children?: React.ReactNode;
}> = ({ x, y, w, h, p, col, title, sub, fill = 'rgba(255,255,255,0.03)', children }) => (
  <g opacity={p} transform={`translate(${x},${y}) scale(${0.96 + 0.04 * p})`}>
    <rect x={0} y={0} width={w} height={h} rx={10} fill={fill} stroke={col} strokeWidth={2} />
    <text x={w / 2} y={22} fill={col} fontFamily={FONT_MONO} fontSize={13} fontWeight={700} textAnchor="middle">
      {title}
    </text>
    {sub && (
      <text x={w / 2} y={h - 12} fill={C.muted} fontFamily={FONT_MONO} fontSize={10} textAnchor="middle">
        {sub}
      </text>
    )}
    {children}
  </g>
);

export const PtcgArchitecture: React.FC = () => {
  const f = useCurrentFrame();

  // ---- geometry ----
  const OBS = { x: 0, y: 196, w: 118, h: 84 };
  const POL = { x: 162, y: 176, w: 186, h: 124 };
  const DET = { x: 392, y: 322, w: 156, h: 104 };
  const HAL = { x: 578, y: 322, w: 156, h: 104 };
  const NET = { x: 764, y: 322, w: 146, h: 104 };
  const TAU = { x: 942, y: 330, w: 92, h: 88 };
  const ACT = { x: 1010, y: 168, w: 130, h: 84 };

  // ---- timings ----
  const tObs = ease(f, 22, 40);
  const tPol = ease(f, 42, 60);
  const tFast = ease(f, 66, 92);
  const tSlow = ease(f, 96, 122);
  const tDet = ease(f, 118, 138);
  const tHal = ease(f, 150, 170);
  const tNet = ease(f, 182, 200);
  const tTau = ease(f, 206, 224);
  const tMerge = ease(f, 228, 252);
  const tAct = ease(f, 236, 256);

  // fast path: policy -> up -> across -> action (enters top)
  const fastD = `M ${POL.x + POL.w} 238 C 400 238 380 130 470 130 L 1075 130 L 1075 ${ACT.y}`;
  // contested path: policy -> down -> into determinize
  const slowD = `M ${POL.x + POL.w} 262 C 372 262 360 374 ${DET.x} 374`;
  // tau -> action
  const mergeD = `M ${TAU.x + TAU.w} 374 C 1090 374 1075 300 1075 ${ACT.y + ACT.h}`;

  // determinized worlds fanning out
  const worlds = [0, 1, 2, 3, 4];
  // halving rounds: 8 candidates culled to 1
  const bars = [0, 1, 2, 3, 4, 5, 6, 7];
  const round = interpolate(f, [152, 178], [0, 3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const alive = (i: number) => {
    const survivors = Math.max(1, Math.round(8 / Math.pow(2, Math.floor(round))));
    return i < survivors;
  };

  // a token travelling the contested branch, to make the flow legible
  const tok = interpolate(f, [122, 240], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const tokX = interpolate(tok, [0, 0.28, 0.56, 0.82, 1], [DET.x + 20, DET.x + 130, HAL.x + 130, NET.x + 120, TAU.x + 46]);

  return (
    <Bg>
      <Reveal from={0}>
        <Label>Pokémon TCG AI Battle Challenge · the agent</Label>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 34, color: C.white, marginTop: 6 }}>
          A cheap policy, and search only where it&apos;s <span style={{ color: C.coral }}>close</span>
        </div>
      </Reveal>

      <svg width={1152} height={402} style={{ marginTop: 10 }}>
        <g transform="translate(0,-68)">
        {/* ---------- edges ---------- */}
        <Draw d={`M ${OBS.x + OBS.w} 238 L ${POL.x} 238`} len={46} p={tPol} col={C.muted} w={2} />
        <Draw d={fastD} len={780} p={tFast} col={C.teal} w={2.5} />
        <Draw d={slowD} len={260} p={tSlow} col={C.coral} w={2.5} />
        <Draw d={`M ${DET.x + DET.w} 374 L ${HAL.x} 374`} len={30} p={tHal} col={C.coral} w={2} />
        <Draw d={`M ${HAL.x + HAL.w} 374 L ${NET.x} 374`} len={30} p={tNet} col={C.coral} w={2} />
        <Draw d={`M ${NET.x + NET.w} 374 L ${TAU.x} 374`} len={32} p={tTau} col={C.coral} w={2} />
        <Draw d={mergeD} len={260} p={tMerge} col={C.indigo} w={2.5} />

        {/* branch labels */}
        <g opacity={tFast}>
          <text x={600} y={118} fill={C.teal} fontFamily={FONT_MONO} fontSize={12} textAnchor="middle">
            84% of moves · uncontested, answered instantly
          </text>
        </g>
        <g opacity={tSlow}>
          <text x={300} y={330} fill={C.coral} fontFamily={FONT_MONO} fontSize={12} textAnchor="middle">
            16% · contested
          </text>
        </g>

        {/* ---------- nodes ---------- */}
        <Node {...OBS} p={tObs} col={C.muted} title="OBSERVE" sub="legal options only">
          <text x={OBS.w / 2} y={48} fill={C.paper} fontFamily={FONT_MONO} fontSize={10} textAnchor="middle" opacity={0.75}>
            board + logs
          </text>
        </Node>

        <Node {...POL} p={tPol} col={C.teal} title="BASE POLICY" sub="no search at all" fill="rgba(57,176,160,0.07)">
          {['exact KO arithmetic', 'prize-trade terms', 'exposure differential', 'threat tables'].map((t, i) => (
            <text
              key={t}
              x={POL.w / 2}
              y={44 + i * 17}
              fill={C.paper}
              fontFamily={FONT_MONO}
              fontSize={10}
              textAnchor="middle"
              opacity={ease(f, 50 + i * 5, 62 + i * 5) * 0.85}
            >
              {t}
            </text>
          ))}
        </Node>

        {/* determinize: fan of sampled worlds */}
        <Node {...DET} p={tDet} col={C.coral} title="DETERMINIZE" sub="753 worlds / decision">
          {worlds.map((i) => {
            const on = ease(f, 126 + i * 4, 138 + i * 4);
            return (
              <rect
                key={i}
                x={34 + i * 17}
                y={42}
                width={26}
                height={34}
                rx={3}
                fill="none"
                stroke={C.coral}
                strokeWidth={1.4}
                opacity={on * 0.75}
                transform={`rotate(${(i - 2) * 6} ${47 + i * 17} 59)`}
              />
            );
          })}
        </Node>

        {/* halving: candidates culled */}
        <Node {...HAL} p={tHal} col={C.coral} title="GUMBEL HALVING" sub="same worlds per round">
          {bars.map((i) => {
            const live = alive(i);
            return (
              <rect
                key={i}
                x={20 + i * 15}
                y={live ? 44 : 60}
                width={9}
                height={live ? 34 : 18}
                rx={2}
                fill={live ? C.coral : 'none'}
                stroke={C.coral}
                strokeWidth={1.2}
                opacity={live ? 0.85 : 0.18}
              />
            );
          })}
        </Node>

        {/* value nets */}
        <Node {...NET} p={tNet} col={C.coral} title="VALUE NETS" sub="2 × 732k, averaged">
          {[0, 1].map((n) => (
            <g key={n} opacity={ease(f, 186 + n * 6, 200 + n * 6)}>
              {[0, 1, 2].map((r) => (
                <circle key={r} cx={38 + n * 62} cy={48 + r * 15} r={3.4} fill="none" stroke={C.coral} strokeWidth={1.2} />
              ))}
              <line x1={38 + n * 62} y1={48} x2={38 + n * 62} y2={78} stroke={C.coral} strokeWidth={1} opacity={0.4} />
            </g>
          ))}
          <text x={NET.w / 2} y={66} fill={C.paper} fontFamily={FONT_MONO} fontSize={16} textAnchor="middle" opacity={tNet * 0.9}>
            ⊕
          </text>
        </Node>

        {/* the tau gate */}
        <g opacity={tTau}>
          <rect x={TAU.x} y={TAU.y} width={TAU.w} height={TAU.h} rx={10} fill="rgba(107,124,255,0.10)" stroke={C.indigo} strokeWidth={2} />
          <text x={TAU.x + TAU.w / 2} y={TAU.y + 24} fill={C.indigo} fontFamily={FONT_MONO} fontSize={13} fontWeight={700} textAnchor="middle">
            GATE
          </text>
          <text x={TAU.x + TAU.w / 2} y={TAU.y + 52} fill={C.white} fontFamily={FONT_MONO} fontSize={22} textAnchor="middle">
            τ
          </text>
          <text x={TAU.x + TAU.w / 2} y={TAU.y + 74} fill={C.muted} fontFamily={FONT_MONO} fontSize={9} textAnchor="middle">
            override only
          </text>
        </g>

        {/* travelling token */}
        {tok > 0.02 && tok < 0.99 && (
          <circle cx={tokX} cy={374} r={5} fill={C.white} opacity={0.9}>
          </circle>
        )}

        {/* action */}
        <Node {...ACT} p={tAct} col={C.indigo} title="ACTION" sub="~2 overrides / game" fill="rgba(107,124,255,0.10)">
          <text x={ACT.w / 2} y={50} fill={C.white} fontFamily={FONT_MONO} fontSize={11} textAnchor="middle" opacity={0.85}>
            index returned
          </text>
        </Node>
        </g>
      </svg>

      <Reveal from={262} style={{ textAlign: 'center', marginTop: -6, color: C.muted, fontSize: 14, fontFamily: FONT_MONO }}>
        1.6 vCPUs · 600 s per game · search is worth ~21 win-rate points
      </Reveal>
    </Bg>
  );
};
