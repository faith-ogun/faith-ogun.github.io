---
title: "Selection isn't causation: using patient age to find real cancer drivers"
description: "A journal club on Cheek et al., why a mutation under positive selection in normal tissue isn't necessarily a cancer driver, and how patient age can separate the two without any normal-tissue data."
date: 2026-06-04
heroKicker: "Journal Club · Cancer evolution"
readingTime: "10 min read"
tags: ["Cancer drivers", "Positive selection", "Clonal evolution", "Patient age", "Breast cancer"]
papers:
  - title: "Age distinguishes selection from causation in cancer genomes"
    authors: "Cheek, Blohmer, Nowak, Antal & Naxerova"
    venue: "Nature Genetics"
    year: 2026
    url: "https://www.nature.com/articles/s41588-026-02593-z"
---

This paper quietly undermines an assumption I'd been building on, which is exactly why I wanted to
present it. The standard way we call cancer drivers, finding mutations more frequent than expected
and inferring positive selection (dN/dS, MutSigCV, OncodriveFML), conflates two different things.
Cheek and colleagues show that *selection* and *causation* are not the same, and then give a
surprisingly cheap way to tell them apart: **patient age**.

## The NOTCH1 problem

Positive selection is everywhere in *normal* ageing tissue, skin, oesophagus, blood, colon all
carry clonally expanding mutations without becoming cancer. Because tumours arise from cells already
sitting in expanded clones, those normal-tissue mutations show up enriched in cancer genomes too.

The cleanest cautionary tale is **NOTCH1** in oesophageal cancer. It's strongly selected in
oesophageal squamous cell carcinoma, and classified as a driver, yet it's *even more* frequently
mutated in **normal** oesophagus, and mouse experiments show NOTCH1 mutations actively *inhibit*
tumour growth. A "driver" that isn't one. The obvious worry: how many others are wrong?

## The carcinogenic effect

Their fix is to define the quantity we actually care about, a **carcinogenic effect** `w = r₁/r₀`:
the rate at which a cell *with* the mutation initiates cancer over the rate *without* it. Estimated
as an odds ratio comparing mutation frequency among cancer founder cells (y) versus normal tissue
cells (x). `w ≫ 1` is a strong driver; `w ≈ 1` is no carcinogenic effect; `w < 1` is
cancer-*inhibiting* (hello, NOTCH1).

Applied with normal-tissue data, the spread is enormous: in AML, carcinogenic effects span five
orders of magnitude. DNMT3A/TET2/ASXL1 (the classic clonal-haematopoiesis genes) have *weak*
carcinogenic effects (~10) despite strong selection, while NPM1, FLT3 and IDH2 confer 800–10,000×.
Selection signal and carcinogenic potency are genuinely different axes.

## The clever bit: age, when you have no normal tissue

You rarely have matched normal-tissue mutation frequencies. So they ask whether **patient age** can
substitute, and the logic is elegant:

- A mutation that's positively selected in normal tissue but **not** carcinogenic just accumulates
  with age, so it shows up in **older** patients.
- A **potent** cancer-causing mutation accelerates onset, so it shows up in **younger** patients.

<figure>
  <video src="/assets/video/age-selection.mp4" autoplay loop muted playsinline></video>
  <figcaption>Two mutations can be equally enriched in cancer genomes yet differ in the mean age of the patients who carry them, selection drifts older, strong causation skews younger.</figcaption>
</figure>

Crucially, enrichment alone can't separate the two (both raise frequency in cancers), but the **age
distribution** can. They validate it: across young vs old AML, carcinogenic *effects* correlate
(ρ = 0.72) while raw *frequencies* don't (ρ = 0.12), and across tissues, stronger carcinogenic
effects sit at younger mean ages (colorectal ρ = −0.65). Different mechanisms hitting the same
tumour suppressor (deletions vs point mutations) agree on age bias too, a nice internal check.

## What it says about breast cancer

In **breast invasive carcinoma** (1,562 samples), **GATA3** and **TP53** show significant
young-age bias, strong carcinogenic effect. **PIK3CA** does *not*, despite its high prevalence,
hinting its carcinogenic effect may be weaker than its frequency implies, which uncomfortably aligns
with the disappointing track record of anti-PI3K therapy. (The honest caveat: failing the age test
doesn't prove PIK3CA isn't a driver, only that this test can't detect the signal.)

<div class="keypoint">
<p><strong>Where it lands for me:</strong> my Objective 2 plan, mutation-rate-adjusted recurrence,
genuinely cannot distinguish a cancer-causing non-coding hotspot from normal breast-tissue clonal
selection. Adding an <strong>age-bias statistic</strong> as a secondary test is a near-free fix:
young-age bias supports causation, old-age bias flags possible normal-tissue selection. And patient
age is a portable, no-cost <strong>ML feature</strong> for Objective 3, an independent line of
evidence beyond conservation, chromatin context and motif disruption.</p>
</div>

## My take

The framework is a scalar simplification, it collapses multi-stage carcinogenesis, epistasis and
temporal dynamics, and the branching-process model is, in the authors' own words, "a cartoon" for
tissues like breast. It's also built entirely on protein-coding mutations; extending it to the
non-coding genome is *not* done here. But that's precisely the opening. The conceptual correction,
selection ≠ causation, applies just as forcefully to non-coding drivers, where our null models are
even shakier. Borrowing the age-bias idea for non-coding hotspot calling is one of the most concrete,
low-cost things I took from any paper this year. It also adds justification for the CRISPRi
validation in my Objective 4: sometimes intervention is the only way to break the selection-vs-causation
tie.
