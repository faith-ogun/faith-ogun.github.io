import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { Bg, Label, Reveal } from '../components';
import { C, FONT_DISPLAY, FONT_MONO } from '../theme';

const TRACKS = [
  { name: 'RNA-seq / expression', color: C.indigo, kind: 'wave' },
  { name: 'ATAC / chromatin', color: C.teal, kind: 'peaks' },
  { name: 'Histone marks', color: C.indigo, kind: 'peaks' },
  { name: 'TF binding', color: C.coral, kind: 'peaks' },
  { name: 'Splice junctions', color: C.teal, kind: 'arcs' },
  { name: '3D contacts', color: C.indigo, kind: 'tri' },
] as const;

const Wave: React.FC<{ color: string; p: number }> = ({ color, p }) => {
  const w = 560;
  const pts = Array.from({ length: 60 }, (_, i) => {
    const x = (i / 59) * w;
    const y = 18 + Math.sin(i * 0.5) * 12 * Math.sin(i * 0.13) - Math.cos(i * 0.31) * 4;
    return `${x},${24 - y / 2 + 12}`;
  }).join(' ');
  return (
    <svg width={w} height={36} style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round"
        strokeDasharray={2000} strokeDashoffset={interpolate(p, [0, 1], [2000, 0])} />
    </svg>
  );
};
const Peaks: React.FC<{ color: string; p: number; seed: number }> = ({ color, p, seed }) => {
  const w = 560, n = 26;
  return (
    <svg width={w} height={36}>
      {Array.from({ length: n }, (_, i) => {
        const h = 6 + ((Math.sin(i * (1.3 + seed)) + 1) / 2) * 28;
        const x = (i / (n - 1)) * (w - 8) + 4;
        const grow = interpolate(p, [i / n, i / n + 0.3], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        return <rect key={i} x={x - 3} y={34 - h * grow} width={6} height={h * grow} rx={2} fill={color} />;
      })}
    </svg>
  );
};
const Arcs: React.FC<{ color: string; p: number }> = ({ color, p }) => {
  const w = 560;
  const arcs = [[40, 200], [180, 420], [300, 540]];
  return (
    <svg width={w} height={36} style={{ overflow: 'visible' }}>
      <line x1={0} y1={34} x2={w} y2={34} stroke={C.line} strokeWidth={2} />
      {arcs.map(([a, b], i) => {
        const dash = 600;
        const off = interpolate(p, [i * 0.2, i * 0.2 + 0.5], [dash, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        return <path key={i} d={`M ${a} 34 Q ${(a + b) / 2} ${-6} ${b} 34`} fill="none" stroke={color}
          strokeWidth={2.5} strokeDasharray={dash} strokeDashoffset={off} />;
      })}
    </svg>
  );
};
const Tri: React.FC<{ color: string; p: number }> = ({ color, p }) => {
  const cells: React.ReactNode[] = [];
  const N = 9, s = 18;
  for (let r = 0; r < N; r++) {
    for (let c = 0; c <= r; c++) {
      const x = 280 + (c - r / 2) * s;
      const y = 2 + r * (s * 0.7);
      const v = (Math.sin(r * 0.9) + Math.cos(c * 1.3) + 2) / 4;
      const op = interpolate(p, [r / N, r / N + 0.25], [0, 0.25 + v * 0.7], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
      cells.push(<rect key={`${r}-${c}`} x={x} y={y} width={s - 2} height={s * 0.7 - 2} rx={1} fill={color} opacity={op} />);
    }
  }
  return <svg width={560} height={120} style={{ marginTop: -6 }}>{cells}</svg>;
};

export const AlphaGenomeModalities: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bases = 'ACGT';
  const scroll = interpolate(frame, [0, 120], [0, -240]);

  return (
    <Bg>
      <Reveal from={0}>
        <Label>AlphaGenome · sequence → function</Label>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 40, color: C.white, marginTop: 8 }}>
          One <span style={{ color: C.indigo }}>1&nbsp;Mb</span> window in, <span style={{ color: C.coral }}>11 modalities</span> out
        </div>
      </Reveal>

      {/* sequence window */}
      <Reveal from={10} style={{ marginTop: 34 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            position: 'relative', flex: 1, height: 46, borderRadius: 10, overflow: 'hidden',
            border: `1px solid ${C.line}`, background: 'rgba(107,124,255,0.08)',
          }}>
            <div style={{ position: 'absolute', whiteSpace: 'nowrap', top: 10, left: scroll, fontFamily: FONT_MONO, fontSize: 22, letterSpacing: 6, color: C.muted }}>
              {Array.from({ length: 200 }, (_, i) => bases[(i * 7) % 4]).join('')}
            </div>
          </div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 15, color: C.indigo, border: `1px solid ${C.line}`, padding: '6px 12px', borderRadius: 8 }}>1,000,000 bp</div>
        </div>
      </Reveal>

      {/* arrow */}
      <Reveal from={24} style={{ textAlign: 'center', margin: '10px 0 6px', color: C.muted, fontSize: 26 }}>↓</Reveal>

      {/* tracks */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 40px' }}>
        {TRACKS.map((t, i) => {
          const start = 30 + i * 9;
          const p = spring({ frame: frame - start, fps, config: { damping: 200 }, durationInFrames: 40 });
          return (
            <Reveal key={t.name} from={start} y={14}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 13, letterSpacing: 1, color: t.color, marginBottom: 2 }}>{t.name}</div>
              {t.kind === 'wave' && <Wave color={t.color} p={p} />}
              {t.kind === 'peaks' && <Peaks color={t.color} p={p} seed={i} />}
              {t.kind === 'arcs' && <Arcs color={t.color} p={p} />}
              {t.kind === 'tri' && <Tri color={t.color} p={p} />}
            </Reveal>
          );
        })}
      </div>
    </Bg>
  );
};
