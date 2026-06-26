---
title: "AlphaGenome: one model to read the regulatory genome"
description: "A critical read of DeepMind's AlphaGenome, a unified sequence-to-function model that predicts 11 regulatory modalities across a 1 Mb window, and what it means for non-coding variant interpretation in cancer."
date: 2026-02-09
heroKicker: "Journal Club · Regulatory deep learning"
readingTime: "11 min read"
tags: ["AlphaGenome", "Deep learning", "Non-coding variants", "Gene regulation", "Foundation models"]
papers:
  - title: "Advancing regulatory variant effect prediction with AlphaGenome"
    authors: "Avsec, Latysheva, Cheng et al."
    venue: "Nature"
    year: 2026
    url: "https://www.nature.com/articles/s41586-025-10014-0"
---

Most of the genome doesn't code for proteins, and almost every common disease variant lives out
there in the non-coding 98%. The hard part of my PhD isn't finding those variants, it's working
out what they *do*. So when a single model claims it can read a megabase of DNA and predict
splicing, expression, chromatin and 3D contacts all at once, it lands right on the question I care
about most. This is my journal-club read of **AlphaGenome**, and why I think it changes the
baseline for non-coding variant interpretation.

## The two trade-offs it sets out to break

Before AlphaGenome, sequence-to-function models forced you to pick a side of two trade-offs.

The first is **context length versus resolution**. Short-context models can be base-pair precise
but they can't see a distal enhancer sitting 500 kb away. Long-context models can see the
enhancer but predict in coarse bins, smearing out exactly the single-base effects that matter for
splicing. The second is **specialisation versus breadth**. A model trained on one assay can be
excellent at that assay and completely blind to a variant's effect in another modality.

AlphaGenome's design goal is to refuse the choice, to be long-context *and* high-resolution,
generalist *and* competitive with specialists. That framing is what makes it worth a careful read
rather than a benchmark-table skim.

## What it actually is

At a glance: it takes a **1 Mb DNA window** and predicts **11 modalities**, 5,930 human tracks
and 1,128 mouse tracks, at base resolution where it needs to be, including 2D outputs for
chromatin contact maps. The architecture is a U-Net-like backbone: convolutions pick up local
sequence grammar, transformers carry long-range enhancer–promoter dependencies, and the model
keeps both 1D sequence embeddings and 2D pairwise embeddings so it can emit Hi-C-style contacts.

The training is a two-stage trick worth understanding, because it's the part most relevant to
anyone who wants to *use* a model like this at scale.

<figure>
  <video src="/assets/video/alphagenome-modalities.mp4" autoplay loop muted playsinline></video>
  <figcaption>One 1 Mb sequence in, eleven regulatory modalities out, expression, chromatin, splicing and 3D contact maps from a shared backbone.</figcaption>
</figure>

Stage one is **pretraining** on observed genomic tracks, under 4-fold genomic splits so they can
measure generalisation to unseen intervals. Stage two is **distillation**: a single student model
learns from an ensemble of teachers on augmented and mutated sequences. That second stage is the
quietly important one, it keeps ensemble-like accuracy while collapsing everything into one model
you can call once per variant. If you've ever tried to scan millions of variants through an
ensemble, you know why that matters.

<div class="keypoint">
<p><strong>Why I care:</strong> my work is about ranking and mechanistically explaining non-coding
driver candidates in breast cancer. A single distilled model that scores a variant across
splicing, expression and chromatin in one pass is exactly the kind of engine that makes
genome-wide scanning tractable.</p>
</div>

## The scoreboard, read sceptically

The headline numbers are genuinely strong: state-of-the-art on **22 of 24** genome-track tasks and
**25 of 26** variant-effect tasks. But a generalist winning broadly can hide weak spots by
averaging over easy benchmarks, so the parts I find more convincing are the places it beats
*specialists* on their home turf.

- **Splicing.** AlphaGenome models splicing at three levels, splice-site probability, splice-site
  usage under competition, and explicit donor–acceptor junction formation, and predicts all three
  plus RNA-seq coverage together. The splice-junction head is the novel piece: most predictors
  score donors and acceptors independently, while AlphaGenome models the *pairing*. It reaches
  state-of-the-art on six of seven splicing-variant tasks. The one loss (MFASS, narrowly behind
  Pangolin) is worth noting precisely because the authors don't hide it.
- **Expression / eQTLs.** It improves tissue-weighted sign prediction over Borzoi and stays useful
  across distance bins, though, honestly, distal variants are still hard, which the paper admits.
- **Chromatin contacts.** This is where it's unusual. Its 2D pair representations let it predict
  Hi-C / Micro-C-style maps directly, and it beats Orca especially on *cell-type differences*,
  the differences that actually carry regulatory meaning.

The **TAL1 case study** is the one that sold me on the "interpret modalities jointly" claim: the
model predicts variant-linked accessibility, expression and chromatin-mark changes consistent with
neo-enhancer activation, and in-silico mutagenesis points at the motif-level positions driving it.
That's not just prediction, it's a mechanistic hypothesis you could take to the bench.

## The ablations are the honest bit

I always read the ablations first now, because they tell you whether the design choices are real or
cosmetic. Two results stand out. **Base-pair target resolution** matters specifically for splicing
and barely for coarse assays, so the "high resolution where needed" claim is earned, not
decorative. And **longer context helps**: training and inference at 1 Mb is best overall. Removing
modalities degrades many downstream variant tasks, which supports the whole multimodal premise,
though the gains concentrate early (expression and accessibility) with diminishing returns as you
pile on more.

## Where it stops, and why that's the interesting part for a PhD

The authors are refreshingly explicit about limits, and the limits map almost perfectly onto open
problems I could work on:

- **Distal regulation beyond ~100 kb** is still difficult. A lot of cancer enhancer hijacking lives
  exactly in that hard zone.
- **Tissue- and condition-specific effects** aren't fully captured, and cancer *is* a
  condition-specific rewiring of regulation.
- Training is still **biased toward protein-coding genes**, with thin non-coding-gene coverage.
- It's benchmarked on reference genomes, **not personal genomes**, and it predicts molecular
  consequences, **not phenotype or disease outcome**.

That last point is the one I keep coming back to. AlphaGenome is a phenomenal *hypothesis-generation
engine*, variant prioritisation plus mechanism, but the jump from "this variant changes
accessibility" to "this variant drives this tumour" is still ours to make. That gap is where
integrative work, conservation priors, and disease-specific data have to come in, and it's a large
part of how I think about my own objective: not replacing models like this, but wrapping them in
the cancer-specific context they're missing.

## My one-line take

AlphaGenome narrows two trade-offs that have shaped regulatory genomics for a decade, and it does
it convincingly enough that I now treat it as a baseline to beat rather than a tool to admire. The
splice-junction head and the distillation strategy are the contributions I expect to age well. The
limitations aren't footnotes, they're a roadmap, and a flattering amount of that roadmap overlaps
with the questions I get to spend my PhD on.
