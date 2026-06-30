---
title: "Ultraconserved elements as a new class of non-coding cancer drivers"
description: "A journal club on Bayraktar et al., the mutational landscape of noncoding ultraconserved elements in human cancers, where sequences 100% identical across mammals turn out to act as mutated enhancers, silencers and miRNA-processing sites in tumours."
date: 2025-09-25
heroKicker: "Journal Club · Non-coding drivers"
readingTime: "10 min read"
tags: ["Ultraconserved elements", "Non-coding drivers", "Enhancers", "CRISPR screen", "Cancer genomics"]
papers:
  - title: "The mutational landscape and functional effects of noncoding ultraconserved elements in human cancers"
    authors: "Bayraktar et al."
    venue: "Science Advances"
    year: 2025
    url: "https://www.science.org/doi/10.1126/sciadv.ado2830"
---

This was one of my earliest journal clubs, and I chose it because it's almost a thesis statement for
my whole PhD: it takes a class of non-coding sequence nobody had systematically mutated in cancer,
and shows, statistically *and* at the bench, that those sequences carry real driver mutations.

## Why ultraconserved elements?

**Ultraconserved elements (UCEs)** are stretches >100 bp that are 100% identical across at least
three of five placental mammals. That degree of conservation is extraordinary, evolution clearly
won't tolerate change there, yet most UCEs are non-coding (intronic, intergenic, regulatory) and
their role in cancer was unknown. The hypothesis is simple and bold: if a sequence is *that*
conserved, a somatic mutation in it should matter, and some of those mutations might be drivers.

A nice sanity check up front: across the 1000 Genomes Project, UCEs carry significantly *lower*
germline SNP density than the genome or even the exome, they're under strong purifying selection in
the germline. Which makes their somatic behaviour in tumours all the more interesting.

## The mutational landscape

Across **2,449 primary tumours (22 cancer types, PCAWG)**, they found 24,039 somatic mutations in
~73% of UCEs. Two numbers stood out to me:

- UCEs have a **higher somatic mutation rate per Mb** than coding regions (4.41 vs 2.93), and within
  UCEs the non-coding ones (ncUCEs) mutate *more* than coding UCEs.
- ncUCEs with **deeper conservation** (≥90% across 50 species) harbour *more* mutations, the most
  ancient regions are the most mutated in cancer. That's a counter-intuitive, selection-flavoured
  signal worth sitting with.

## Are they actually drivers?

This is the part that maps onto my Objective 2 (finding positively selected non-coding hotspots).
They ran a **mutation-burden test** on individual UCEs plus a **simulation test** (UCEs matched for
size, annotation and ±1 Mb local context, 1,000 permutations). Real ncUCE driver candidates ranked
in the **top 0.5%** of the simulated distribution, i.e. excess burden beyond chance, the signature
of positive selection. Six ncUCE driver candidates emerged (FDR < 0.05), including the 5′UTR of
BCL6, the promoter of PAX5, and splice sites of FBXO11/ARHGAP15/EBF1, several already COSMIC cancer
genes.

<figure>
  <video src="/assets/video/ultraconserved-elements.mp4" autoplay loop muted playsinline></video>
  <figcaption>An ultraconserved element is identical across mammals; a somatic mutation that pushes its burden past a context-matched null marks it as a non-coding driver candidate.</figcaption>
</figure>

<div class="keypoint">
<p><strong>Method I took away:</strong> the burden-plus-simulation framework with context-matched
nulls is exactly the kind of conservative, well-calibrated test I want for breast-specific hotspot
calling. A statistical "driver" list only earns trust when the null is built this carefully.</p>
</div>

## From statistics to function, the bench half

What elevates this paper is that they didn't stop at a list. A multiplexed **CRISPR–AsCpf1 screen**
of 2,247 recurrently mutated ncUCEs across three colorectal lines returned **35 hits** that altered
proliferation, and they dissected two mechanistically:

- **UCE_11311 is an enhancer of ARID1B** (a SWI/SNF tumour suppressor). It carries H3K27ac, and
  knocking it out lowers ARID1B and drives a pro-oncogenic phenotype, more colony formation, larger
  xenograft tumours, higher Ki-67.
- **UCE_2272 is a silencer of RPS13.** It carries H3K27me3, represses a reporter in luciferase
  assays, and its knockout de-represses RPS13 (an aggressiveness marker) and again grows bigger
  tumours.

They also showed **MIR142** ncUCE mutations disrupt miRNA processing, mutations in the CNNC motif
impair SRSF3-assisted Drosha processing, reducing mature miR-142. So ncUCE mutations act through at
least three distinct mechanisms: enhancer loss, silencer loss, and miRNA-processing disruption.

## Why it mattered for me

This paper is, in miniature, the full arc I want my PhD to run: define a non-coding sequence class,
test it for positive selection with a properly matched null, then validate candidates functionally,
discovery → selection → mechanism → bench. It's also a reminder that conservation is a powerful
prior for picking *where* in the non-coding genome to look. The main gap, from my angle, is that it's
pan-cancer and colorectal-focused; the breast-specific, regulatory-map-aware version of this analysis
is part of what I'm building.
