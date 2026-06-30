import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { Bg, Label, Reveal } from '../components';
import { C, FONT_DISPLAY, FONT_MONO } from '../theme';

// 2015-2017: a 50 bp window slides across the genome, scoring recurrence +
// conservation, and a couple of hotspots cross the bar.
export const EarlyScans: React.FC = () => {
  const frame = useCurrentFrame();
  const ox = 90;
  const trackY = 250;
  const trackW = 1000;
  const winW = 70;
  const winX = interpolate(frame, [15, 120], [ox, ox + trackW - winW], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // hotspot peaks at fixed positions
  const peaks = [
    { x: ox + 240, h: 70, hit: true, t: 40 },
    { x: ox + 520, h: 40, hit: false, t: 70 },
    { x: ox + 760, h: 96, hit: true, t: 95 },
  ];
  return (
    <Bg>
      <Reveal from={0}>
        <Label>2015–2017 · Piraino &amp; Furney</Label>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 38, color: C.white, marginTop: 8 }}>
          Tile the genome into <span style={{ color: C.coral }}>50 bp windows</span>
        </div>
      </Reveal>
      <svg width={1152} height={360} style={{ marginTop: 30 }}>
        {/* genome line */}
        <line x1={ox} y1={trackY} x2={ox + trackW} y2={trackY} stroke={C.line} strokeWidth={2} />
        <text x={ox} y={trackY + 34} fill={C.muted} fontFamily={FONT_MONO} fontSize={13}>genome position →</text>
        {/* peaks (bars rising) */}
        {peaks.map((p, i) => {
          const a = interpolate(frame, [p.t, p.t + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const col = p.hit ? C.coral : C.indigoDeep;
          return (
            <g key={i}>
              <rect x={p.x - 9} y={trackY - p.h * a} width={18} height={p.h * a} rx={4} fill={col} opacity={0.9} />
              {p.hit && (
                <text x={p.x} y={trackY - p.h * a - 8} fill={C.coral} fontFamily={FONT_MONO} fontSize={12} textAnchor="middle" opacity={a}>hotspot</text>
              )}
            </g>
          );
        })}
        {/* significance bar */}
        <line x1={ox} y1={trackY - 60} x2={ox + trackW} y2={trackY - 60} stroke={C.white} strokeWidth={1} strokeDasharray="5 5" opacity={0.4} />
        <text x={ox + trackW} y={trackY - 66} fill={C.muted} fontFamily={FONT_MONO} fontSize={11} textAnchor="end">significance bar</text>
        {/* sliding window */}
        <rect x={winX} y={trackY - 110} width={winW} height={150} rx={6} fill={C.indigo} opacity={0.12} stroke={C.indigo} strokeWidth={1.5} />
      </svg>
      <Reveal from={120} style={{ textAlign: 'center', color: C.muted, fontSize: 15, fontFamily: FONT_MONO }}>
        score each window on recurrence + conservation → a ranked candidate list
      </Reveal>
    </Bg>
  );
};
