---
title: "Ninety experiments, judged through a 3.2% aperture"
description: "A bronze medal in the Pokémon TCG AI Battle Challenge, and the finding that mattered more than the rank: our two best networks measured −2.50 points and +4.28 points in separate campaigns, with nothing changed between the readings except a single threshold nobody had re-examined in ninety experiments."
date: 2026-09-20
category: workbench
heroKicker: "Workbench · Reinforcement learning"
readingTime: "14 min read"
tags: ["Reinforcement learning", "Monte Carlo tree search", "Determinization", "Imperfect information", "Experiment design", "Kaggle", "Evaluation", "Hyperparameters"]
---

The Pokémon TCG AI Battle Challenge closed on 1 September. We finished **559th of 6,807 teams**, out
of 14,081 entrants, which is a bronze medal and roughly the top 9%. That number is the least
interesting thing that came out of the campaign.

The interesting thing is that our strongest component spent ninety experiments looking like a
failure, and it was our own fault in a way I had not seen before. The full write-up is
[on Kaggle](https://doi.org/10.34740/kaggle/w/110279); this is the part I keep thinking about.

## The agent, and why it has that shape

The constraints did most of the design work. Inference is CPU only, on roughly 1.6 vCPUs, with a
600 second clock for the whole game, and a crash, a timeout or an illegal move is an instant loss.
A large network is simply unaffordable.

But the engine hands you legal actions in roughly best-first order, which means *"always take option
zero"* already beats a random agent 88 to 90% of the time. A decent ordering exists for free. Search
does not need to find good moves from scratch; it only needs to fix the places where that free
ordering is wrong.

<figure>
  <video src="/assets/video/ptcg-architecture.mp4" autoplay loop muted playsinline></video>
  <figcaption>The split that makes it affordable: a hand-written policy answers most menus instantly, and only genuinely close calls are escalated into search.</figcaption>
</figure>

So the agent is a hand-written base policy underneath a Gumbel sequential-halving search over
determinized worlds, with small value networks scoring the leaves. In order:

The **base policy** does exact per-turn knockout arithmetic, weakness doubling, resistance, damage
items, plus prize-trade and exposure-differential terms and opponent-threat tables. It answers
forced or uncontested menus with no search at all, and that is about 84% of moves.

The **contested-decision gate** escalates only the decisions where the top scores sit close
together: attacks, retreats, energy attachments.

The **search** draws a fresh belief-weighted determinization every simulation rather than once at
the root, and uses common random numbers inside a visit round so candidates are compared against
the same sampled worlds. On the shipped clock that is 753 determinizations per decision.

Then two **value networks**, 732k parameters each, averaged. And finally an **override gate**: the
search's preferred action replaces the policy's choice only if it wins by an absolute margin τ.

That last sentence is the whole post.

We pre-registered four hypotheses with kill conditions. Consistency beating raw power: supported,
every robustness lever outperformed every "stronger play" lever. Search beating policy: supported
decisively, since disabling search drops the champion from 50% to 29%, so search is worth about 21
win-rate points from roughly two overrides per game. Prize trade being central: supported, the
exposure terms swing matchups by 9 to 10 points either way. Turn-order asymmetry being exploitable:
the premise reproduced, at a 59.3% first-player win rate in decided mirrors, but our fix failed and
we killed it.

The second one is load-bearing, and it set the trap. If search is worth 21 points from two overrides
a game, then everything depends on **how often the search is allowed to overrule the policy**. Which
is one scalar. Which nobody looked at again.

## The scoreboard cannot measure an agent

Before any of that, a harder problem: we could not trust the leaderboard to tell us whether a change
helped.

Our merge binary was submitted seven times, unchanged, and finished 836, 883, 768, 809, 813, 899,
902. Another agent, the same file, drew 933.7 and 741.9 thirteen hours apart. A competitor reported
byte-identical agents at 1104.6 and 687.4.

<figure>
  <video src="/assets/video/ptcg-leaderboard-noise.mp4" autoplay loop muted playsinline></video>
  <figcaption>Every row is the same agent. The spread is the scoreboard measuring itself, not the player.</figcaption>
</figure>

The mechanism is not mysterious. Scheduling priority is rating-scaled, and the host quotes 8×. An
early winning streak compounds into more games, uncertainty collapses, and the rating anneals in
place. A high finish is frequently a well-timed walk rather than a stronger agent.

<div class="keypoint">
<p>If a metric moves 400 points on a file you did not touch, it is not a measurement. It is a
sampling process you happen to be able to read.</p>
</div>

## So we built an instrument, and then audited the instrument

Most of what we learned came from auditing our own harness rather than the agent.

**Control cells in every panel**, same run, same program. Without them our harness once reported an
agent as significantly different from itself: a rule measured +7.6 with "high confidence", then
re-measured +1.7 [−3.8, +7.2] once controls were added. It was not fielded.

**A measured noise floor.** Identical-program cells swung from −8.7 to +8.0. Anything inside roughly
±4 points at our sample sizes is unresolvable, and several planned arms were cancelled outright once
we worked out that no affordable sample could resolve them.

**Placebo arms.** One patch measured +3.0 until its placebo moved +1.9 unaided, leaving +1.1. Killed.

**Pre-registered bars**, with effect size, sample size and kill condition committed before the run,
so a disappointing result could not be quietly reinterpreted afterwards.

The most expensive lesson was a harness default. Our gates set a shallow think-budget flag that the
shipped agent never used, so **every experiment before 14 August measured an agent about six points
weaker than the one we were actually fielding**. We only caught it by reconstructing per-decision
clock consumption from 559 real competition games, where the fielded agent spends 97.5% of each
per-decision budget and a median 98.2 seconds of its 600. One clean comparison then valued the real
clock at +6.00 pp [+1.87, +10.10].

## The aperture

Here is the result, and the reason I am writing this up at all.

The two-network ensemble measured **−2.50 pp [−6.18, +1.18] over 12,800 games**, and we wrote it off
in the log as "null, do not field".

Later, the same ensemble measured **+5.86 pp**, replicated at **+4.28 pp [+2.43, +6.13], z = 4.54**.

Nothing about the networks changed between those two readings. Only the gate in front of them.

<figure>
  <video src="/assets/video/ptcg-tau-aperture.mp4" autoplay loop muted playsinline></video>
  <figcaption>The same two networks, measured twice. The only difference is τ, the margin the search has to clear before it is allowed to overrule the policy.</figcaption>
</figure>

τ is an **absolute** margin on a noisy value estimate. When we deepened the search from 77 to 753
simulations per decision, the estimator's noise shrank by roughly 1.8×, so the same numeric τ
silently became a far stricter filter. The deep agent overruled itself *less* often (3.4%) than the
shallow one (5.2%) despite being six points stronger, which looks absurd until you notice the
threshold is denominated in the wrong units.

At the shipped τ, the ensemble was permitted to change **3.2% of searched decisions**. At τ = 0.04,
**19.7%**. We had tuned that hyperparameter against a weaker, noisier version of our own agent,
carried it forward unexamined, and then judged ninety experiments' work through a 3.2% aperture.

The fix is not "always trust the search". The dose-response curve turns at about 33%, and past that
more overriding stops reliably helping and reverses against one opponent. There is a real optimum,
and it sits close to where a standard-error-denominated threshold would have put it in the first
place.

One more thing fell out of it. The two levers proved **sub-additive**: on a single network,
loosening τ further is worth +3.81 pp [+0.97, +6.64]; on two networks, +0.76 pp [−1.32, +2.83].
Improving the evaluator and widening its franchise buy the same thing. They are substitutes, not
complements.

## We did not design a deck, we built something to choose one

We built an instrument for deciding what deck to play, used it five times, and it told us to stay
put each time.

That instrument is a census of the actual metagame: **11,334 replays carrying exact 60-card lists**,
joined to 133,521 rated episodes. Decks are read from the literal 60-integer array in the replay
rather than inferred from revealed cards. Every one of 7,632 submissions turned out to be
single-archetype, purity 1.000 across 22,588 seat observations, which is what licenses projecting an
archetype seen once onto that submission's other games.

The field is violently stratified. Marnie's Grimmsnarl is 9.4% of decks at 500 to 700 rating and
39.6% at 1000 to 1200. Mega Lopunny is 4.0% low and 55.7% at 1200+. **A deck evaluated against "the
field" without conditioning on rating is being evaluated against a fiction.** Our own early panel
contained zero middle-band opponents, which inflated our champion by four points of pure instrument
error.

Two findings I would not have predicted:

**Deck strength is policy-dependent.** Crustle beats Garchomp 55.3% under a one-ply pilot and 38.0%
under search, with disjoint intervals. The same sixty cards change matchup polarity depending on who
is piloting them, which means decklist advice mined from human play does not transfer to an AI pilot
unaided.

**A change can be decisive in one matchup and still lose the ladder.** We tested a Hariyama list,
which is not a Pokémon-ex, so Crustle's damage-prevention ability does not apply and its 210 damage
one-shots Crustle's 150 HP. Isolated by swapping only `deck.csv`, it measured **+16.9 pp against
wall decks and −11.0 pp against everything else**. Walls are 17.5% of the field and break-even needs
about 40%. Field-weighted, that is −6.16 pp. Rejected.

The postscript is the good bit: the mechanism we designed barely fired at all. The agent attached
energy to Hariyama 3 times in 71 attachments and attacked with it in one game in four. Whatever
produced the wall gain, it was not the plan on paper. **A card's presence in a list is not the same
as a policy that can use it.**

## What didn't work

The negatives were more informative than the wins, and several were our own errors.

**Search width.** Raising the candidate cap measured −1.8 to −2.2 pp across all four cells. Wider
pools halve the simulations per candidate, and every override winner sat inside the top nine anyway.
The diagnostic that sent us there, "the cap binds on a third of decisions", was measuring engagement
rather than headroom.

**A bug that did not exist.** We diagnosed the agent promoting its 340 HP attacker into a
damage-immune wall. Measured occurrences across 240 games: zero. A related fix we did ship to the
panel measured −10.21 pp [−18.7, −1.8], because promoting the large body is *correct* when neither
side can deal damage.

**Everything stacked.** Combining every lever measured −2.50 pp over 12,800 games.

**Belief fidelity.** Feeding real opponent decklists into the search measured −0.2 ± 1.0. Accuracy
bought at the cost of simulations is a losing trade.

**A fabricated number.** One subagent's finding was written up as verified when no such measurement
existed. Caught, corrected, and the working process changed.

We retracted twelve claims during the campaign. The retraction rate is the point: the instrument was
strong enough to catch us, including when what it caught was us.

## Limits

Our agent's equilibrium is 850 to 880, the rating at which it wins half its games. Above that it
meets opponents it beats about a third of the time and falls back. High finishes are annealing
artifacts, not held positions, and I would rather say that than quote the best number we ever saw.

The binding constraint is now the base policy, which decides roughly 84% of moves and wins only 29%
alone. Three attempts to learn a replacement failed, and the honest diagnosis is feature poverty
rather than method. We also hold 722,726 honestly-labelled positions harvested from the 900 to 1100
bands, used once, diluted 300:1 against synthetic self-play, and never properly evaluated.

Both of the constraints that shaped every decision here also disappear in the Tokyo round, which
runs on an H100 with 16 vCPUs and 30 minutes per game instead of 1.6 vCPUs and ten. Almost every
trade-off above was forced by a compute budget that will not apply there. **This design answers a
specific machine, not the game.**

## The part that transfers

I think this generalises well beyond a card game, and it is the reason the write-up is titled after
the instrument rather than the result.

<div class="keypoint">
<p><strong>A hyperparameter tuned against a weaker version of your own system will quietly throttle
every component you build afterwards, and you will read that throttle as the component failing.</strong></p>
</div>

τ was not wrong when we set it. It was correct for an agent with roughly 1.8× the estimator noise,
and it became wrong the moment we made the agent better, silently, without touching that line. Every
subsequent evaluation of the value networks was really an evaluation of the networks *and* a stale
gate, and we attributed the whole thing to the networks.

The defence is cheap and I did not have it: denominate thresholds in units that move with the
system. A margin expressed in standard errors would have re-scaled itself when the search deepened,
and ninety experiments would have read differently.

The other defence is the boring one. Keep a control cell in every panel, write the kill condition
before the run, and be willing to retract. Twelve times, if that is what it takes.
