# Gridiron SEC — 2026 forecasting model

**Live: https://dram-dev.github.io/gridiron-sec/**

A forecasting dashboard for the 2026 SEC football season: power ratings decomposed into
seven interpretable components, drive-level game simulation, player-level projections with
Points Above Replacement, coaching-tendency profiles, and a scenario studio where changing
one assumption propagates through every projection in the app.

Built for the SEC's first nine-game conference season — no divisions, three annual opponents
per team, top two by conference winning percentage meet in Atlanta on 5 December.

## What it does

| View | What it answers |
|---|---|
| **Command Center** | Where the sixteen stand, where the model disagrees with the AP poll, the full 120-game slate week by week |
| **Team Lab** | One team decomposed — rating waterfall, efficiency profile against the conference median, game-by-game win probability, win-total distribution, roster value |
| **Player Lab** | All 191 tracked players ranked by PAR, with season projections carrying 10th–90th percentile bands and per-week matchup difficulty |
| **Matchup Simulator** | Any two teams, 30,000 drive-level simulations — margin distribution, most likely final scores, spread and total ladders, key player lines for both sides |
| **Coach Intelligence** | Tendency profiles that survive roster turnover, career arcs, and the uncertainty premium on six first-year staffs |
| **[Trajectory](https://dram-dev.github.io/gridiron-sec/#/trajectory)** | The season as a path — win fan charts, the standings race, per-game title leverage, and every team's outcome distribution at once |
| **[Model Lab](https://dram-dev.github.io/gridiron-sec/#/model)** | The twelve coefficients that *are* the model — move one and the whole league re-derives, scored against rankings it was never fitted to |
| **[How this works](https://dram-dev.github.io/gridiron-sec/#/how-it-works)** | Long-form explainer — the engine end to end, and the design decisions behind the interface |
| **Scenario Studio** | Injury availability, per-team dials, league-wide conditions, and forced results for conditional odds |
| **Methodology** | Every constant, every source, every limitation |

Every view has its own URL. `#/team/UGA`, `#/player/miss-trinidad-chambliss` and
`#/matchup/UGA/ALA` all open on the thing they name, so any state worth discussing is
a link.

## The model

Three layers, each taking the one above as input.

**1 — Team rating.** Points per game above an average FBS team on a neutral field, as the sum
of seven named components: returning offence, returning defence, quarterback, coaching,
continuity, portal & recruiting, and special teams.

**No team carries a rating constant.** Each component is *derived* from that team's
observations — prior-season per-play efficiency, the summed value of the roster on hand,
returning production, blue-chip ratio, the portal cycle, the coaching record — by twelve
global coefficients in `engine/model.ts`, applied identically to all sixteen teams. There is
nowhere in the system to write down "Georgia, 26 points"; that number falls out. A test
asserts no `components` field ever returns to the team data.

That structure earns an external check. Nothing is fitted to SP+, yet the derived conference
ordering correlates with the published SP+ preseason ranking at **ρ = 0.96** — evidence the
derivation is not arbitrary, and a regression guard in the test suite. It is not a backtest:
no result is scored.

**2 — Game model.** Margin is pure rating arithmetic (`rating gap + home field + rest`, damped
by weather), so any projection reads back as "this team is N points better, plus home field".
The total responds to both offences and both defences, scaled by tempo. A drive-level Monte
Carlo then produces the actual score distribution — calibrated so its expected points and its
margin standard deviation both match the closed form exactly.

**3 — Season simulation.** Every game, thousands of times, recording the path rather than
only the endpoint: cumulative wins and conference standing are captured after each week, and
each game's marginal effect on the title race is measured by conditioning — the simulation set
is split on that game's result and the two championship rates compared, with every other game
still playing out on both sides. A team's true strength is drawn
**once per simulated season**, not once per game: a team that is three points better than its
rating is better every week. Without that correlation, simulated win totals cluster far too
tightly and every team looks like a seven-win team.

**PAR** (Points Above Replacement) is the points of team rating lost across a season if a
player were replaced by the next man up. Ruling a player out subtracts exactly that from the
appropriate side of the ball — the arithmetic is visible and checkable in the interface.

## Data provenance

Every record carries a `measured`, `verified` or `modeled` flag, surfaced in the UI wherever it
appears.

- **Measured** — per-play efficiency, 2025 results, returning production, recruiting composites,
  and every rostered player's 2025 production. Counted off 165,849 plays of 2025 play-by-play
  across 956 games and 236 teams by `scripts/etl`, then opponent-adjusted. Nothing in this tier
  was typed by hand; it lives in the generated `src/data/measured.ts` and
  `src/data/measuredPlayers.ts`, and regenerates with `npm run etl`.
- **Verified** — the 2026 schedule (all 72 conference games reconciled across both
  participants' published schedules), the Preseason Coaches All-SEC teams, announced Week 1
  starting quarterbacks, reported portal additions, and the coaching carousel. Sourced from
  public reporting while the dataset was compiled; every source is listed in the Methodology view.
- **Modeled** — forward-looking usage shares, player grades, PAR values, coach tendency indices
  and all seven rating components. Analyst estimates calibrated against the measured and verified
  layers. Model inputs, not measurements.

### The player layer

140 of 191 rostered players are matched to the play-by-play, with their carries, targets,
dropbacks, the EPA on those plays and their share of the team's usage all counted. Transfers
carry the production they earned at the school they left.

The 51 misses are not a bug. Play-by-play never names an offensive linemen, so no lineman
carries an individual production line — a line's work is measured collectively, in its team's
line yards and sack rate allowed. A defender appears only on snaps where they recorded
something.

Matching requires the name *and* the school to agree. That costs a few legitimate matches and
prevents a much worse failure: six players on this roster share a name with someone else in the
sport, and a name-only match handed them the wrong man's season.

Two engine changes came out of feeding it real rates. Per-player rates are now regressed toward
the league mean in proportion to the sample behind them — a back who averaged 6.5 yards a carry
over 256 carries will not do it again, and replaying last season's rate overshoots every leader.
And starters now come off the field in projected blowouts, which the model previously handled
backwards: a blowout raised the run rate and put every extra carry on a starter who would
already be in a baseball cap on the sideline.

### Rebuilding the measured layer

```bash
npm run etl:fetch      # ~59 MB of parquet into .data/ (gitignored)
npm run etl            # regenerate src/data/measured.ts
npm run etl:validate   # re-run the out-of-sample checks below
```

Quality metrics are opponent-adjusted because a raw season average would lie about this
conference: sixteen teams that mostly play each other post depressed offensive numbers and
flattering defensive ones. Each metric is fit over every FBS game as
`league mean + offence − defence`, solved by ridge-regularised alternating least squares, with
the ridge weight chosen per metric by five-fold cross-validation on held-out games.

The adjustment is justified out of sample, not by assertion. Fitting on four fifths of the
season and predicting the final margin of the games left out, removing the schedule explains
**39.2%** of the variance in margin against **25.1%** for a raw season average.

Pace and style metrics — tempo, pass rate, fourth-down aggression, special teams, field
position, turnover margin — are left unadjusted, since an opponent does not choose how fast you
snap the ball. And no garbage-time filter is applied: the conventional cut was tested and made
the ratings worse at every threshold, monotonically.

This is a static snapshot compiled 5 September 2026. It does not update for results or
injuries; the Scenario Studio exists so you can impose those yourself. It is not betting advice.

## Design

Charts follow one spec throughout: thin marks with rounded data-ends anchored to the baseline,
2px lines, a 2px surface gap between adjacent fills, recessive axes, selective direct labels,
and a hover layer on everything that plots.

Every colour ramp was checked with a palette validator against both chart surfaces —
lightness band, chroma floor, colour-vision-deficiency separation, normal-vision floor and
contrast. Two-series charts use validated categorical hues rather than team colours, because
half this conference wears near-identical crimson and Georgia-versus-Alabama in team colours
is two indistinguishable reds. Team identity is carried by swatches and direct labels instead.

Light and dark are both selected, not flipped — each mode has its own validated steps.

## Running it

```bash
git clone https://github.com/dram-dev/gridiron-sec.git
cd gridiron-sec
npm install
npm run dev          # development server
npm test             # 79 engine, data-integrity and measured-layer tests
npm run typecheck
npm run build        # production build
npm run build:artifact   # single-file build, everything inlined
```

## Layout

```
src/
  data/       typed schema, the measured layer and the curated 2026 dataset
              measured (generated) · teams · coaches · players · schedule · meta
  engine/     pure, deterministic forecasting
              ratings · game · season · players · scenario · rng · constants
  components/ chart and interface primitives
  views/      the seven dashboard views
  state/      one reducer holding the scenario; everything else derives from it
  workers/    season simulation, off the main thread
scripts/
  etl/        play-by-play → src/data/measured.ts
              sources · fetch · adjust · build · validate
  lib/        validated visualisation palette and formatting
```

The engine is pure TypeScript with no React dependency and no I/O — it can be imported and run
anywhere. All randomness comes from a seeded generator, so the same seed and scenario always
produce the same numbers.

## Tests

`npm test` covers the derivation (no per-team constants, league anchoring, near-invariance
under rescaling, coach regression with no record, and the SP+ rank correlation as a guard),
schedule integrity (72 conference games, nine per team, all annual opponents
honoured, no double-bookings), data integrity (every player on a real team, usage shares and
probabilities in range), the statistics helpers, rating arithmetic (components sum to the
total; ruling a player out costs exactly their PAR), agreement between the closed-form and
simulated game models, and season-simulation invariants (one champion and two title-game
participants per simulated season, win distributions summing to one, forced results honoured).
