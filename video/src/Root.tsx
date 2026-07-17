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
import { Yost3DGenome } from './compositions/Yost3DGenome';
import { ScegHic } from './compositions/ScegHic';
import { LncrnaDrivers } from './compositions/LncrnaDrivers';
import { Variformer } from './compositions/Variformer';
import { UltraconservedElements } from './compositions/UltraconservedElements';
import { EarlyScans } from './compositions/EarlyScans';
import { PcawgPaucity } from './compositions/PcawgPaucity';
import { DietleinGenomewide } from './compositions/DietleinGenomewide';
import { EnhancerNetworks } from './compositions/EnhancerNetworks';
import { Af3TfBinding } from './compositions/Af3TfBinding';
import { FlarePrioritization } from './compositions/FlarePrioritization';

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
      <Composition id="yost-3d-genome" component={Yost3DGenome} durationInFrames={150} {...base} />
      <Composition id="sceg-hic" component={ScegHic} durationInFrames={160} {...base} />
      <Composition id="lncrna-drivers" component={LncrnaDrivers} durationInFrames={160} {...base} />
      <Composition id="variformer" component={Variformer} durationInFrames={160} {...base} />
      <Composition id="ultraconserved-elements" component={UltraconservedElements} durationInFrames={160} {...base} />
      <Composition id="early-scans" component={EarlyScans} durationInFrames={150} {...base} />
      <Composition id="pcawg-paucity" component={PcawgPaucity} durationInFrames={150} {...base} />
      <Composition id="dietlein-genomewide" component={DietleinGenomewide} durationInFrames={150} {...base} />
      <Composition id="enhancer-networks" component={EnhancerNetworks} durationInFrames={150} {...base} />
      <Composition id="af3-tf-binding" component={Af3TfBinding} durationInFrames={160} {...base} />
      <Composition id="flare-prioritization" component={FlarePrioritization} durationInFrames={160} {...base} />
    </>
  );
};
