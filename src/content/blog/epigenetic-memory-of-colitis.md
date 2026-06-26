---
title: "When the transcriptome forgets but the epigenome remembers"
description: "A journal club on Nagaraja et al., how chronic colitis leaves a durable, clonally inherited epigenetic memory of AP-1 activity in colonic stem cells that persists for months and primes the tissue for tumour growth."
date: 2026-04-16
heroKicker: "Journal Club · Epigenetic memory"
readingTime: "11 min read"
tags: ["Epigenetic memory", "AP-1", "Chromatin accessibility", "Inflammation", "scATAC-seq", "FOXA1"]
papers:
  - title: "Epigenetic memory of colitis promotes tumour growth"
    authors: "Nagaraja, Ojeda-Miron, Zhang … Buenrostro et al."
    venue: "Nature"
    year: 2026
    url: "https://doi.org/10.1038/s41586-026-10258-4"
---

Chronic inflammation is a well-established cancer risk factor, ulcerative colitis patients are 2–5×
more likely to develop colorectal cancer, but the molecular *why* has stayed fuzzy. This paper gives
a strikingly clean answer: the tissue keeps a **memory** of the inflammation written in chromatin,
long after the inflammation itself is gone, and that memory primes it for tumours. I picked it
because the methods and the molecular cast (AP-1, FOXA1, chromVAR) overlap almost exactly with my
own breast-cancer atlas.

## The central dissociation

Using a DSS colitis model with SHARE-seq (joint scATAC + scRNA from the same cell) across control,
acute, chronic and recovery stages, they find the result the whole paper turns on:

> **97% of inflammation-activated genes return to baseline after recovery, but the chromatin does
> not.** Recovered stem cells stay epigenomically distinct from controls.

<figure>
  <video src="/assets/video/epigenetic-memory.mp4" autoplay loop muted playsinline></video>
  <figcaption>After injury resolves, the transcriptome resets to baseline while AP-1 chromatin accessibility stays elevated, the molecular definition of epigenetic memory.</figcaption>
</figure>

The memory has a dominant signature: **cumulative gain of AP-1 (FOS/JUN) motif accessibility**.
About 9.2% of recovered stem cells carry exceptionally high AP-1 accessibility (vs 1.6% in controls),
and, the part I find wild, it persists **>102 days**, dozens of generations of epithelial turnover.
And it's *independent of the protein*: FOS protein peaks during injury then drops within 21 days,
while the AP-1 chromatin accessibility lags and stays high. The memory is in the chromatin structure
itself, reinforced by concordant DNA methylation changes (4,397 regions: accessibility up,
methylation down).

## It's clonally inherited

They built **SHARE-TRACE** (SHARE-seq + lentiviral clonal barcoding) to ask whether these states are
*heritable* through cell division. They are: cells within a clone resemble each other more than
random cells, and AP-1 is the *only* TF with memory both in vivo and through clonal lineages. The
in-vivo and ex-vivo distributions of high-AP-1 cells match (~9–12%), which means the heterogeneity is
maintained cell-intrinsically, not by signalling from the niche.

## FOX stabilises AP-1, and the tumour payoff

A deep-learning footprinting tool (seq2PRINT) discovered a composite **AP-1/FOX** motif de novo, and
biochemistry confirmed **FOX TFs cooperatively stabilise AP-1 binding** at memory sites (FOXP1+AP-1
up to 8.3×), even via protein–protein interaction without the FOX DNA motif (AlphaFold3-backed).

Then the functional payoff: in an APC-loss adenoma model, colitis-recovered mice grow **larger early
tumours** (not more tumours, bigger ones), spatial transcriptomics shows colitis tumours activate
the AP-1 wound-healing program (P20), and, the rescue, **AP-1 inhibition during initiation cuts
tumour size ~40%, specifically in colitis-memory mice**. Importantly, inhibiting AP-1 blocks the
*phenotype* without erasing the *memory* (chromatin + methylation persist), so the memory is the
durable substrate, and AP-1 activity is what reads it out.

<div class="keypoint">
<p><strong>Why this maps onto my work:</strong> <strong>FOXA1</strong> is the dominant luminal-breast
cistrome TF in my atlas, and here it's shown stabilising AP-1 binding. <strong>FOSL1/AP-1</strong>
sit at the centre of triple-negative regulatory architecture in my Layer 2 analysis. They even use
<strong>chromVAR</strong>, the exact tool I run for motif-accessibility scoring. The whole "field
cancerisation via heritable epi-states" idea is a mechanistic mirror of my Objective 3: non-coding
changes rewiring enhancers in breast cancer.</p>
</div>

## My critical read

The strengths are obvious, an unusually complete validation chain (in vivo → organoid → clonal →
biochemical → structural), extended timepoints, and a human IBD-organoid translation. The honest
limits: it's a colitis/colorectal model only, DSS is chemical injury rather than true autoimmune UC,
the colitis→cancer link in humans is still *inferred* from mouse, and they lack WGS to fully exclude
a somatic-mutation contribution to clonal fitness. That last one matters to me directly, it's the
exact place my non-coding-mutation work meets their epigenetic-memory work. Their question is "what
does chronic injury write into chromatin?"; mine is "what do somatic mutations write into the same
regulatory elements?" The most interesting version of breast-cancer biology is probably where those
two answers meet, heritable epigenetic state *and* the mutations that lock it in.
