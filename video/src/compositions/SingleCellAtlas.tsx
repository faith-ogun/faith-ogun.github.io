import React from 'react';
import { useCurrentFrame, interpolate, random } from 'remotion';
import { Bg, Label, Reveal } from '../components';
import { C, FONT_DISPLAY, FONT_MONO } from '../theme';

const CLUSTERS = [
  { cx: 360, cy: 470, color: C.indigo, label: 'Epithelial' },
  { cx: 640, cy: 430, color: C.teal, label: 'Stromal' },
  { cx: 900, cy: 480, color: C.coral, label: 'Immune' },
];

export const SingleCellAtlas: React.FC = () => {
  const frame = useCurrentFrame();
  const N = 150;
  const settle = interpolate(frame, [20, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Bg>
      <Reveal from={0}>
        <Label>Single-cell atlas · scRNA-seq</Label>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 40, color: C.white, marginTop: 8 }}>
          800,000 cells → <span style={{ color: C.indigo }}>41 cell-type clusters</span>
        </div>
      </Reveal>
      <svg width={1152} height={520} style={{ marginTop: 10 }}>
        {Array.from({ length: N }, (_, i) => {
          const cl = CLUSTERS[i % 3];
          const sx = 120 + random(`x${i}`) * 920;
          const sy = 40 + random(`y${i}`) * 360;
          const ang = random(`a${i}`) * Math.PI * 2;
          const rad = 20 + random(`r${i}`) * 70;
          const tx = cl.cx + Math.cos(ang) * rad;
          const ty = cl.cy - 120 + Math.sin(ang) * rad * 0.7;
          const x = interpolate(settle, [0, 1], [sx, tx]);
          const y = interpolate(settle, [0, 1], [sy, ty]);
          const col = interpolate(settle, [0.3, 1], [0, 1]);
          return <circle key={i} cx={x} cy={y} r={4} fill={col > 0.5 ? cl.color : C.muted} opacity={0.85} />;
        })}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 60, marginTop: -10 }}>
        {CLUSTERS.map((c, i) => (
          <Reveal key={c.label} from={70 + i * 8}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: FONT_MONO, fontSize: 16 }}>
              <span style={{ width: 12, height: 12, borderRadius: 6, background: c.color, display: 'inline-block' }} />
              {c.label}
            </div>
          </Reveal>
        ))}
      </div>
    </Bg>
  );
};
