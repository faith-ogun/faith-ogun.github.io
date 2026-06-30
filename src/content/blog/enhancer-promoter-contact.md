---
title: "From correlation to contact: how enhancers really find their genes"
description: "A mini journal club on three papers behind my Curie contact work: the Activity-by-Contact model, the 3D genome landscape of primary human cancers, and SCEG-HiC, the principle, the tumour data, and the single-cell engine for contact-supported enhancer-gene links."
date: 2026-06-21
heroKicker: "Mini Journal Club · 3D genome"
readingTime: "14 min read"
tags: ["Enhancers", "Activity-by-Contact", "Hi-C", "3D genome", "SCEG-HiC", "Breast cancer", "Non-coding variants"]
papers:
  - title: "Activity-by-contact model of enhancer–promoter regulation from thousands of CRISPR perturbations"
    authors: "Fulco et al."
    venue: "Nature Genetics"
    year: 2019
    url: "https://www.nature.com/articles/s41588-019-0538-0"
  - title: "Three-dimensional genome landscape of primary human cancers"
    authors: "Yost et al."
    venue: "Nature Genetics"
    year: 2025
    url: "https://www.nature.com/articles/s41588-025-02188-0"
  - title: "Predicting enhancer–gene links from single-cell multi-omics data by integrating prior Hi-C information (SCEG-HiC)"
    authors: "Liang et al."
    venue: "Nucleic Acids Research"
    year: 2026
    url: "https://academic.oup.com/nar/article/54/9/gkag437/8672760"
---

These are the papers sitting underneath the contact work I'll be doing at Institut Curie later this
year, so I presented them together: the first gives the **principle**, the second gives the **data**,
and the third gives the **engine** that turns both into something I can actually run on my atlas.
They all attack the same weakness, that correlation tells you a peak and a gene *behave alike*, but
not that they're *physically connected*, and not which gene an enhancer actually controls.

## The gap: correlation isn't contact

In my atlas (SCARLET, Objective 1), each accessible peak is linked to a target gene by correlating
accessibility with gene activity across cells. That's a guess dressed up as a link. An enhancer can
regulate up to five genes; a gene can be controlled by up to fourteen elements; enhancers routinely
skip the nearest gene. Correlation-only or distance-only linkage assigns the wrong target often
enough that no reviewer should trust it.

## Paper 1, Activity-by-Contact (Fulco et al., 2019)

Fulco and colleagues showed, with thousands of direct CRISPR measurements, that to predict which
enhancer regulates which gene you need **both** how active the enhancer is **and** how often it
contacts the gene.

First they showed the existing rules fail. Measuring 3,863 element–gene pairs by CRISPR in K562:

- "Everything within 100 kb" gives **13% precision** (most nearby elements do nothing).
- "Nearest gene" gives 47% precision, 37% recall (the closest gene is often wrong).
- "Hi-C loops alone" gives 29% precision, **4% recall** (contact alone misses almost everything).

Then the measurement that makes the paper a ground truth: **CRISPRi-FlowFISH**. KRAB-dCas9 plus a
guide library (~one guide per cell) silences one element per cell; cells are labelled for one gene's
RNA by FISH, sorted into bins, and the guides sequenced, reading off how silencing each element
shifted expression. 30 genes, every element within 450 kb, 3,863 distal pairs.

### The model is one multiplication

<figure>
  <video src="/assets/video/activity-by-contact.mp4" autoplay loop muted playsinline></video>
  <figcaption>Two enhancers with equal activity but different contact frequency. The one that loops to the promoter more often claims the larger share of the gene's regulation, contact breaks the tie.</figcaption>
</figure>

An enhancer's predicted effect on a gene is its **activity × contact**, divided by the same summed
over all nearby elements, i.e. its *share* of the gene's regulation. Activity is the geometric mean
of accessibility and H3K27ac; contact is normalised Hi-C frequency (approximable from averaged Hi-C
or even distance). Two enhancers, equal activity, but one contacts the promoter 3× as often, it
takes three-quarters of the regulation. That multiplication is the whole idea.

Scored against the CRISPR links (AUPRC): activity alone 0.22, contact alone 0.29, distance 0.39,
and the **full ABC model 0.65**. Neither half is sufficient; it's the product that works. And it
generalises to variants, ABC correctly linked 13 of 16 trait-associated variants to their known
target gene (81% recall vs 56% for nearest-gene), including the classic rs12740374 → SORT1 in liver.

## Paper 2, the 3D genome of real tumours (Yost et al., 2025)

Where Fulco is the principle, Yost is the template, contact data in actual tumours, including breast,
with the copy-number correction and pipeline I'll use at Curie.

<figure>
  <video src="/assets/video/yost-3d-genome.mp4" autoplay loop muted playsinline></video>
  <figcaption>A Hi-C–style contact map from a primary tumour: bright off-diagonal blocks mark DNA regions that physically touch, resolving the TADs and enhancer–gene loops that wiring depends on.</figcaption>
</figure>

They built an enhancer connectome with **H3K27ac HiChIP** (which measures activity and 3D contact at
once) across **69 primary tumours, 15 cancer types, 665,000 enhancer-anchored loops**. The breast
cohort is the deepest, 14 samples, ≥3 per molecular subtype (basal, HER2, luminal A/B), each with
matched whole-genome sequencing, RNA-seq and single-cell ATAC.

Three results I leaned on:

- **Contact is subtype-informative.** Megabase compartments and TADs are largely shared across
  cancers; it's the fine-scale 2D *loop* signal that cleanly separates cancer types and, within
  breast, basal from non-basal. Cancer-type loops are enriched for expected TF motifs, biological,
  not noise. That's the assumption my whole subtype-specific atlas rests on.
- **Most oncogenes are enhancer-driven, not copy-driven.** Across 110 oncogenes, **>70% are better
  explained by enhancer activity than by copy-number gain** (MYC by dynamic enhancer rewiring; KRAS
  one of the few copy-driven exceptions). So the gene a non-coding element controls depends on its
  *wiring*, and wiring is what contact data resolve.
- **Copy-number correction is not optional.** Amplified regions produce more reads, inflating both
  apparent activity and apparent contact, call loops naively and you'll call amplifications. Yost
  correct with ploidy-aware copy-number from matched WGS *before* clustering, using HiC-Pro and
  FitHiChIP. Doing that normalisation properly, in person, is the irreplaceable reason for the
  residency.

They even go from contact to mechanism at named loci, an ESR1 enhancer ~9 kb away whose contact
tracks ESR1 expression, and non-coding point mutations (MECOM promoter, FGFR1 enhancer) nominated by
comparing allele frequency in contact data against the genome. That's the logic of my Objectives 2–3,
demonstrated in primary tumours.

## Paper 3, SCEG-HiC (Liang et al., 2026), the engine

This is the paper that turns the first two into something I can actually run. Fulco told me contact
matters; Yost gave me the tumour contact data. But my atlas is **single-cell, scATAC-seq only**, and
neither paper tells me how to put a contact prior *inside* a single-cell enhancer-gene method.
SCEG-HiC does exactly that, and it was published this year.

<figure>
  <video src="/assets/video/sceg-hic.mp4" autoplay loop muted playsinline></video>
  <figcaption>SCEG-HiC adds a prior Hi-C contact map to noisy single-cell ATAC + RNA correlation, turning a guess into a contact-supported enhancer–gene link.</figcaption>
</figure>

The gap it fills is precise. My peak-to-gene links come from accessibility co-varying between an
enhancer and a promoter across cells. That single-cell correlation is noisy, full of **indirect
links** (an enhancer and promoter look connected only because a third element drives both), and
carries no contact information at all.

SCEG-HiC injects a Hi-C contact prior straight into single-cell linking via a **Hi-C-weighted
graphical lasso**. It estimates **partial** correlations, not raw ones, which is what removes the
indirect links, and the Hi-C prior sets a *different penalty for every enhancer-gene pair*: strong
contact gets a low penalty (the link survives), little contact gets a high penalty (the link is
shrunk to zero). It's the same activity-times-contact intuition, expressed as a statistical prior,
and crucially it runs on **scATAC-seq alone**, which is exactly my atlas.

What convinced me it's real biology, not dressed-up distance:

- **It beats the field broadly.** Across 10 datasets (human and mouse, paired and scATAC-only) vs
  >10 methods, validated against independent cell-type Hi-C and eQTLs. In CD4 T cells it reached
  AUPRC 0.683 vs Hi-C and 0.219 vs blood eQTL, top on both, with validation data independent of the
  prior.
- **It's not just distance.** The true Hi-C prior beats both no prior and a shuffled,
  distance-preserving prior. Links *gained* from the prior are strongly eQTL-enriched; links *lost*
  are few and lack functional support.
- **It does variant-to-gene in disease.** Applied to COVID-19 immune cells it recovered AP-1/C-EBP
  networks in inflammatory monocytes, and mapped the fine-mapped non-coding variant rs71327024 to
  **CCR1** (supported by monocyte Hi-C and blood eQTL) where a correlation-only method (Cicero)
  linked the wrong gene. It validated all 20 of its SNP-to-gene links against Hi-C, vs ~40% for
  Cicero.

<div class="keypoint">
<p><strong>Where it lands for me:</strong> SCEG-HiC ships with a <em>generic, bulk-average</em> Hi-C
prior. My contribution is to feed that same validated engine a <strong>subtype-specific,
copy-number-corrected breast-tumour prior</strong> built from the Yost data, which is the exact
future direction the SCEG-HiC paper itself calls for. The method exists, it's validated, and the
obvious next improvement is the thing I'm set up to provide at Curie.</p>
</div>

## How the three fit together

ABC gives the **principle**: contact is required to assign an enhancer to a gene. Yost gives the
**data**: breast tumour contact maps, copy-number-corrected and subtype-resolved. SCEG-HiC gives the
**engine**: the published method that injects a Hi-C prior into single-cell links. All three feed one
contact prior that re-scores the weakest layer of my atlas, peak-to-gene linkage, turning a
correlation into a contact-supported link. And the same links, scored for variant effect with
[AlphaGenome](/blog/alphagenome/), become the seed for the non-coding driver work in Objectives 2 and
3. Principle, data, engine, then the bridge forward.
