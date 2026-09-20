import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { Bg, Label, Reveal } from '../components';
import { C, FONT_DISPLAY, FONT_MONO } from '../theme';

/**
 * The headline finding: the same two networks measured -2.50 pp and +4.28 pp.
 * Nothing about them changed between the readings. Only the aperture in front
 * of them, a single absolute margin tau, which had been tuned against a weaker,
 * noisier version of the same agent and then carried forward unexamined.
 */

const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

// arc path for a donut segment starting at 12 o'clock
const arc = (cx: number, cy: number, r: number, frac: number) => {
  const a = Math.max(0.0001, Math.min(0.9999, frac)) * Math.PI * 2;
  const x = cx + r * Math.sin(a);
  const y = cy - r * Math.cos(a);
  return `M ${cx} ${cy - r} A ${r} ${r} 0 ${a > Math.PI ? 1 : 0} 1 ${x} ${y}`;
};

export const PtcgTauAperture: React.FC = () => {
  const f = useCurrentFrame();

  // the switch happens over frames 150..186
  const swap = ease(f, 150, 186);
  const tau = interpolate(swap, [0, 1], [0.12, 0.04]);
  const pass = interpolate(swap, [0, 1], [3.2, 19.7]);
  const effect = interpolate(swap, [0, 1], [-2.5, 4.28]);
  const col = swap < 0.5 ? C.coral : C.teal;

  const cx = 230;
  const cy = 188;
  const r = 84;

  // dose-response, drawn late. x = override rate %, y = effect pp
  const gx = (v: number) => 585 + (v / 55) * 495;
  const gy = (v: number) => 398 - (v / 7) * 88;
  const curve = [
    [3.2, -2.5],
    [10, 1.4],
    [19.7, 4.28],
    [27, 5.1],
    [33, 5.3],
    [41, 3.4],
    [50, 0.2],
  ] as const;
  const curveD = curve.map(([a, b], i) => `${i ? 'L' : 'M'} ${gx(a)} ${gy(b)}`).join(' ');
  const tCurve = ease(f, 236, 288);

  return (
    <Bg>
      <Reveal from={0}>
        <Label>The same networks, measured twice</Label>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 34, color: C.white, marginTop: 6 }}>
          One number was hiding the <span style={{ color: C.coral }}>whole result</span>
        </div>
      </Reveal>

      <svg width={1152} height={442} style={{ marginTop: 4 }}>
        {/* ---------------- the aperture ---------------- */}
        <g opacity={ease(f, 26, 46)}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.line} strokeWidth={16} />
          <path d={arc(cx, cy, r, pass / 100)} fill="none" stroke={col} strokeWidth={16} strokeLinecap="round" />
          <text x={cx} y={cy - 6} fill={C.white} fontFamily={FONT_MONO} fontSize={40} fontWeight={700} textAnchor="middle">
            {pass.toFixed(1)}%
          </text>
          <text x={cx} y={cy + 20} fill={C.muted} fontFamily={FONT_MONO} fontSize={11} textAnchor="middle">
            of searched decisions
          </text>
          <text x={cx} y={cy + 38} fill={C.muted} fontFamily={FONT_MONO} fontSize={11} textAnchor="middle">
            the gate lets through
          </text>
        </g>

        {/* tau readout under the dial */}
        <g opacity={ease(f, 40, 58)}>
          <text x={cx} y={cy + r + 52} fill={C.paper} fontFamily={FONT_MONO} fontSize={18} textAnchor="middle">
            τ = {tau.toFixed(2)}
          </text>
          <text x={cx} y={cy + r + 72} fill={C.muted} fontFamily={FONT_MONO} fontSize={10} textAnchor="middle">
            absolute margin on a noisy estimate
          </text>
        </g>

        {/* ---------------- the measured effect ---------------- */}
        <g opacity={ease(f, 64, 86)}>
          <text x={585} y={104} fill={C.muted} fontFamily={FONT_MONO} fontSize={12}>
            TWO-NETWORK ENSEMBLE, MEASURED
          </text>
          <text x={585} y={170} fill={col} fontFamily={FONT_MONO} fontSize={62} fontWeight={700}>
            {effect > 0 ? '+' : '−'}
            {Math.abs(effect).toFixed(2)} pp
          </text>
          <text x={585} y={200} fill={C.paper} fontFamily={FONT_MONO} fontSize={13} opacity={0.85}>
            {swap < 0.5 ? '95% CI [−6.18, +1.18] · n = 12,800' : '95% CI [+2.43, +6.13] · z = 4.54 · n = 3,200'}
          </text>
          <text x={585} y={226} fill={col} fontFamily={FONT_MONO} fontSize={13}>
            {swap < 0.5 ? 'verdict: null, do not field' : 'verdict: ship it'}
          </text>
        </g>

        {/* the pivot line (plain <text>: Reveal renders a div, invalid inside svg) */}
        <text x={60} y={392} fill={C.white} fontFamily={FONT_DISPLAY} fontSize={19} opacity={ease(f, 112, 132)}>
          Nothing about the networks changed.
        </text>
        <text x={60} y={420} fill={C.coral} fontFamily={FONT_DISPLAY} fontSize={19} opacity={ease(f, 130, 150)}>
          Only the gate in front of them.
        </text>

        {/* ---------------- dose-response ---------------- */}
        <g opacity={tCurve > 0 ? 1 : 0}>
          <line x1={gx(0)} y1={gy(0)} x2={gx(55)} y2={gy(0)} stroke={C.line} strokeWidth={1} opacity={tCurve} />
          <path
            d={curveD}
            fill="none"
            stroke={C.indigo}
            strokeWidth={2.5}
            strokeDasharray={700}
            strokeDashoffset={700 * (1 - tCurve)}
          />
          <text x={gx(0)} y={gy(0) + 18} fill={C.muted} fontFamily={FONT_MONO} fontSize={10} opacity={tCurve}>
            override rate →
          </text>
          <g opacity={ease(f, 274, 292)}>
            <line x1={gx(33)} y1={gy(7)} x2={gx(33)} y2={gy(-1)} stroke={C.coral} strokeWidth={1.5} strokeDasharray="4 4" />
            <text x={gx(33)} y={gy(7) - 8} fill={C.coral} fontFamily={FONT_MONO} fontSize={11} textAnchor="middle">
              turns at ~33%
            </text>
          </g>
        </g>
      </svg>

      <Reveal from={300} style={{ textAlign: 'center', marginTop: -10, color: C.muted, fontSize: 14, fontFamily: FONT_MONO }}>
        a threshold tuned on a weaker agent throttles every component built after it
      </Reveal>
    </Bg>
  );
};
