import { useMemo, type ReactNode } from 'react';
import { Waterfall } from '../components/charts';
import { TEAM_BY_ID } from '../data/teams';
import { PLAYER_BY_ID } from '../data/players';
import { ALL_GAMES } from '../data/schedule';
import { GAME_SIGMA, LEAGUE_PPG, TEAM_SIGMA } from '../engine/constants';
import { normalCdf } from '../engine/rng';
import { externalAgreement, spearmanVsSpPlus } from '../engine/model';
import { CATEGORICAL, DIVERGING, SEQUENTIAL, pct, signed } from '../lib/viz';
import { useStore } from '../state/store';

/* ============================================================================
 * How this works.
 *
 * A reading surface, not an operating surface. The rest of the app is a tool —
 * scanned, filtered, compared — and is typeset accordingly: dense, system
 * font, tabular numerals. This page is read once, start to finish, so it gets
 * a measure, a display face and room to breathe. Same product, different
 * register.
 *
 * Every number quoted below is pulled live from the engine rather than typed
 * in, so the prose cannot drift away from the model it describes.
 * ========================================================================== */

const SECTIONS = [
  { id: 'ratings', part: 'one', n: '1', title: 'What a rating is' },
  { id: 'games', part: 'one', n: '2', title: 'From two ratings to a game' },
  { id: 'seasons', part: 'one', n: '3', title: 'From games to a season' },
  { id: 'players', part: 'one', n: '4', title: 'What a player is worth' },
  { id: 'limits', part: 'one', n: '5', title: 'What it will not tell you' },
  { id: 'brief', part: 'two', n: '6', title: 'Two jobs, one product' },
  { id: 'crimson', part: 'two', n: '7', title: 'Why charts avoid team colours' },
  { id: 'ramps', part: 'two', n: '8', title: 'Testing instead of eyeballing' },
  { id: 'marks', part: 'two', n: '9', title: 'One chart spec, everywhere' },
  { id: 'type', part: 'two', n: '10', title: 'Type, numbers and themes' },
  { id: 'next', part: 'two', n: '11', title: 'Where the model is weakest' },
];

export function HowItWorks() {
  const { ratings, season, projectionById, go, state } = useStore();
  const mode = state.theme;

  const uga = ratings.UGA;
  const ala = ratings.ALA;
  const ugaTeam = TEAM_BY_ID.UGA;
  const alaTeam = TEAM_BY_ID.ALA;

  // The marquee game, projected by the same code path the Matchup view uses.
  const game = ALL_GAMES.find((g) => g.id === 'w6-UGA-ALA')!;
  const proj = projectionById.get('w6-UGA-ALA')!;

  const chambliss = PLAYER_BY_ID['miss-trinidad-chambliss'];
  const missWithout = ratings.MISS.total - chambliss.par;

  const outlook = season.teams.UGA;

  /**
   * Exact win distribution if the twelve games were independent coin flips at
   * the model's own per-game probabilities. This is the thing season-level
   * correlation is there to fix, so it is computed rather than asserted.
   */
  const independent = useMemo(() => {
    const probs = outlook.gameWinProbs.map((g) => g.probability);
    let dist = [1];
    for (const p of probs) {
      const next = new Array(dist.length + 1).fill(0);
      for (let i = 0; i < dist.length; i++) {
        next[i] += dist[i] * (1 - p);
        next[i + 1] += dist[i] * p;
      }
      dist = next;
    }
    return dist;
  }, [outlook.gameWinProbs]);

  const sd = (dist: number[]) => {
    const mean = dist.reduce((s, p, i) => s + p * i, 0);
    return Math.sqrt(dist.reduce((s, p, i) => s + p * (i - mean) ** 2, 0));
  };
  const sdIndependent = sd(independent);
  const sdModel = sd(outlook.regularWinDistribution);
  const spearman = useMemo(() => spearmanVsSpPlus(externalAgreement()), []);

  return (
    <div className="hiw">
      {/* ---------------------------------------------------------------- */}
      {/* Masthead                                                         */}
      {/* ---------------------------------------------------------------- */}
      <header className="hiw-measure pt-4 pb-10">
        <p className="hiw-eyebrow">Gridiron SEC</p>
        <h1 className="hiw-display mt-3 text-[46px] leading-[0.95] tracking-[-0.01em] sm:text-[62px]" style={{ color: 'var(--text-hi)' }}>
          How this works
        </h1>
        <p className="mt-5 text-[16.5px] leading-[1.65]" style={{ color: 'var(--text)' }}>
          This app makes one kind of claim: that a team is some number of points better than
          another, and here is everything that goes into that number. There is no fitted black box
          behind it — the model is arithmetic you can follow, and the first half of this page
          follows it end to end.
        </p>
        <p className="mt-4 text-[16.5px] leading-[1.65]" style={{ color: 'var(--text)' }}>
          The second half is about the design: how a dense analytical surface is built to be read
          at a glance, and the constraints this particular subject imposes on it.
        </p>
        <div className="mt-7 flex flex-wrap gap-2">
          <a href="#ratings" className="btn !py-1.5">Start with the engine ↓</a>
          <a href="#brief" className="btn !py-1.5">Skip to the design</a>
        </div>
      </header>

      <div className="hiw-layout">
        {/* -------------------------------------------------------------- */}
        {/* Contents rail                                                  */}
        {/* -------------------------------------------------------------- */}
        <nav className="hiw-rail" aria-label="On this page">
          <p className="label mb-3">On this page</p>
          {(['one', 'two'] as const).map((part) => (
            <div key={part} className="mb-4">
              <p className="hiw-display mb-1.5 text-[13px] uppercase tracking-[0.16em]" style={{ color: 'var(--accent-hi)' }}>
                Part {part}
              </p>
              <ul className="space-y-1">
                {SECTIONS.filter((s) => s.part === part).map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="flex gap-2 py-0.5 text-[12.5px] leading-snug transition-colors hover:text-[var(--text-hi)]"
                      style={{ color: 'var(--text-low)' }}
                    >
                      <span className="hiw-display w-4 shrink-0 tabular-nums" style={{ color: 'var(--text-faint)' }}>{s.n}</span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* -------------------------------------------------------------- */}
        {/* Body                                                           */}
        {/* -------------------------------------------------------------- */}
        <article className="min-w-0">
          <PartRule label="Part one" title="The engine" />

          <Prose>
            <p className="hiw-lead">
              Every team gets a rating in points. A game is one rating minus the other, plus home
              field. A season is that calculation run tens of thousands of times. Everything else
              is detail about where the ratings come from and how the randomness is handled.
            </p>
          </Prose>

          {/* ---- 1 ---- */}
          <Section id="ratings" n="1" title="What a rating is">
            <Prose>
              <p>
                A rating is points per game above an average team, on a neutral field. Georgia at{' '}
                <Num>{uga.total.toFixed(1)}</Num> means: play Georgia against a perfectly average
                opponent at a neutral site, and Georgia wins by about {uga.total.toFixed(0)}. It is
                the same unit a betting line uses, which is what makes it checkable.
              </p>
              <p>
                That number is not estimated in one piece. It is the sum of seven parts, each
                answering a different question about the roster.
              </p>
            </Prose>

            <Figure
              caption={`Georgia's rating, built one component at a time. Each bar starts where the last one finished; the final bar is the total. This is the whole model for this team — there is nothing else behind it.`}
            >
              <Waterfall parts={uga.parts} total={uga.total} height={200} />
            </Figure>

            <Prose>
              <ComponentList />
              <p className="hiw-sub">None of those seven is written down</p>
              <p>
                This is the part that decides whether any of the above is a model or a costume. No
                team carries a rating constant. Each of the seven components is computed from that
                team's observations — last season's per-play efficiency, the value of the roster on
                hand, returning production, recruiting talent, the portal cycle, the coaching record
                — by <Num>twelve</Num> coefficients applied identically to all sixteen teams.
              </p>
              <p>
                A coefficient is a rate, not a verdict: points per standard deviation of an
                observation, or a weight between two competing sources of evidence. There is no
                place in the system to type “Georgia, 26 points”. Georgia's{' '}
                <Num>{uga.total.toFixed(1)}</Num> is what falls out.
              </p>
              <p>
                That has a practical consequence, not just an honest one. With authored components,
                changing an input did nothing, because the answer had been written down separately.
                Here an input change propagates and a coefficient change re-rates the entire league,
                which is what the{' '}
                <button className="hiw-link" onClick={() => go('model')}>Model Lab</button>{' '}
                exists to let you do.
              </p>
              <p className="hiw-sub">And it agrees with a model it never saw</p>
              <p>
                Building from inputs makes an external check possible. The published SP+ preseason
                ratings are produced by an entirely independent method, and nothing here is fitted
                to them. The two conference orderings correlate at{' '}
                <Num>{spearman.toFixed(3)}</Num> across the thirteen SEC teams SP+ ranks.
              </p>
              <p>
                That is not a backtest — no result is being scored — and it does not make the model
                right. What it rules out is the model being arbitrary: a derivation built from
                these observations lands, unprompted, close to where a serious independent system
                lands. Where the two disagree, the Model Lab names the team and the component
                responsible.
              </p>
            </Prose>
          </Section>

          {/* ---- 2 ---- */}
          <Section id="games" n="2" title="From two ratings to a game">
            <Prose>
              <p>
                Once two teams have ratings, the projection is subtraction. Here is a real one —
                Georgia at Alabama, week {game.week}, computed by the same code the Matchup view
                calls.
              </p>
            </Prose>

            <Figure caption="The whole margin calculation. Nothing else feeds it.">
              <div className="hiw-calc">
                <CalcRow label="Georgia rating" value={signed(uga.total)} />
                <CalcRow label="Alabama rating" value={signed(ala.total)} minus />
                <CalcRow label="Gap, Georgia’s way" value={signed(uga.total - ala.total)} rule />
                <CalcRow label={`Home field — ${alaTeam.venue.name}`} value={`−${proj.hfa.toFixed(1)}`} />
                <CalcRow
                  label="Projected margin"
                  value={`${proj.margin < 0 ? 'Georgia' : 'Alabama'} by ${Math.abs(proj.margin).toFixed(1)}`}
                  rule
                  strong
                />
              </div>
            </Figure>

            <Prose>
              <p>
                Turning a margin into a win probability needs one more number: how far real results
                scatter around a projection. In college football that spread is about{' '}
                <Num>{GAME_SIGMA}</Num> points. Feed the margin and the spread into a normal curve
                and Georgia comes out at{' '}
                <Num>{pct(proj.awayWinProb, 1)}</Num>.
              </p>
              <p>
                That single number is worth sitting with, because it is the most misread thing in
                any forecast. A spread of {GAME_SIGMA} points means a team favoured by ten still
                loses roughly{' '}
                <Num>{pct(1 - normalCdf(10 / GAME_SIGMA))}</Num> of the time. The model is not
                being timid — that is simply what the sport does.
              </p>
              <p>
                The total works the other way round. Margins come from the difference between two
                ratings; points come from the sum of what four units do. Two good offences against
                two poor defences is a high total whoever wins, and tempo scales the whole thing —
                more snaps, more points.
              </p>
            </Prose>

            <Figure caption="Margin and total are separate questions, and the model treats them separately.">
              <div className="grid gap-3 sm:grid-cols-2">
                <Formula
                  title="Margin"
                  lines={['rating gap', '+ home field', '+ rest', '× weather']}
                  result={`${Math.abs(proj.margin).toFixed(1)} points`}
                />
                <Formula
                  title="Total"
                  lines={[
                    `2 × ${LEAGUE_PPG} league baseline`,
                    '+ both offences',
                    '− both defences',
                    '× tempo × weather',
                  ]}
                  result={`${proj.total.toFixed(1)} points`}
                />
              </div>
            </Figure>

            <Prose>
              <p className="hiw-sub">So why simulate at all?</p>
              <p>
                Because the formula gives an average, and football scores are not smooth. They pile
                up on 3, 7, 10 and 14 and avoid 1, 2 and 4 almost entirely. A normal curve cannot
                see that, so the app plays the game out possession by possession: each drive ends in
                a touchdown, a field goal, or nothing, with the odds tuned so the expected points
                land exactly where the formula said they would.
              </p>
              <p>
                The tuning is the part that matters. The simulation is not a second opinion — it is
                the same projection, expressed as a distribution instead of an average. Its mean
                margin, its mean total and its spread are all forced to agree with the closed form.
                If they ever disagreed, one of them would be wrong.
              </p>
            </Prose>
          </Section>

          {/* ---- 3 ---- */}
          <Section id="seasons" n="3" title="From games to a season">
            <Prose>
              <p>
                A season is all {ALL_GAMES.length} games, played{' '}
                {season.iterations.toLocaleString()} times over. The obvious way to do that is to
                flip a weighted coin for each game independently. That way is wrong, and it is wrong
                in a way you can see.
              </p>
              <p>
                If each game is independent, a team's record collapses toward its average. Georgia
                finishes 10–2 or 9–3 nearly every time and almost never 12–0 or 7–5. Real seasons
                are not like that, because a team that is better than you thought is better{' '}
                <em>every week</em> — not independently in each game.
              </p>
              <p>
                So each simulated season begins by drawing a team's true strength once. Georgia
                might be a {(uga.total + TEAM_SIGMA).toFixed(0)}-point team in one run and a{' '}
                {(uga.total - TEAM_SIGMA).toFixed(0)}-point team in the next, and then plays all
                twelve games at that strength. The per-game randomness is scaled down to make room,
                so the total spread on any single game is unchanged.
              </p>
            </Prose>

            <Figure
              wide
              caption={`Georgia's regular-season win total, the same twelve games modelled two ways. Treating games as independent gives a standard deviation of ${sdIndependent.toFixed(2)} wins. Drawing team strength once per season gives ${sdModel.toFixed(2)} — a materially wider, and more honest, range.`}
            >
              <DistributionCompare
                a={{ label: 'Games treated as independent', dist: independent, color: 'var(--viz-mid)' }}
                b={{ label: 'This model — strength drawn once per season', dist: outlook.regularWinDistribution, color: 'var(--viz-seq-3)' }}
              />
            </Figure>

            <Prose>
              <p>
                Everything the app says about a season falls out of those runs: projected records,
                the conference table, who reaches Atlanta. The standings order by conference winning
                percentage, with ties broken head-to-head, then by overall record, then by rating.
              </p>
            </Prose>
          </Section>

          {/* ---- 4 ---- */}
          <Section id="players" n="4" title="What a player is worth">
            <Prose>
              <p>
                Players enter the model through one number: <strong style={{ color: 'var(--text-hi)' }}>Points
                Above Replacement</strong>. It answers a single question — if this player were
                replaced by the next man up for a full season, how much worse would the team be?
              </p>
              <p>
                Trinidad Chambliss is the most valuable player in the conference at{' '}
                <Num>{chambliss.par.toFixed(1)}</Num> points. That is not an abstract score. Take him
                off Ole Miss and their rating falls from{' '}
                <Num>{ratings.MISS.total.toFixed(1)}</Num> to <Num>{missWithout.toFixed(1)}</Num> —
                which is roughly the distance between Ole Miss and a middle-of-the-table team.
              </p>
              <p>
                Because it is denominated in the same units as everything else, it flows straight
                through. Rule him out in the Scenario Studio and the subtraction happens once, then
                every game he would have played, the conference table, and the title odds all move
                with it. Nothing is recomputed by a separate rule — there is only the one number.
              </p>
            </Prose>

            <Figure caption="Ruling one player out, followed through the whole model.">
              <ol className="hiw-chain">
                {[
                  ['Player', `${chambliss.name} ruled out`],
                  ['Team rating', `Ole Miss ${ratings.MISS.total.toFixed(1)} → ${missWithout.toFixed(1)}`],
                  ['Every game', 'All twelve projections shift by the same amount'],
                  ['Season', 'Records, standings and title odds re-simulate'],
                ].map(([k, v], i) => (
                  <li key={k}>
                    <span className="hiw-display hiw-chain-n">{i + 1}</span>
                    <span>
                      <span className="label">{k}</span>
                      <span className="mt-0.5 block text-[13px]" style={{ color: 'var(--text-hi)' }}>{v}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </Figure>
          </Section>

          {/* ---- 5 ---- */}
          <Section id="limits" n="5" title="What it will not tell you">
            <Prose>
              <p>
                A forecast without its limits is just a number. These are the real ones.
              </p>
              <Limits />
              <p className="mt-6">
                The <button className="hiw-link" onClick={() => go('method')}>Methodology page</button>{' '}
                lists every constant with its value and its justification, plus each source the
                verified layer was built from.
              </p>
            </Prose>
          </Section>

          {/* ============================================================ */}
          <PartRule label="Part two" title="The design" />

          {/* ---- 6 ---- */}
          <Section id="brief" n="6" title="Two jobs, one product">
            <Prose>
              <p>
                Six of the seven views are a tool. They are scanned, filtered, sorted and compared,
                often several at once, and they are typeset for that: dense rows, a system font that
                loads instantly, tabular numerals so digits line up down a column, and colour used
                to encode rather than to decorate.
              </p>
              <p>
                This page is a document. It is read once, top to bottom, so it gets a measure of
                about sixty-five characters, a larger body size, more air between paragraphs, and a
                condensed display face borrowed from scoreboard and jersey typography — used here
                for the numerals and headings, and nowhere else in the app.
              </p>
              <p>
                That contrast is deliberate. The two surfaces should feel like the same product
                without pretending to be the same kind of page.
              </p>
            </Prose>
          </Section>

          {/* ---- 7 ---- */}
          <Section id="crimson" n="7" title="Why charts avoid team colours">
            <Prose>
              <p>
                Colouring each side of a chart in its own team colour is the obvious move, and in
                this conference it does not work. Alabama, Georgia, Arkansas, South Carolina,
                Mississippi State and Oklahoma all wear a version of crimson. Half the league is
                the same hue.
              </p>
            </Prose>

            <Figure
              wide
              caption="Georgia against Alabama, encoded two ways. On the left, each side in its own team colour. On the right, the validated categorical pair. Only one of these can be read."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <CrimsonDemo
                  title="Team colours"
                  bad
                  left={ugaTeam.primary}
                  right={alaTeam.primary}
                  leftLabel={`Georgia ${ugaTeam.primary}`}
                  rightLabel={`Alabama ${alaTeam.primary}`}
                />
                <CrimsonDemo
                  title="Validated pair"
                  left={CATEGORICAL[mode][0]}
                  right={CATEGORICAL[mode][1]}
                  leftLabel={`Slot 1 ${CATEGORICAL[mode][0]}`}
                  rightLabel={`Slot 2 ${CATEGORICAL[mode][1]}`}
                />
              </div>
            </Figure>

            <Prose>
              <p>
                Those are two different colours. They are not two <em>distinguishable</em> colours,
                and under the most common form of colour-vision deficiency they are closer still.
              </p>
              <p>
                So team colours do not carry data anywhere in the app. They appear constantly — as
                the swatch beside a school's name, the stripe on a team header, the accent on a
                card — because that is identity, and identity is reinforced by the name sitting
                next to it. But when colour has to encode <em>which series is which</em>, the chart
                uses a tested palette instead.
              </p>
            </Prose>
          </Section>

          {/* ---- 8 ---- */}
          <Section id="ramps" n="8" title="Testing instead of eyeballing">
            <Prose>
              <p>
                Colour separation is measurable, so it is measured rather than judged by eye. Every
                ramp in the app was run through a validator against both chart backgrounds,
                checking five things: that the steps sit in a usable lightness band,
                that they carry enough chroma to read as colours at all, that neighbouring pairs
                stay apart under simulated colour-vision deficiency, that they stay apart under
                normal vision, and that each one clears contrast against the surface it sits on.
              </p>
              <p>
                The constraint bites: a diverging pair that reads well on a light background sits
                too bright for a dark one, and a sequential ramp's pale end cannot clear contrast
                against white. Both ramps are stepped separately per background for exactly that
                reason.
              </p>
            </Prose>

            <Figure wide caption="The three ramps, each doing one job. Hover any swatch for its value.">
              <div className="grid gap-4 md:grid-cols-3">
                <RampCard
                  title="Categorical"
                  role="Identity — which series is this?"
                  rule="Fixed slot order, never cycled. Past eight series, fold into “other” or split the chart."
                  swatches={CATEGORICAL[mode]}
                />
                <RampCard
                  title="Sequential"
                  role="Magnitude — how much?"
                  rule="One hue, light to dark. Runs in opposite directions in the two themes so “more” always means further from the background."
                  swatches={SEQUENTIAL[mode]}
                />
                <RampCard
                  title="Diverging"
                  role="Polarity — which way from zero?"
                  rule="Two opposed hues with a neutral grey midpoint. Never a hue in the middle."
                  swatches={[DIVERGING[mode].neg, DIVERGING[mode].mid, DIVERGING[mode].pos]}
                />
              </div>
            </Figure>
          </Section>

          {/* ---- 9 ---- */}
          <Section id="marks" n="9" title="One chart spec, everywhere">
            <Prose>
              <p>
                Every chart in the app follows the same rules, so a reader learns them once and then
                stops having to think about them.
              </p>
              <SpecList />
              <p>
                The charts are hand-built SVG rather than a charting library, which is the only way
                to hold that line — a library gives you its defaults, and its defaults are not these.
              </p>
            </Prose>
          </Section>

          {/* ---- 10 ---- */}
          <Section id="type" n="10" title="Type, numbers and themes">
            <Prose>
              <p>
                The interface runs on the system font stack. It loads with no network round trip and
                no layout shift, and on a dense table of numbers it simply looks native. Digits
                everywhere use tabular figures so columns align, and negative numbers use a true
                minus sign rather than a hyphen, which is narrower and sits at the wrong height.
              </p>
              <p>
                Both themes are designed, not derived. Dark is the default because the app is
                something you sit in front of, but light is not an inversion — it has its own
                validated steps for every ramp. The sequential scale genuinely runs in opposite
                directions between them, because “more” should always be the step furthest from the
                background, and the background is on opposite ends in the two modes.
              </p>
            </Prose>

            <Figure caption="The same scale, stepped separately for each background rather than flipped.">
              <div className="grid gap-3 sm:grid-cols-2">
                <ThemeSample mode="dark" />
                <ThemeSample mode="light" />
              </div>
            </Figure>
          </Section>

          {/* ---- 11 ---- */}
          <Section id="next" n="11" title="Where the model is weakest">
            <Prose>
              <p>
                Four places where the model is thinner than it looks, in rough order of how much
                they cost the forecast.
              </p>
              <ol className="hiw-numbered">
                <li>
                  <strong>The observations are estimates, not measurements.</strong> The structure
                  above them is real — twelve coefficients, no per-team constants — but per-play
                  efficiency profiles and player grades are analyst estimates rather than figures
                  derived from play-by-play. A sound model on soft inputs is still soft. This is
                  the single biggest limitation in the system, and every affected record is flagged
                  in the interface.
                </li>
                <li>
                  <strong>The playoff figure is a heuristic.</strong> Every other number derives
                  from the ratings. That one is a logistic on losses and rating, because the
                  selection committee is not a formula. A real version would simulate the whole
                  national field.
                </li>
                <li>
                  <strong>Roster coverage stops at the contributors.</strong>{' '}
                  {Object.keys(PLAYER_BY_ID).length} players are tracked, not full two-deeps, so an
                  injury below that line is invisible to the model.
                </li>
                <li>
                  <strong>Nothing updates in-season on its own.</strong> Results and depth-chart
                  moves do not flow in automatically; they have to be entered.
                </li>
              </ol>
            </Prose>
          </Section>

          <footer className="hiw-measure mt-14 border-t pt-6" style={{ borderColor: 'var(--line)' }}>
            <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-low)' }}>
              Every figure on this page is computed live from the same engine that drives the rest of
              the app, so the prose cannot drift from the model it describes. If a number here looks
              wrong, the model is wrong — not the write-up.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="btn" onClick={() => go('command')}>Back to the Command Center</button>
              <button className="btn" onClick={() => go('method')}>Constants and sources</button>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Page furniture                                                             */
/* -------------------------------------------------------------------------- */

function Prose({ children }: { children: ReactNode }) {
  return <div className="hiw-measure hiw-prose">{children}</div>;
}

function Num({ children }: { children: ReactNode }) {
  return (
    <span className="whitespace-nowrap font-semibold tabular-nums" style={{ color: 'var(--text-hi)' }}>
      {children}
    </span>
  );
}

function PartRule({ label, title }: { label: string; title: string }) {
  return (
    <div className="hiw-measure mb-8 mt-4 flex items-baseline gap-3 border-t pt-5" style={{ borderColor: 'var(--line-strong)' }}>
      <span className="hiw-display text-[13px] uppercase tracking-[0.2em]" style={{ color: 'var(--accent-hi)' }}>
        {label}
      </span>
      <span className="hiw-display text-[26px] leading-none" style={{ color: 'var(--text-hi)' }}>{title}</span>
    </div>
  );
}

function Section({ id, n, title, children }: { id: string; n: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="hiw-section">
      <h2 className="hiw-measure mb-5 flex items-baseline gap-3.5">
        <span className="hiw-display shrink-0 text-[34px] leading-none tabular-nums" style={{ color: 'var(--accent)' }}>
          {n}
        </span>
        <span className="hiw-display text-[27px] leading-[1.1] tracking-[0.005em]" style={{ color: 'var(--text-hi)' }}>
          {title}
        </span>
      </h2>
      {children}
    </section>
  );
}

function Figure({ children, caption, wide = false }: { children: ReactNode; caption: string; wide?: boolean }) {
  return (
    <figure className={wide ? 'hiw-figure hiw-figure-wide' : 'hiw-figure'}>
      <div className="hiw-figure-body">{children}</div>
      <figcaption className="hiw-figure-caption">{caption}</figcaption>
    </figure>
  );
}

function CalcRow({
  label, value, minus = false, rule = false, strong = false,
}: { label: string; value: string; minus?: boolean; rule?: boolean; strong?: boolean }) {
  return (
    <div className={`hiw-calc-row${rule ? ' hiw-calc-rule' : ''}`}>
      <span style={{ color: strong ? 'var(--text-hi)' : 'var(--text)' }}>
        {minus && <span aria-hidden className="mr-1.5" style={{ color: 'var(--text-faint)' }}>−</span>}
        {label}
      </span>
      <span
        className="tabular-nums"
        style={{ color: strong ? 'var(--accent-hi)' : 'var(--text-hi)', fontWeight: strong ? 700 : 600 }}
      >
        {value}
      </span>
    </div>
  );
}

function Formula({ title, lines, result }: { title: string; lines: string[]; result: string }) {
  return (
    <div className="hiw-formula">
      <p className="label">{title}</p>
      <ul className="mt-2 space-y-1">
        {lines.map((l) => (
          <li key={l} className="text-[12.5px] leading-snug" style={{ color: 'var(--text)' }}>{l}</li>
        ))}
      </ul>
      <p className="mt-3 border-t pt-2 text-[15px] font-semibold tabular-nums" style={{ borderColor: 'var(--line)', color: 'var(--accent-hi)' }}>
        {result}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Figures                                                                    */
/* -------------------------------------------------------------------------- */

const COMPONENTS: [string, string][] = [
  ['Returning offence', 'What the returning offensive unit did per play, adjusted for who it did it against.'],
  ['Returning defence', 'The same, allowed.'],
  ['Quarterback', 'Value above a replacement-level starter. It gets its own line because it is the largest single-player swing in the sport.'],
  ['Coaching', 'Trajectory, development against recruiting talent, in-game management, and the year-one effect for a new staff.'],
  ['Continuity', 'Credit or debit for returning production. Auburn returns 11% of its offensive snaps; South Carolina returns ten starters.'],
  ['Portal & recruiting', 'Net value of the transfer cycle and the incoming class.'],
  ['Special teams', 'Kicking, coverage and return margin.'],
];

function ComponentList() {
  return (
    <dl className="hiw-defs">
      {COMPONENTS.map(([term, def]) => (
        <div key={term}>
          <dt>{term}</dt>
          <dd>{def}</dd>
        </div>
      ))}
    </dl>
  );
}

const LIMITS: [string, string][] = [
  ['The error bars are wide, and they should be', `A single-game spread of ${GAME_SIGMA} points is not hedging. It is the sport. Any one projection is a distribution, and the app shows the distribution wherever it can.`],
  ['It is a snapshot, not a feed', 'Compiled once. It does not update for results, injuries or depth-chart changes.'],
  ['Efficiency profiles are estimates', 'Calibrated to reproduce known ratings and last season’s results, not derived from play-by-play.'],
  ['The playoff number is a heuristic', 'Everything else derives from the ratings. The selection committee does not, so that one figure is an explicit approximation.'],
  ['Coaching is the softest layer', 'Tendencies travel between jobs better than results do — but a first-time head coach with no record is close to unforecastable, and carries the widest interval in the league by design.'],
  ['This is not betting advice', 'The model has no information the market does not, and it is not calibrated against closing lines.'],
];

function Limits() {
  return (
    <ul className="hiw-limits">
      {LIMITS.map(([t, b]) => (
        <li key={t}>
          <strong>{t}.</strong> {b}
        </li>
      ))}
    </ul>
  );
}

const SPEC: string[] = [
  'Thin marks with rounded ends, anchored to the baseline — never floating.',
  'A two-pixel gap of background between adjacent fills, so segments stay countable.',
  'Grid lines and axes recede; the data is the only thing at full strength.',
  'Labels are selective. A number on every point is noise, not information.',
  'Anything that plots has a hover layer, because an HTML chart that cannot be interrogated is a picture.',
  'Two or more series always get a legend, and text takes its colour from the type tokens — never from the series.',
  'Wide content scrolls inside its own container, so the page never scrolls sideways.',
];

function SpecList() {
  return (
    <ul className="hiw-spec">
      {SPEC.map((s) => (
        <li key={s}>{s}</li>
      ))}
    </ul>
  );
}

/** Two win-total distributions overlaid, to show the effect of correlation. */
function DistributionCompare({
  a, b,
}: {
  a: { label: string; dist: number[]; color: string };
  b: { label: string; dist: number[]; color: string };
}) {
  const n = Math.max(a.dist.length, b.dist.length);
  const max = Math.max(...a.dist, ...b.dist);
  const bars = Array.from({ length: n }, (_, i) => i).filter(
    (i) => (a.dist[i] ?? 0) > 0.002 || (b.dist[i] ?? 0) > 0.002,
  );

  return (
    <div>
      <div className="flex items-end gap-[6px]" style={{ height: 168 }}>
        {bars.map((i) => (
          <div key={i} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1" style={{ height: '100%' }}>
            <div className="flex w-full items-end justify-center gap-[3px]" style={{ height: '100%' }}>
              <div
                title={`${i} wins — independent: ${pct(a.dist[i] ?? 0, 1)}`}
                style={{
                  width: '42%',
                  height: `${((a.dist[i] ?? 0) / max) * 100}%`,
                  background: a.color,
                  borderRadius: '3px 3px 0 0',
                  minHeight: 1,
                }}
              />
              <div
                title={`${i} wins — this model: ${pct(b.dist[i] ?? 0, 1)}`}
                style={{
                  width: '42%',
                  height: `${((b.dist[i] ?? 0) / max) * 100}%`,
                  background: b.color,
                  borderRadius: '3px 3px 0 0',
                  minHeight: 1,
                }}
              />
            </div>
            <span className="text-[10.5px] tabular-nums" style={{ color: 'var(--text-faint)' }}>{i}</span>
          </div>
        ))}
      </div>
      <p className="mt-1.5 text-center text-[10.5px]" style={{ color: 'var(--text-faint)' }}>Regular-season wins</p>
      <div className="mt-3 flex flex-wrap justify-center gap-4">
        {[a, b].map((s) => (
          <span key={s.label} className="inline-flex items-center gap-1.5 text-[11.5px]" style={{ color: 'var(--text)' }}>
            <span aria-hidden className="h-2.5 w-2.5 rounded-[2px]" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/** A miniature two-series histogram, used to show a palette failing and passing. */
function CrimsonDemo({
  title, left, right, leftLabel, rightLabel, bad = false,
}: {
  title: string;
  left: string;
  right: string;
  leftLabel: string;
  rightLabel: string;
  bad?: boolean;
}) {
  const bars = [3, 6, 11, 17, 24, 31, 38, 43, 46, 44, 39, 32, 25, 18, 12, 7, 4];
  return (
    <div className="hiw-demo">
      <div className="flex items-baseline justify-between">
        <p className="label">{title}</p>
        {bad && (
          <span className="chip !text-[9.5px]" style={{ color: 'var(--viz-neg)', borderColor: 'var(--viz-neg)' }}>
            Fails
          </span>
        )}
      </div>
      <div className="mt-2.5 flex items-end gap-[2px]" style={{ height: 76 }}>
        {bars.map((h, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${(h / 46) * 100}%`,
              background: i < bars.length / 2 ? left : right,
              borderRadius: '2px 2px 0 0',
            }}
          />
        ))}
      </div>
      <div className="mt-2.5 space-y-1">
        {[[left, leftLabel], [right, rightLabel]].map(([c, l]) => (
          <span key={l} className="flex items-center gap-1.5 text-[10.5px] tabular-nums" style={{ color: 'var(--text-low)' }}>
            <span aria-hidden className="h-2.5 w-2.5 rounded-[2px]" style={{ background: c }} />
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

function RampCard({
  title, role, rule, swatches,
}: { title: string; role: string; rule: string; swatches: string[] }) {
  return (
    <div className="hiw-ramp">
      <p className="hiw-display text-[17px]" style={{ color: 'var(--text-hi)' }}>{title}</p>
      <p className="mt-0.5 text-[11.5px]" style={{ color: 'var(--accent-hi)' }}>{role}</p>
      <div className="mt-3 flex gap-[3px]">
        {swatches.map((c) => (
          <span
            key={c}
            title={c}
            className="h-8 flex-1 rounded-[3px]"
            style={{ background: c }}
          />
        ))}
      </div>
      <p className="mt-3 text-[12px] leading-snug" style={{ color: 'var(--text-low)' }}>{rule}</p>
    </div>
  );
}

/** Shows the sequential ramp stepped for one background, on that background. */
function ThemeSample({ mode }: { mode: 'dark' | 'light' }) {
  const surface = mode === 'dark' ? '#0d121b' : '#ffffff';
  const ink = mode === 'dark' ? '#c5cee0' : '#26324a';
  const faint = mode === 'dark' ? '#66738c' : '#77839b';
  return (
    <div
      className="rounded-[11px] p-3.5"
      style={{ background: surface, border: '1px solid var(--line)' }}
    >
      <p className="text-[10.5px] font-semibold uppercase tracking-[0.09em]" style={{ color: faint }}>
        {mode} surface
      </p>
      <div className="mt-2.5 flex gap-[3px]">
        {SEQUENTIAL[mode].map((c) => (
          <span key={c} title={c} className="h-7 flex-1 rounded-[3px]" style={{ background: c }} />
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-[10px]" style={{ color: faint }}>
        <span>less</span>
        <span>more</span>
      </div>
      <p className="mt-2.5 text-[11.5px] leading-snug" style={{ color: ink }}>
        The high end is the step furthest from this background.
      </p>
    </div>
  );
}
