---
title: "The model is the horse. The second brain is the harness."
description: "Since the Claude Science AMA the same question keeps arriving, and it is not about the hackathon: how did you actually build the PhD brain? So I open sourced it. It is a folder of markdown files organised so an agent can find its way around without being told twice, and three ideas do all the work."
date: 2026-08-27
category: workbench
heroKicker: "Workbench · Agent harnesses"
readingTime: "12 min read"
tags: ["Agent harness", "Context engineering", "Claude Code", "Obsidian", "Markdown", "Knowledge management", "Open source", "PhD workflow"]
---

Since the [Claude Science AMA](https://www.anthropic.com/webinars/claude-science-ama-how-to-accelerate-scientific-discovery)
last week, the same question keeps landing in my DMs, and it is not the one I expected. Not about
NCypher, not about the hackathon. It is about the folder in the background: *how did you actually
build the PhD brain?*

So I have open sourced it. It lives at
[github.com/faith-ogun/second-brain](https://github.com/faith-ogun/second-brain). Public, MIT, take
whatever is useful and throw away the rest.

The first thing to say is the disappointing thing. **It is not an app.** There is no database, no
embedding pipeline, no RAG service, nothing to sign up to. It is a folder of markdown files on my
own disk, organised so that an agent can work out where anything belongs without being told twice,
plus a small set of written rules that say how to behave. That is the whole system. The intelligence
lives in the conventions, not the infrastructure.

Three ideas do all the work, and the rest of this post is really just those three ideas argued
properly.

## A model that knows everything, and nothing about you

A language model knows a great deal about the world and nothing about me. It does not know what I am
working on, what I decided last Tuesday, or which of my files matters. Every conversation starts
from zero and I spend the first ten minutes re-explaining my own life to something that will forget
it the moment I close the window.

The usual fix is to paste more context in. That works, and it does not compound. You do it again
tomorrow, and the day after, and at no point does the tenth conversation start from a better place
than the first. That is not a memory, it is a treadmill.

The other fix is to give the model a **place to remember**. Not a longer prompt: a location on disk
it can read from and write back to, with enough structure that it can find things on its own. Once
that place exists, every session leaves it slightly better than it found it, and the compounding
starts.

## Three kinds of memory, and a filesystem that is all three

The framing I use here comes from **Sean Chen**, whose talks on agent harnesses are the clearest
explanation of this I have found. His point is that an agent which is useful over weeks rather than
minutes needs three genuinely different kinds of memory, and that naming them separately is what
lets you build for each one:

| Memory | What it holds | Where it lives |
|---|---|---|
| **Procedural** | how the agent should behave | `CLAUDE.md`, `_meta/`, `99_Templates/` |
| **Semantic** | durable facts, one note per thing | `10_Research/` … `50_Side/`, `people/` |
| **Episodic** | what happened, and when | `90_Daily/`, `00_Inbox/` |

Most people reach for a vector database at exactly this point. I think that is usually the wrong
move for a personal vault, because a filesystem is already all three at once:

- **procedural memory** is a file the agent reads on the way in
- **semantic memory** is a folder of notes with real titles, which an agent can search by name
- **episodic memory** is a folder of dated files, which is already a time series

Not needing a vector store is not an aesthetic preference. For a few hundred notes, file names plus
grep plus a deliberate link structure genuinely outperform embeddings, because my titles and my
links encode *intent*, and a similarity score does not. A vector store starts winning somewhere in
the tens of thousands of documents. At 300 notes it is infrastructure you maintain for no gain.

What you get instead is a memory that is inspectable, greppable, diffable, portable, survives any
company going under, and will still open in twenty years.

<figure>
  <img src="/assets/blog/second-brain-architecture.png" alt="The loop from trigger to human approval, the vault holding procedural, semantic and episodic memory, and the Related block as the spine" />
  <figcaption>The whole system on one page: a loop that ends at a human, a vault that is all three memories, and links as the spine.</figcaption>
</figure>

## The loop always ends with a human

Every loop in the vault has the same five steps.

1. **Trigger.** Something arrives. A paper, a meeting, a result, a deadline.
2. **Retrieve.** The agent reads the rules and whatever prior notes are relevant.
3. **Work.** It does the actual job.
4. **File and link.** The output lands in the right room, with a real title, complete frontmatter,
   and a `## Related` block. The day's note records that it happened.
5. **Stop.** I read it and approve, or send it back.

<figure>
  <video src="/assets/video/second-brain-loop.mp4" autoplay loop muted playsinline></video>
  <figcaption>A paper arrives, the agent files and links it, and then it stops at me.</figcaption>
</figure>

Steps 1 to 3 save time once. **Step 4 is the only one that compounds**, because it is the step that
makes the vault worth more tomorrow than it was today. If you are going to cut a corner, do not cut
that one.

Step 5 is not optional either, and in research it is the one that actually matters. An agent doing
multi-step work needs an explicit condition that says when to stop and hand back, because a
confident wrong answer is worse than no answer at all.

<div class="keypoint">
<p><strong>Never delegate the approval node.</strong> You are the stop condition. An agent with no
stop condition is not a harness, it is a runaway horse.</p>
</div>

## Folders keep things tidy. Links do the thinking.

If I had to throw away everything in this system except one rule, I would keep this one: **every
note ends in a `## Related` block, with at least two links.**

A folder tells you where a note sits. A link tells you what it *means*. A paper filed perfectly and
connected to nothing is a paper I will never see again. It will not show up in the graph, it will
not surface while I am working nearby, and in eight months I will read it a second time without
realising I had already read it once. The same paper, linked to the result it supports and the grant
claim it threatens, arrives exactly when I need it, because I get to it from whatever I was already
thinking about.

If I genuinely cannot find two links, I link the room's Map of Content and write one line saying why
the note is isolated. That line is almost always the interesting part.

## The filing contract

This is the part people ask about second, and the answer is boring: **you write it down once**, in
`CLAUDE.md` at the vault root, and agents read it automatically on the way in. There is nothing to
configure and nothing to explain at the start of a session.

Every note gets the same four things, and once those are consistent an agent can file anything:

```markdown
---
title: "Human readable title"        # a real title, never a date or a code
type: paper                          # paper | result | method | meeting | person | grant | concept
status: current                      # current | active | done | archived
tags: [type/paper, topic/chromatin]  # facets, not hierarchy
last-reviewed: 2026-08-25
---

# Human readable title

...the actual note...

## Related
- [[Another note]] · [[A person]] · [[_meta/MOC]]
```

A few of these earn their place in ways that are not obvious:

**Choose the room by what the note IS, not what it is about.** This is the rule everybody gets wrong
first. A paper about a method goes in `20_Literature/`, because it is a paper. My notes on how I run
that method go in `10_Research/`, because it is a method. The person who invented it goes in
`people/`. Same subject, three rooms, and the *type* is what decides.

**`last-reviewed` looks like bureaucracy and is not.** It is the only field that tells me which of my
durable facts have quietly stopped being true.

**Three tag namespaces, and you reuse before you invent.** `type/`, `status/`, `topic/`, nothing
else. Two tags meaning the same thing is worse than one imperfect tag, and tag sprawl is the most
common way a vault stops being searchable without anyone noticing. And no hierarchies:
`topic/genomics/chromatin/atac` is a folder wearing a costume.

**Callouts carry epistemic status.** `[!note]` for uncontroversial context, `[!hypothesis]` for
something I believe but have not shown, and which says what would kill it, `[!warning]` for a trap or
a confound. A hypothesis must never be written as a note. If a reader cannot tell what I have shown
from what I hope, the vault has lost the only property that makes it worth keeping.

The rooms themselves are numbered with gaps on purpose, so a new one can be added later without
renumbering anything. They are also the least transferable part. A lawyer's rooms are not a
biologist's. The numbering habit transfers; my folder names do not.

## Instrument one loop, not five

The temptation is to automate everything at once. Do not. Pick the single task you do most often,
instrument it end to end, and then leave it alone for a month. You learn more from one loop running
for thirty days than from five loops running for three.

Pick the loop that is **frequent, low-stakes and currently annoying**. Frequent, so the feedback
arrives fast. Low-stakes, so a bad output costs nothing. Annoying, so you will actually keep using
it.

Mine is the paper-a-day loop, and the prompt is not clever:

> Digest this paper into a note in `20_Literature/` using `99_Templates/paper.md`. Follow the filing
> rules in `CLAUDE.md`. Then link it to whichever part of my project it touches, and to any claim it
> supports or threatens. Add a line to today's daily note. Tell me what you were unsure about.

What lands is a literature note with the frontmatter filled in, a "what I take from it" section that
is mine to correct, links out to the project, and a line in the day's note. What I do is read it, fix
the interpretation, approve. Usually two minutes. When I disagree with how it linked something, that
is the interesting part, and nine times out of ten it means my project notes are vague rather than
the agent being wrong.

One habit that has paid for itself repeatedly: **when the output is wrong, resist writing a longer
prompt. Add a sentence to `CLAUDE.md` instead.** The prompt is for this task, the rules file is for
every task forever. A rule written once fixes the problem permanently and for every future session.
A year in, `CLAUDE.md` is the most valuable file in the vault, and it is made entirely of mistakes I
decided not to repeat.

Then, fifteen minutes on a Friday: did it help me learn, did it survive contact with a real reader,
what annoyed me. Inbox to zero, open the graph view and either link or bin the orphans, promote real
decisions out of the daily notes into permanent ones. Skip that and the vault becomes a junk drawer
inside two months. No amount of tooling prevents it. Only the fifteen minutes does.

## What is Sean's, and what I changed

The credit matters, so here it is plainly. The **harness metaphor** is Sean Chen's: a large language
model is a very powerful horse, and without a harness it runs somewhere random. The harness is not a
limit on the power, it is what makes the power usable. So is the **three-memory model**, and so is
the **end-loop guardrail**, the insistence that an agent doing multi-step work needs an explicit stop
condition. His
[talk on agent harnesses](https://www.youtube.com/watch?v=GrNbuWWJYiI) is twenty minutes and it is
the reason this vault has the shape it does.

Where I went differently: his framing keeps the durable memory in a database with a retrieval layer
on top. I made it **fully agentic instead**. The memory is plain markdown, and the agent reads,
writes and retrieves against it directly. No vector store, no embeddings, no retrieval pipeline.
Context engineering as a filesystem.

What is mine downstream of that: the decision to let a filesystem be all three memories at once, the
room scheme and the numbering with gaps, the frontmatter contract and the tag taxonomy that make
filing decidable by an agent rather than a judgement call, the `## Related` block as a required part
of every note, the Maps of Content pattern, the paper-a-day loop as the first and only thing to
instrument, and the weekly review. Most of the conventions I tried are *not* in the repo, and that
is most of the value.

## The honest limits

- **It is a filing system, not magic.** If the notes are thin, the agent's output is thin. Rubbish
  in, rubbish out, faster.
- **The first fortnight feels like pure overhead**, because you are paying for structure you have
  not yet drawn on. It pays back after that, not before. The moment it flips is usually the first
  time you ask a question and the answer is already written down.
- **It will not make you a better scientist.** Your moat is the work, not the workflow. If you catch
  yourself perfecting the vault instead of doing the thing the vault is for, close it.
- **Nothing here is novel infrastructure.** Markdown, folders and wikilinks all predate me by years,
  and Luhmann's argument that the links are the thinking is much older than any of this. What is
  mine is the specific set of conventions, tested daily on real work for long enough to know which
  ones survive contact.

## Take it

The install is three commands, and the last one is just opening an agent in the folder:

```bash
git clone https://github.com/faith-ogun/second-brain.git
cp -R second-brain/vault-template ~/MyBrain
cd ~/MyBrain && claude    # it reads CLAUDE.md on the way in and knows the filing rules
```

Then open `_meta/VAULT.md` and `_meta/MOC.md` and put your own project in the one line each of them
asks for. Those two files are what an agent reads first, so they are the only ones that have to be
true on day one. Everything else is convention, and you should change all of it.

I run this for the PhD, for both startups, and for every hackathon project I start. I open a vault on
day one, before there is any code, because the decisions worth keeping get made in the first hour and
they are exactly the ones nobody writes down. The PhD vault is the oldest one. It is not the largest.

The brain is worth building precisely because it should disappear into the background, and let the
work be the hard, visible thing.
