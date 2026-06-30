---
title: "Two ways to learn regulatory grammar: personal genomes vs MPRAs"
description: "A mini journal club on Variformer and PARM, fine-tuning Enformer on personal genomes versus training a lightweight CNN on millions of MPRA fragments, and what each says about whether deep learning has actually learned the grammar of gene regulation."
date: 2026-06-10
heroKicker: "Mini Journal Club · Regulatory deep learning"
readingTime: "11 min read"
tags: ["MPRA", "Deep learning", "Enformer", "Promoters", "Personal genomes", "Regulatory grammar"]
papers:
  - title: "Deep-learning prediction of gene expression from personal genomes (Variformer)"
    authors: "Drusinsky, Whalen & Pollard"
    venue: "Genome Biology"
    year: 2026
    url: "https://link.springer.com/article/10.1186/s13059-025-03926-7"
  - title: "Regulatory grammar in human promoters uncovered by MPRA-based deep learning (PARM)"
    authors: "Barbadilla-Martínez, Klaassen, Franceschini-Santos et al."
    venue: "Nature"
    year: 2026
    url: "https://www.nature.com/articles/s41586-025-10093-z"
---

Both of these papers ask whether deep-learning models have really learned the *grammar* of gene
regulation, the rules that map a DNA sequence to how strongly it drives transcription, or whether
they've just memorised loci. They answer it from opposite directions: one fine-tunes a giant model
on **personal genomes**, the other trains a tiny model on **millions of experimental measurements**.
The contrast is the whole point, and it's directly relevant to whether models like the ones I build
can be trusted on non-coding variants they've never seen.

## Paper 1, Variformer: can Enformer read personal genomes?

The problem Drusinsky and colleagues target is real and under-appreciated. Models like Enformer are
trained on *reference* genomes, they've never seen genetic variation at a locus during training, so
they're poor at predicting expression *differences between individuals*. Linear models (elastic nets)
can do that, but they ignore sequence context and rare variants.

**Variformer** fine-tunes Enformer on personal genomes plus matched GTEx expression (n=670),
swapping the output head to predict scalar gene expression and adding a cross-individual pairwise
loss term. About 30 min per gene on one GPU.

<figure>
  <video src="/assets/video/variformer.mp4" autoplay loop muted playsinline></video>
  <figcaption>Fine-tuning Enformer on personal genomes lifts variant-direction agreement from 60% to 97%, but it still fails to generalise to genes it never saw in training.</figcaption>
</figure>

The results are a clean two-sided story:

- **On genes it was trained on, evaluated on unseen people, it works**, matching elastic nets and
  approaching the cis-heritability ceiling (mean R² difference ~2.2%). Fine-tuning fixes Enformer's
  cross-individual blindness.
- **But it does not generalise to unseen genes.** Multi-gene training (up to 11,000 genes), longer
  sequences (196 kb), monitoring held-out genes during training, none of it helps. It shares the
  elastic net's limitation: good at seen loci, poor at new ones.

What it *does* gain is the bit I care about: **97.4% sign agreement** on variant effect direction
(up from 60.2% for Enformer) and better fine-mapped eQTL prediction (auROC 0.737 vs 0.611), while
keeping Enformer's enrichment of high-scoring variants in active enhancers and promoters.

<div class="keypoint">
<p><strong>Why this stings (in a useful way):</strong> my Objective 3 is ML prioritisation of
non-coding driver candidates, at loci the model may never have seen in training. Variformer is a
clear, honest demonstration that fixing cross-individual prediction does <em>not</em> buy you
generalisable regulatory grammar. That gap is the open problem I have to design around, not assume
away.</p>
</div>

## Paper 2, PARM: grammar from MPRAs, not epigenomes

PARM comes at it from the other side. Instead of a 30M-parameter model trained on epigenomic tracks,
it's a **742K-parameter CNN** trained on a massively parallel reporter assay (MPRA): ~10 million
random genomic fragments (88–600 bp) tested for *autonomous* promoter activity, each genome position
covered by ~240 overlapping fragments on average.

<figure>
  <video src="/assets/video/mpra-grammar.mp4" autoplay loop muted playsinline></video>
  <figcaption>An MPRA in one loop: millions of DNA fragments each drive a reporter; the measured activity becomes the label a model learns the sequence grammar from, causal, not correlative.</figcaption>
</figure>

Because fragments are tested in isolation, activity is assigned **causally** to the sequence, not
correlated to it. That's the key epistemic upgrade over epigenome-trained models. PARM predicts
held-out promoter activity at R = 0.92 in K562, and three results show it learned real grammar:

- **It designs synthetic promoters.** A genetic algorithm guided by PARM evolves random sequence into
  promoters as strong as the strongest natural human ones, with *no BLAST similarity* to the human
  genome, by recombining de novo-learned motifs (FOS-JUN, ETS, CREB).
- **It finds cell-type-specific TF logic.** In-silico saturation mutagenesis of all 30,607 promoters
  finds regulatory sites where **96.5% match known TF motifs** despite no TF knowledge given,
  HNF4A restricted to liver, GATA to blood, and it captures stimulus responses (heat shock → HSF1;
  nutlin-3a → TP53 up, E2F down).
- **It learns positional grammar.** Activating sites peak at −50 bp from the TSS; repressive sites
  spread downstream. Confirmed experimentally, YY1 activates downstream, SP1/NRF1/NFYA repress when
  placed at/after the TSS.

The honest limitation: PARM models *isolated promoters*, no distal enhancers, insulators or
chromatin context.

## What the pairing taught me

Put side by side, they map the trade-off I live with. Variformer shows that scaling a powerful model
onto personal genomes still doesn't yield transferable grammar. PARM shows that a *small* model on
the right *causal* functional data can recover genuine, interpretable grammar, but only for the
narrow element type it was trained on. The lesson for my work isn't "pick a side"; it's that the
training signal matters more than model size, and that MPRA-style causal data is probably how I make
a driver-prioritisation model that generalises rather than memorises. Causal functional readouts are
also exactly what Objective 4 (validation) is meant to generate, so this is a method I want to build
toward, not just cite.
