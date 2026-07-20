---
title: "From enhancer networks to base-resolution variant scoring"
description: "A mini journal club on three papers about non-coding regulatory variants: Wang & Hon's single-cell CRISPRi enhancer-to-gene network in breast cancer, Gerasimavicius' AlphaFold 3 structural scoring of transcription-factor binding, and Marderstein & Montgomery's FLARE, which prioritises variants across 132 cell types using chromatin deep learning plus evolutionary constraint."
date: 2026-07-17
heroKicker: "Mini Journal Club · Non-coding variants"
readingTime: "13 min read"
tags: ["Enhancers", "CRISPRi", "Perturb-seq", "AlphaFold 3", "ChromBPNet", "Evolutionary constraint", "Breast cancer", "Non-coding variants"]
papers:
  - title: "Enhancer regulatory networks globally connect non-coding breast cancer loci to cancer genes"
    authors: "Wang, Armendariz, Wang, Zhao, Xie & Hon"
    venue: "Genome Biology"
    year: 2025
    url: "https://doi.org/10.1186/s13059-025-03474-0"
  - title: "A structure-guided approach to noncoding variant evaluation for transcription factor binding using AlphaFold 3"
    authors: "Gerasimavicius, Biddie & Marsh"
    venue: "Nucleic Acids Research"
    year: 2026
    url: "https://doi.org/10.1093/nar/gkaf1417"
  - title: "Decoding common and rare noncoding variant effects across cellular and developmental contexts (FLARE)"
    authors: "Marderstein, Montgomery et al."
    venue: "Nature Genetics"
    year: 2026
    url: "https://doi.org/10.1038/s41588-026-02619-6"
---

I picked these three together because they come at the same problem from three directions. The
question underneath all of them is the one my PhD lives on: of the thousands of non-coding variants
we can point at, *which ones actually matter, and how*? Paper one is **functional**: it finds the
enhancers and the genes they control. Paper two is **structural**: it asks, at a single base,
whether a variant changes transcription-factor binding. Paper three is **predictive**: it scales a
chromatin model across 132 cell types and adds evolutionary constraint to prioritise variants
genome-wide. Find the elements, score a variant, then prioritise across the whole genome.

## Paper 1, the enhancer network (Wang & Hon, 2025)

GWAS and whole-genome sequencing have linked thousands of non-coding variants and enhancers to
breast cancer, but almost none have been functionally characterised, so we don't know how most of
them contribute to the disease. Two things make it hard. Assigning an enhancer to its target gene
isn't obvious. It's often **not the nearest gene**. And enhancers can act *indirectly*: an enhancer
changes a transcription factor, and it's that factor, acting on a distant gene, that produces the
effect.

So Wang and Hon do the functional experiment at scale. They took **3,513 regulatory elements**
(2,123 putative enhancers, 1,390 promoters) associated with breast cancer, chosen from PCAWG
somatic mutations (kept if mutated in ≥2 of 123 patients) and a GWAS meta-analysis (4,452 variants
across 142 loci), filtered to open chromatin with an H3K27ac signal. They switched each element off
with **dCas9-KRAB CRISPRi** in an ER-positive and an ER-negative line, and read the transcriptome in
**over 500,000 single cells** (Perturb-seq), reaching ~80% repression and ~1,000 cells per element.

To assign targets they wrote **pySpade**, which compares perturbed against unperturbed cells with a
random-sampling background correction (guides aren't evenly distributed across cell states, which
would otherwise manufacture false positives). In the ER-positive cells, 147 elements had a direct
target within 2 Mb (including the cancer genes **BRCA2** and **MUC1**) and the somatic variants
were enriched in **MTF1** and **TP53** motifs. One clean example: a patient somatic variant in the
**CITED4** enhancer disrupts a putative MYC binding site.

### The network, and the motif that stuck with me

Including indirect targets, the numbers explode: **25,287 enhancer-gene pairs** forming a
genome-wide regulatory network, spanning all chromosomes, with the median enhancer wired to about
nine genes. Within it they describe two recurring shapes: *one-to-multiple* (one enhancer, several
genes in a pathway, e.g. through PDS5B into the DREAM cell-cycle programme) and *multiple-to-one*,
where several enhancers converge on the same gene.

<figure>
  <video src="/assets/video/enhancer-networks.mp4" autoplay loop muted playsinline></video>
  <figcaption>The multiple-to-one motif: three enhancers on three different chromosomes each reach TP53 indirectly, each through its own local target gene. A non-coding driver doesn't have to sit next to the gene it affects.</figcaption>
</figure>

Their headline example is **TP53**: three enhancers on different chromosomes each reach it
indirectly, and they validated two by qPCR: a chromosome 17 enhancer acting through MED1, and a
chromosome 6 enhancer acting through SERAC1. Finally, they repeated the whole screen in the
ER-negative line and found **~72% of enhancers are subtype-specific**, with distinct networks.

<div class="keypoint">
<p><strong>What it changes for me:</strong> a candidate non-coding driver doesn't have to sit next to
the gene it affects, so validation needs a <em>transcriptome-wide</em> read-out, not just the
nearest gene. And a breast regulatory map has to be built <em>subtype by subtype</em>, because most
of the wiring isn't shared. pySpade (direct <em>and</em> indirect targets with a proper background
correction) is a tool I could run directly on my own Perturb-seq validation data.</p>
</div>

## Paper 2, structure scores the variant (Gerasimavicius, Biddie & Marsh, 2026)

Non-coding SNVs that change transcription-factor binding can shift gene expression and cause disease.
We already have good *sequence*-based predictors (position weight matrices, deltaSVM, DeepSEA), but
they depend on training data and carry TF-specific biases. Structure could add a **mechanism** rather
than just a score, but until recently there were almost no TF–DNA structures to work from.
**AlphaFold 3** changes that: it can model protein–DNA complexes.

So the question is whether AF3 structures can recapitulate *measured* allele binding preferences.
They built **75,134 AF3 complex models** (reference and alternative allele for every SNP pair)
across six transcription factors (SPIB, ETV4, ELK3, SF-1, PAX5, MEIS2), benchmarked against
**SNP-SELEX**, an in-vitro assay that labels each SNP pair as preferentially bound or not. Each model
is a single TF docked onto a 40-bp DNA duplex, scored five ways: two FoldX physics energies, a DNA
solvent-accessibility term, and the one that matters most: **ΔipTM**.

<figure>
  <video src="/assets/video/af3-tf-binding.mp4" autoplay loop muted playsinline></video>
  <figcaption>ipTM is AlphaFold's own confidence in how the subunits are placed; ΔipTM is how much that confidence shifts between the reference and alternative allele. A single base changes the predicted fit, and that shift, a by-product of the deep-learning model, outperforms the physics-based FoldX energies.</figcaption>
</figure>

All three main metrics separate the SNP-SELEX groups, and **ΔipTM gives the cleanest separation**:
AUC **0.685** for *detection* (is there any binding difference?) and **0.792** for *direction* (which
allele wins?). So it's better at calling the winner than at calling that a difference exists at all.
Strikingly, ΔipTM, really a by-product of the model's confidence, beats the physics-based FoldX
energies, and it stays informative even when models fall below the usual 0.6 ipTM threshold.

The honest limits: it **works for some TFs, not others**. Good for the ETS family (SPIB, ELK3) and
SF-1, and a consensus of metrics recapitulated several clinical variants (two NKX2-5 variants, a
GATA3 variant at the neuroblastoma LMO1 locus, a USF2A variant). It **breaks** for PAX5 and MEIS2,
which bind cooperatively or through multiple domains but were modelled as monomers, and it called a
PAX6 enhancer variant in the wrong direction. Where good training data exist, deltaSVM is still more
accurate. The authors' own framing: a **proof of concept** (training-free, mechanistic, visual), but
post-hoc structural support, not a genome-wide predictor. And across the board, a *consensus* of
metrics beats any single one.

## Paper 3, prioritising at genome scale (Marderstein & Montgomery, 2026)

Disease risk keeps mapping to the non-coding genome, but a variant's effect depends entirely on
*which cell type* and *which developmental stage* you look at, and we have no regulatory code to read
non-coding variation the way we read the genetic code for proteins. Marderstein and Montgomery ask
whether a deep-learning chromatin model can predict variant effects across all those contexts, and
whether evolutionary constraint can tell us which of them matter.

They took **ChromBPNet** (a convolutional network that predicts chromatin accessibility base by base
from DNA sequence) and trained it across single-cell ATAC-seq from **132 fetal and adult brain and
heart cell types**, then predicted the effects of **22 million variants** per cell type. Then the
prioritiser: **FLARE** combines those predicted effects with base-level evolutionary constraint
(**phyloP**), flagging variants with an unusually large regulatory effect *for how constrained their
site is*.

<figure>
  <video src="/assets/video/flare-prioritization.mp4" autoplay loop muted playsinline></video>
  <figcaption>FLARE places each variant by predicted regulatory effect (ChromBPNet) against evolutionary constraint (phyloP). The variants that are both large-effect and constrained (the top-right) rise to the top as prioritised candidates.</figcaption>
</figure>

The findings hang together nicely. Large-effect variants in the fetal brain tend to be **rare and
constrained**: evolution has been selecting against them. Rare variants act across *many* cell
types; common ones are more cell-type-specific. Run on de novo mutations, FLARE's top calls were
enriched in disease cases: **14 of the 16 top-scoring mutations were in cases, not controls**
(autism, congenital heart disease), and the common variants it prioritised were enriched for
schizophrenia heritability. So the same framework works across rare *and* common disease genetics.
The honest limits: these are predictions that still need experimental validation, the models are
brain and heart only, and they don't yet capture splicing or transcript stability.

<div class="keypoint">
<p><strong>Why it's basically my thesis, in another tissue:</strong> a cell-type-specific chromatin
model plus evolutionary constraint, used to prioritise non-coding variants. FLARE is a clean template
for the prioritisation score I'm building; phyloP is an easy orthogonal feature; and ChromBPNet
could be applied directly to breast single-cell ATAC-seq for a subtype-specific variant-effect model.
The caveat is honest (this is germline brain and heart, not somatic breast), so I take the
<em>framework</em>, not the result. Usefully, the authors say outright that non-coding somatic
mutations remain underexplored in cancer, which is exactly the gap I'm working in.</p>
</div>

## How the three fit together

Wang and Hon give the **elements**: which enhancers control which cancer genes, directly and
indirectly, resolved by subtype. Gerasimavicius gives a **base-resolution reading** of whether a
single variant in one of those elements changes transcription-factor binding, with a mechanism you
can look at. Marderstein and Montgomery give the **prioritisation engine**: a chromatin deep-learning
model plus evolutionary constraint that scales across cell types and separates the variants that
matter from the ones that don't. Elements, mechanism, prioritisation: every one of them lands on
a different objective of the breast-specific, non-coding driver map I'm building.
