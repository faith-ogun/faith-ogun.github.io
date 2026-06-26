import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { Bg, Label, Reveal } from '../components';
import { C, FONT_DISPLAY, FONT_MONO } from '../theme';

// two traces over disease timeline: transcriptome resets, chromatin stays high
const stages = ['control', 'acute', 'chronic', 'recovery', '+100d'];

export const EpigeneticMemory: React.FC = () => {
  const frame = useCurrentFrame();
  const x0 = 130, x1 = 1030, y0 = 380, H = 240;
  // value at stage index (0..4)
  const transcriptome = [0.05, 0.85, 1.0, 0.12, 0.05];
  const chromatin = [0.05, 0.7, 0.95, 0.9, 0.78];
  const toPts = (arr: number[], p: number) => {
    const pts = arr.map((v, i) => {
      const x = x0 + (i / (arr.length - 1)) * (x1 - x0);
      const y = y0 - v * H;
      return { x, y };
    });
    const shown = interpolate(p, [0, 1], [0, pts.length - 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const seg = Math.min(1, Math.max(0, shown - (i - 1)));
      const px = pts[i - 1].x + (pts[i].x - pts[i - 1].x) * seg;
      const py = pts[i - 1].y + (pts[i].y - pts[i - 1].y) * seg;
      d += ` L ${px} ${py}`;
      if (seg < 1) break;
    }
    return d;
  };
  const p = interpolate(frame, [20, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Bg>
      <Reveal from={0}>
        <Label>Epigenetic memory · colitis</Label>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 36, color: C.white, marginTop: 8 }}>
          The transcriptome <span style={{ color: C.indigo }}>forgets</span>, the epigenome <span style={{ color: C.coral }}>remembers</span>
        </div>
      </Reveal>
      <svg width={1152} height={430} style={{ marginTop: 14 }}>
        <line x1={x0} y1={y0} x2={x1} y2={y0} stroke={C.line} strokeWidth={2} />
        {stages.map((s, i) => {
          const x = x0 + (i / (stages.length - 1)) * (x1 - x0);
          return <text key={s} x={x} y={y0 + 26} fill={C.muted} fontFamily={FONT_MONO} fontSize={13} textAnchor="middle">{s}</text>;
        })}
        <path d={toPts(chromatin, p)} fill="none" stroke={C.coral} strokeWidth={3.5} strokeLinejoin="round" strokeLinecap="round" />
        <path d={toPts(transcriptome, p)} fill="none" stroke={C.indigo} strokeWidth={3.5} strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <Reveal from={95} style={{ display: 'flex', justifyContent: 'center', gap: 48, marginTop: -6 }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 16, color: C.coral }}>● AP-1 chromatin accessibility</div>
        <div style={{ fontFamily: FONT_MONO, fontSize: 16, color: C.indigo }}>● gene expression</div>
      </Reveal>
    </Bg>
  );
};
