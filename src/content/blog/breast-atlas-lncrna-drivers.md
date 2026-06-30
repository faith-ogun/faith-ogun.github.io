---
title: "From healthy breast to lncRNA drivers: two papers, two ends of my thesis"
description: "A mini journal club on the Human Breast Cell Atlas and a pan-cancer screen for driver mutations in long non-coding RNAs, how a single-cell reference and 12,631 tumour genomes bracket the exact problem my PhD sits in."
date: 2026-06-17
heroKicker: "Mini Journal Club · Breast cancer genomics"
readingTime: "12 min read"
tags: ["Single-cell atlas", "Breast cancer", "lncRNA", "Non-coding drivers", "BRCA1/2"]
papers:
  - title: "A single-cell atlas enables mapping of homeostatic cellular shifts in the adult human breast"
    authors: "Reed et al."
    venue: "Nature Genetics"
    year: 2024
    url: "https://www.nature.com/articles/s41588-024-01688-9"
  - title: "Pan-cancer discovery of driver mutations in long noncoding RNAs reveals widespread functional rewiring of RNA regulatory elements"
    authors: "Ramnarayanan, Koya et al. (Johnson lab)"
    venue: "bioRxiv"
    year: 2026
    url: "https://www.biorxiv.org/content/10.64898/2026.06.10.730876v1"
---

I paired these two papers for a reason: they sit at the two ends of my own project. One maps what
the *healthy* breast is made of, cell type by cell type. The other hunts for non-coding **driver
mutations** at population scale, which is the core of my thesis. Read together, they bracket the
exact gap I'm trying to fill: you need a good description of normal before you can say how a tumour
diverged, and you need a powered way to find the mutations that pushed it there.

## Paper 1, a single-cell reference for the healthy breast

Breast cancer is heterogeneous, and mutations alone don't explain that heterogeneity. The cell a
tumour starts from, and the state of the tissue around it, matter too. So before you can model
divergence, you need normal mapped properly.

Reed and colleagues built the **Human Breast Cell Atlas** from 55 donors, women who'd had a
reduction mammoplasty, or a risk-reducing mastectomy because they carried a **BRCA1/2** mutation.
After QC they kept **801,360 single cells**, grouped into **41 subclusters** across the epithelial,
stromal and immune compartments. That scale is the point: it's a reference, not a snapshot.

<figure>
  <video src="/assets/video/single-cell-atlas.mp4" autoplay loop muted playsinline></video>
  <figcaption>The premise of a single-cell atlas: dissociate the tissue, profile every cell's transcriptome, then resolve the population into cell-type clusters.</figcaption>
</figure>

Three findings stuck with me:

- **Age and parity leave a fingerprint.** Using only the 22 average-risk donors (to avoid BRCA
  confounding) and a differential-abundance test (Milo), they show age shifts the luminal-progenitor
  subclusters and drives "lineage infidelity", cells losing their canonical markers. Several
  epithelial changes go in *opposite* directions for age versus parity, which is striking because
  age and parity also have opposing effects on breast cancer risk.
- **BRCA carriers show an immune shift, but an exhausted one.** High-risk tissue has more immune
  cells (a ~2-fold enrichment of a pro-inflammatory CD8 TC1 subset in BRCA1 carriers), yet those
  cells carry an exhaustion signature: PD1, PDL1, LAG3, TIGIT, HAVCR2.
- **The headline:** that exhaustion signature appears in tissue with *no tumour in it*, validated by
  immunohistochemistry. Immune escape may begin during initiation, in histologically normal tissue.

<div class="keypoint">
<p><strong>Where it lands for me:</strong> this is a cell-type scaffold for my Objective 1, building
a subtype-resolved map of breast regulatory regions. It gives me 41 annotated subclusters and a
healthy baseline to interpret which cell state a candidate regulatory element belongs to. The honest
caveat: it's RNA-seq, not chromatin accessibility, so it tells me how to <em>define</em> cell types,
not where the regulatory elements <em>are</em>.</p>
</div>

## Paper 2, finding driver lncRNAs in 12,631 genomes

This one is much closer to the centre of my thesis. Over **90% of somatic mutations in cancer fall
outside protein-coding genes**, and long non-coding RNAs are a large, poorly understood class of
those non-coding genes. The problem is power: finding driver lncRNAs needs enormous cohorts.

The Johnson lab analysed **12,631 whole tumour genomes** from the 100,000 Genomes Project and found
**121 driver lncRNAs** under positive selection across 19 cancer types, roughly **two-thirds of
tumours carry at least one**. Earlier efforts like PCAWG had fewer than 3,000 genomes and were
underpowered; here, 13 cancer types are powered to detect lncRNAs mutated 5% above background.

<figure>
  <video src="/assets/video/lncrna-drivers.mp4" autoplay loop muted playsinline></video>
  <figcaption>Across thousands of tumour genomes, mutations recurring at the <em>same</em> lncRNA position signal positive selection; many disrupt an RNA-binding-protein site and release the oncogenic lncRNA.</figcaption>
</figure>

The method matters for me because I want to reuse it. They test for two signatures of positive
selection, excess mutational burden and functional impact in lncRNA exons, correcting for local
trinucleotide mutation rate, gene length and mutational signatures. The novelty is engineering: a
rebuilt pipeline (ExInAtorPS) that runs **~276× faster**, finishing the whole pan-cancer analysis
in ~31 minutes. And they validate before trusting it, recovering known coding drivers at
67–80% precision, an empirical FDR of 0.6%, and 4.6-fold enrichment for known cancer lncRNAs.

**Breast cancer had the most driver lncRNAs of any type, 27 of them.** The most recurrent is
SNHG14 (mutated in ~35% of tumours), then NEAT1 and MALAT1. Recurrence at the *same positions* is
one of the cleanest signatures of selection.

### What the mutations actually hit

An element-level pipeline (ExInAtorEL) shows the mutations concentrate in conserved RNA secondary
structures, RNA-binding-protein (RBP) sites, and conserved sequence elements. Then the part most
relevant to me: a convolutional neural network (Pysster) predicts how each mutation changes RBP
binding affinity. Most mutations reduce binding, and they cluster in the core recognition motif.

The proposed mechanism is elegant: in healthy cells, RBPs bind and *repress* these oncogenic
lncRNAs; driver mutations disrupt that interaction and release the lncRNA. Their worked example is
MALAT1 and FTO (an m6A demethylase), a breast-tumour mutation reduces FTO binding, MALAT1 rises,
and m6A on MALAT1 goes up. A somatic genome change wired straight into the epitranscriptome.

> The deeper idea: a large enough tumour-genome cohort can be used like a high-resolution
> mutagenesis screen that maps the functional sites inside a non-coding gene.

<div class="keypoint">
<p><strong>Where it lands for me:</strong> this is a working blueprint for my Objectives 2–4. Their
trinucleotide background correction and recurrence test are methods I can adopt directly for
breast-specific hotspot calling (Objective 2). The neural-net binding-change score is exactly the
kind of per-variant feature I want for ML prioritisation (Objective 3). And their wet-lab loop,
RNA-structure probing, RBP knockdown, RNA-seq, is a template for validation (Objective 4).</p>
</div>

## Why I read them together

The atlas tells me what the healthy breast *is*; the lncRNA screen shows how to find what *breaks*
it, at scale, in the non-coding genome. My contribution is the join: a breast-specific driver search
that's aware of the subtype-resolved regulatory regions I'm mapping in Objective 1, so a candidate
non-coding mutation isn't just "recurrent", it's recurrent *in an element that's actually active in
the right cell state*. That's the difference between a statistical hit and a mechanistic hypothesis.
