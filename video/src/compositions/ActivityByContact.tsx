import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { Bg, Label, Reveal } from '../components';
import { C, FONT_DISPLAY, FONT_MONO } from '../theme';

export const ActivityByContact: React.FC = () => {
  const frame = useCurrentFrame();
  const gene = { x: 880, y: 360 };
  const e1 = { x: 230, y: 360 }; // far, loops a lot
  const e2 = { x: 560, y: 360 }; // near, loops little
  const loop = (from: { x: number; y: number }, h: number, p: number, color: string, w: number) => {
    const dash = 1200;
    const off = interpolate(p, [0, 1], [dash, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    return <path d={`M ${from.x} ${from.y} Q ${(from.x + gene.x) / 2} ${gene.y - h} ${gene.x} ${gene.y}`}
      fill="none" stroke={color} strokeWidth={w} strokeDasharray={dash} strokeDashoffset={off} opacity={0.9} />;
  };
  const box = (e: { x: number; y: number }, color: string, name: string) => (
    <>
      <rect x={e.x - 55} y={e.y - 16} width={110} height={32} rx={6} fill="none" stroke={color} strokeWidth={2} />
      <text x={e.x} y={e.y + 5} fill={color} fontFamily={FONT_MONO} fontSize={14} textAnchor="middle">{name}</text>
    </>
  );
  const p1 = interpolate(frame, [20, 60], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const p2 = interpolate(frame, [35, 75], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  return (
    <Bg>
      <Reveal from={0}>
        <Label>Activity-by-Contact · enhancer → gene</Label>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 38, color: C.white, marginTop: 8 }}>
          Contact breaks the tie: <span style={{ color: C.coral }}>activity × contact</span>
        </div>
      </Reveal>
      <svg width={1152} height={430} style={{ marginTop: 20 }}>
        <line x1={80} y1={360} x2={1080} y2={360} stroke={C.line} strokeWidth={2} />
        {loop(e1, 230, p1, C.coral, 4)}
        {loop(e2, 90, p2, C.indigo, 2.5)}
        {box(e1, C.coral, 'Enhancer A')}
        {box(e2, C.indigo, 'Enhancer B')}
        <rect x={gene.x - 60} y={gene.y - 18} width={120} height={36} rx={6} fill={C.paper} />
        <text x={gene.x} y={gene.y + 6} fill={C.navy} fontFamily={FONT_MONO} fontSize={15} fontWeight={700} textAnchor="middle">GENE</text>
      </svg>
      <Reveal from={80} style={{ display: 'flex', justifyContent: 'center', gap: 40, marginTop: -6 }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 18, color: C.coral }}>A → 75% of regulation</div>
        <div style={{ fontFamily: FONT_MONO, fontSize: 18, color: C.indigo }}>B → 25%</div>
      </Reveal>
      <Reveal from={92} style={{ textAlign: 'center', marginTop: 10, color: C.muted, fontSize: 15, fontFamily: FONT_MONO }}>
        same activity, 3× the contact
      </Reveal>
    </Bg>
  );
};
