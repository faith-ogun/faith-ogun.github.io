---
title: "A decade in the non-coding genome (2015–2025)"
description: "A journal-club tour of ten years of non-coding driver research in cancer, from the first 50 bp hotspot scans and the TERT exception, through PCAWG's 'paucity' verdict and GC-bias blind spots, to genome-wide and single-cell methods, and why the field is now pivoting from statistics to deep learning."
date: 2025-10-30
heroKicker: "Journal Club · Review"
readingTime: "13 min read"
tags: ["Non-coding drivers", "TERT", "PCAWG", "Cancer genomics", "Breast cancer", "Deep learning"]
papers:
  - title: "Beyond the exome: the role of non-coding somatic mutations in cancer"
    authors: "Piraino & Furney"
    venue: "Human Genetics"
    year: 2015
    url: "https://www.annalsofoncology.org/article/S0923-7534(19)35559-0/fulltext"
  - title: "Analyses of non-coding somatic drivers in 2,658 cancer whole genomes (PCAWG)"
    authors: "Rheinbay et al."
    venue: "Nature"
    year: 2020
    url: "https://www.nature.com/articles/s41586-020-1965-x"
  - title: "Non-coding driver mutations in human cancer"
    authors: "Elliott & Larsson"
    venue: "Nature Reviews Cancer"
    year: 2021
    url: "https://doi.org/10.1038/s41568-021-00371-z"
  - title: "Genome-wide analysis of somatic noncoding mutation patterns in cancer"
    authors: "Dietlein et al."
    venue: "Science"
    year: 2024
    url: "https://www.science.org/doi/10.1126/science.abg5601"
---

This one was a review rather than a single paper, I wanted to step back and trace how non-coding
cancer genomics actually evolved over ten years, because that arc *is* the justification for my PhD.
It's also personal: the story starts with my supervisor's work, and it ends right where I'm trying
to push it. Here's the decade, and the through-line I took from it.

## The premise: 98% of the genome, mostly ignored

Only ~1.5–2% of the genome is protein-coding. The other **~98% is non-coding**, promoters,
enhancers, silencers and insulators (CTCF sites), UTRs, introns, non-coding RNAs (lncRNAs, miRNAs),
and vast intergenic stretches. Mutations out there can change gene expression *without* touching a
protein: shifting transcription-factor binding, chromatin accessibility or RNA processing, enough
to activate an oncogene (the textbook case is the **TERT** promoter) or silence a tumour suppressor.

<figure>
  <video src="/assets/video/decade-timeline.mp4" autoplay loop muted playsinline></video>
  <figcaption>Ten years of non-coding driver discovery: from the first hotspot scans (2015) to pan-cancer paucity (2020), genome-wide methods (2024) and the functional-validation era (2025).</figcaption>
</figure>

## 2015–2017, hotspots and the first scans

The early era was about *finding* recurrence. Piraino & Furney's work laid out why non-coding
mutations matter and built unbiased genome-wide scans: tile the genome into **50 bp windows** and
score each on **recurrence** (mutations above local background) and **conservation** (evolutionary
constraint), then filter out low-mappability and hypermutated regions. The deliverable was a unified
ranking of candidate driver regions, coding and non-coding together. This is, essentially, the
ancestor of the hotspot-calling I do in my Objective 2.

<figure>
  <video src="/assets/video/early-scans.mp4" autoplay loop muted playsinline></video>
  <figcaption>The first scans tiled the genome into 50 bp windows, scoring each on recurrence and conservation to rank candidate driver regions.</figcaption>
</figure>

## 2018–2021, the pan-cancer verdict, and a hard truth

Then came scale: **PCAWG / Rheinbay et al. (2020)** searched 2,658 whole genomes, integrating **13
driver-discovery algorithms** with Brown's method to combine dependent p-values, and filtered
aggressively (discarding 46% of significant hits as artefacts of APOBEC/UV/AID mutational processes).

The verdict was sobering: beyond **TERT**, non-coding point-mutation drivers were "surprisingly
limited", an estimated 96 promoter driver mutations (73 of them TERT) versus >1,475 in coding
sequence.

<figure>
  <video src="/assets/video/pcawg-paucity.mp4" autoplay loop muted playsinline></video>
  <figcaption>Across 2,658 genomes, aggressive filtering of mutational-process artefacts left almost nothing standing beyond the TERT promoter, the field's sobering "paucity" verdict.</figcaption>
</figure>

But the honest reading, which Elliott & Larsson's review captures, is that **paucity is
entangled with detectability**:

- **GC bias.** Promoters are GC-rich, GC-rich regions get poor WGS coverage, so real drivers get
  missed. Up to a third of PCAWG tumours had <20% sensitivity at the TERT hotspots themselves.
- **Targeted depth rescues signal.** Deep-sequencing the **FOXA1** promoter across 360 breast
  tumours recovered recurrent mutations invisible at standard depth (sensitivity was ~1% in the TCGA
  breast WGS), though even then they sat at 2.9%, and FOXA1's high genome-wide indel rate hints some
  3′UTR indels are passengers, not drivers. A good lesson in not over-reading recurrence.
- **Structural variants matter too.** PCAWG's recurrent-breakpoint methods found a recurrent focal
  **microdeletion at BRD4** that *lowers* expression of an otherwise-amplified gene in breast and
  ovarian tumours, the first evidence of a microdeletion limiting an amplified gene.

<div class="keypoint">
<p><strong>The line I keep quoting</strong> (Elliott &amp; Larsson): mutation-rate models can never
perfectly reflect reality, so selection p-values are "simply scores that reflect… whether a signal is
interesting, given today's knowledge." Every non-coding hotspot list is provisional. That humility is
a design requirement, not a disclaimer.</p>
</div>

## 2022–2024, going genome-wide and integrative

The methods matured. **Dietlein et al. (2024)** ran a genome-wide sliding window over 61.2 million
mutations from 3,949 patients, combining three significance tests on tiled 1/10/100 kb intervals:
an **epigenomic** comparison (more mutations than the histone-ChIP signal predicts), an
**inter-tumour** comparison (cancer-type-specific accumulation as a proxy for missing epigenomic
data), and **positional clustering**. It's the clearest statement that you detect non-coding drivers
by *integrating* mutation patterns with regulatory context, not by recurrence alone.

<figure>
  <video src="/assets/video/dietlein-genomewide.mp4" autoplay loop muted playsinline></video>
  <figcaption>Dietlein integrates three signals, epigenomic, inter-tumour and positional clustering, into a single genome-wide driver call.</figcaption>
</figure>

## 2025, the functional-validation era

The frontier moved from "is this region recurrently mutated?" to "what does the mutation *do*?",
exactly the [ultraconserved-elements study](/blog/noncoding-ultraconserved-elements/) (Bayraktar
2025), which paired burden tests with CRISPR screens and showed mutated ncUCEs acting as real
enhancers and silencers. Statistics → mechanism → bench.

## The through-line I took for my PhD

Two things crystallised for me writing this:

1. **The classical toolkit is almost entirely statistical.** Look at the standard tables of
   non-coding selection tools, LARVA, OncodriveFML, ExInAtor and the rest, and *none* are really
   machine-learning or deep-learning models. The whole field's detection layer is mutation-rate
   modelling. That's the gap I want to work in: bringing learned regulatory representations (the kind
   [AlphaGenome](/blog/alphagenome/) and [MPRA models](/blog/regulatory-grammar-deep-learning/) now
   provide) into driver *prioritisation*, not just counting.
2. **"Paucity" was partly a measurement artefact.** GC bias, coverage, and the wrong unit of analysis
   hid signal. A breast-specific, regulatory-map-aware search, with contact-supported enhancer–gene
   links and proper, conservatively-calibrated nulls, is a genuinely different experiment from the
   pan-cancer scans that concluded the cupboard was bare.

A decade in, the non-coding genome isn't "done", it's where the most interesting, least-finished
questions in cancer genomics still live. Which is the whole reason I'm here.
