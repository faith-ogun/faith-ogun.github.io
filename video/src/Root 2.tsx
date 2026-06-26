import React from 'react';
import { Composition } from 'remotion';
import { VIDEO } from './theme';
import { AlphaGenomeModalities } from './compositions/AlphaGenomeModalities';
import { SingleCellAtlas } from './compositions/SingleCellAtlas';
import { ActivityByContact } from './compositions/ActivityByContact';
import { MpraGrammar } from './compositions/MpraGrammar';
import { AgeSelection } from './compositions/AgeSelection';
import { EpigeneticMemory } from './compositions/EpigeneticMemory';
import { DecadeTimeline } from './compositions/DecadeTimeline';

const base = { fps: VIDEO.fps, width: VIDEO.width, height: VIDEO.height };

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="alphagenome-modalities" component={AlphaGenomeModalities} durationInFrames={150} {...base} />
      <Composition id="single-cell-atlas" component={SingleCellAtlas} durationInFrames={140} {...base} />
      <Composition id="activity-by-contact" component={ActivityByContact} durationInFrames={150} {...base} />
      <Composition id="mpra-grammar" component={MpraGrammar} durationInFrames={140} {...base} />
      <Composition id="age-selection" component={AgeSelection} durationInFrames={140} {...base} />
      <Composition id="epigenetic-memory" component={EpigeneticMemory} durationInFrames={160} {...base} />
      <Composition id="decade-timeline" component={DecadeTimeline} durationInFrames={170} {...base} />
    </>
  );
};
