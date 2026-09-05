import { Divider, InfoDot, Label, Panel, PanelHead, ProvenanceTag, Table, Td, Th } from '../components/ui';
import { MEASURED_META } from '../data/measured';
import { ALL_PLAYERS } from '../data/players';
import { CONFERENCE_GAMES, NON_CONFERENCE_GAMES } from '../data/schedule';
import { TEAMS } from '../data/teams';
import { COACHES } from '../data/coaches';
import { DATASET } from '../data/meta';
import {
  GAME_SIGMA, LEAGUE_DRIVES, LEAGUE_PLAYS, LEAGUE_PPG, REST_BONUS, TEAM_SIGMA, BASE_DRIVE,
} from '../engine/constants';
import { useStore } from '../state/store';

/* The model, stated plainly enough to be argued with. */

export function Methodology() {
  const { season, state, go } = useStore();
  const verifiedPlayers = ALL_PLAYERS.filter((p) => p.provenance === 'verified').length;

  return (
    <div className="space-y-4">
      {/* ---- Pipeline ------------------------------------------------------- */}
      <Panel>
        <PanelHead
          right={
            <button className="btn !py-1 !text-[11px]" onClick={() => go('how')}>
              Read the long-form explainer →
            </button>
          }
          title="Three layers, in order"
          subtitle="Each layer takes the one above it as input. Nothing is fitted to a hidden training set — every number is either sourced, authored, or derived from the two."
        />
        <div className="px-5 pb-5">
          <Pipeline />
        </div>
      </Panel>

      {/* ---- Ratings -------------------------------------------------------- */}
      <Panel>
        <PanelHead
          title="1 · The team rating"
          subtitle="A team's rating is points per game above an average FBS opponent on a neutral field — the same units as SP+ or a betting line. It is the sum of seven named components."
        />
        <Table>
          <thead>
            <tr>
              <Th width={200}>Component</Th>
              <Th align="center" width={110}>Side of the ball</Th>
              <Th>What it captures</Th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Returning offence', 'Offence', 'Opponent-adjusted per-play efficiency of the returning offensive unit — EPA per play, success rate, explosiveness, finishing drives, line yards.'],
              ['Returning defence', 'Defence', 'The same, allowed. Havoc rate and line yards allowed carry most of the weight.'],
              ['Quarterback', 'Offence', 'Value above a replacement-level SEC starter. The single largest one-player swing in the sport, so it gets its own component rather than hiding inside the offence.'],
              ['Coaching', '55% offence', 'Program trajectory, player development against recruiting talent, in-game management, and the first-year effect for a new staff.'],
              ['Continuity', 'Split evenly', 'Credit or debit for returning production. Auburn returns 11% of its offensive snaps; South Carolina returns ten starters. That gap is real and it is priced here.'],
              ['Portal & recruiting', 'Split evenly', 'Net value of the transfer cycle and the incoming class. LSU signed the consensus number-one portal class; that is worth 2.1 points.'],
              ['Special teams', 'Its own bucket', 'Kicking, coverage and return margin, in points per game.'],
            ].map(([a, b, c]) => (
              <tr key={a} className="row-hover">
                <Td mono={false} className="font-semibold" style={{ color: 'var(--text-hi)' }}>{a}</Td>
                <Td align="center" mono={false} style={{ color: 'var(--text-low)' }}>{b}</Td>
                <Td mono={false} style={{ color: 'var(--text)' }}>{c}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="px-5 py-4" style={{ borderTop: '1px solid var(--line-faint)' }}>
          <p className="text-[12.5px] leading-relaxed" style={{ color: 'var(--text)' }}>
            Keeping the components separate is not decoration. It is what lets the Team Lab show a waterfall instead of a
            single number, and it is what lets a scenario move exactly one thing at a time. Ruling a player out subtracts
            their <strong style={{ color: 'var(--text-hi)' }}>Points Above Replacement</strong> from the appropriate side
            of the ball and nothing else — the arithmetic is visible and checkable.
          </p>
          <p className="mt-2.5 text-[12.5px] leading-relaxed" style={{ color: 'var(--text)' }}>
            <strong style={{ color: 'var(--text-hi)' }}>PAR</strong> is defined as the points of team rating lost across a
            full season if that player were replaced by the next man up. A limited player is priced at 40% of it. Values
            run from about 8.6 for the most valuable quarterback in the league down to a few tenths for a rotational piece.
          </p>
        </div>
      </Panel>

      {/* ---- Game model ------------------------------------------------------ */}
      <Panel>
        <PanelHead
          title="2 · The game model"
          subtitle="Two layers that must agree: a closed form that is fast enough to run on every keystroke, and a drive-level simulation that produces the actual distribution."
        />
        <div className="grid gap-5 px-5 py-4 lg:grid-cols-2">
          <div>
            <Label>Closed form</Label>
            <div
              className="mt-2 rounded-[10px] px-3.5 py-3 font-mono text-[11.5px] leading-relaxed"
              style={{ background: 'var(--bg-sunken)', border: '1px solid var(--line)', color: 'var(--text)' }}
            >
              <div>margin = (rating<sub>home</sub> − rating<sub>away</sub> + hfa + rest) × weather</div>
              <div className="mt-1.5">total = (2·PPG + off<sub>h</sub> + off<sub>a</sub> − def<sub>h</sub> − def<sub>a</sub>) × tempo × weather</div>
              <div className="mt-1.5">P(home) = Φ(margin ⁄ σ)</div>
            </div>
            <p className="mt-2.5 text-[12px] leading-relaxed" style={{ color: 'var(--text-low)' }}>
              Margin is deliberately pure rating arithmetic, so any projection can be read back as “this team is N points
              better, plus home field”. Tempo does not inflate the favourite's margin — it changes how many points get
              scored, and it widens the distribution through the number of possessions.
            </p>
          </div>
          <div>
            <Label>Drive simulation</Label>
            <p className="mt-2 text-[12px] leading-relaxed" style={{ color: 'var(--text)' }}>
              Each simulated game plays out possession by possession. Drive outcomes start from a league-average
              distribution — {pctOf(BASE_DRIVE.td)} touchdown, {pctOf(BASE_DRIVE.fg)} field goal,
              {' '}{pctOf(BASE_DRIVE.punt + BASE_DRIVE.turnover + BASE_DRIVE.other)} no points — and are shifted by
              solving for the logit that reproduces each team's projected points per drive exactly.
            </p>
            <p className="mt-2.5 text-[12px] leading-relaxed" style={{ color: 'var(--text)' }}>
              The extra per-team noise is not a fixed constant: it is solved so that the simulated margin standard
              deviation lands on the same σ the closed form uses. That is why the two layers agree on the spread, the
              total and the win probability — and why the histogram still shows the real spikes on three, seven and ten
              that a normal curve smooths away.
            </p>
          </div>
        </div>
      </Panel>

      {/* ---- Season ---------------------------------------------------------- */}
      <Panel>
        <PanelHead
          title="3 · The season simulation"
          subtitle={`${season.iterations.toLocaleString()} full seasons per run, on a background thread so the interface stays responsive.`}
        />
        <div className="px-5 py-4">
          <p className="text-[12.5px] leading-relaxed" style={{ color: 'var(--text)' }}>
            The important decision here is that <strong style={{ color: 'var(--text-hi)' }}>a team's true strength is
            drawn once per simulated season, not once per game</strong>. A team that is three points better than its
            rating is three points better every week. Without that correlation, simulated win totals cluster far too
            tightly and every team looks like a seven-win team. The per-game residual is then sized so total variance
            still matches σ.
          </p>
          <p className="mt-2.5 text-[12.5px] leading-relaxed" style={{ color: 'var(--text)' }}>
            Conference standings are ordered by winning percentage, with ties broken by head-to-head record among the
            tied group, then overall record, then rating — a faithful simplification of the SEC's published procedure.
            The top two meet in Atlanta on 5 December.
          </p>
          <div className="mt-4 rounded-[10px] px-4 py-3" style={{ background: 'var(--bg-panel-2)', border: '1px solid var(--line)' }}>
            <div className="flex items-center gap-2">
              <Label>Playoff probability is a heuristic</Label>
              <InfoDot text="This is the one place the model is not derived from first principles." />
            </div>
            <p className="mt-1.5 text-[12px] leading-relaxed" style={{ color: 'var(--text)' }}>
              The selection committee is not a formula, so the playoff number is an explicit logistic on losses, wins,
              conference title and final rating — losses dominate, because that is how the committee behaves. It is
              anchored so a 12–1 conference champion is a near-lock, an 11–1 team at +20 sits around 94%, 10–3 at +18 is
              roughly a third, and 9–4 needs help. Across a simulated season it yields about
              {' '}{TEAMS.reduce((s, t) => s + season.teams[t.id].pPlayoff, 0).toFixed(1)} SEC bids. Treat it as an
              order-of-magnitude estimate, not a forecast.
            </p>
          </div>
        </div>
      </Panel>

      {/* ---- Constants -------------------------------------------------------- */}
      <Panel>
        <PanelHead
          title="Every constant in the model"
          subtitle="No hidden parameters. If you disagree with one of these, you know exactly which number to argue with."
        />
        <Table>
          <thead>
            <tr>
              <Th width={230}>Constant</Th>
              <Th align="right" width={90}>Value</Th>
              <Th>Why</Th>
            </tr>
          </thead>
          <tbody>
            {[
              ['League points per game', LEAGUE_PPG.toFixed(1), 'Points scored per team per game by an average FBS offence against an average defence.'],
              ['League plays per game', LEAGUE_PLAYS.toFixed(1), 'Offensive snaps per team per game at league-average tempo. Sets the tempo baseline.'],
              ['League drives per game', LEAGUE_DRIVES.toFixed(1), 'Possessions per team per game. Drives the possession count in the simulation.'],
              ['Single-game σ', GAME_SIGMA.toFixed(1), 'Standard deviation of actual minus projected margin. Empirically 15 to 17 points in FBS; this puts one point of spread at roughly 2.5% of win probability near a pick’em, matching market behaviour.'],
              ['Season-level team σ', TEAM_SIGMA.toFixed(1), 'Uncertainty in a team’s true strength, drawn once per simulated season. The correlation that makes win-total distributions realistic.'],
              ['Bye-week value', REST_BONUS.toFixed(1), 'Points of value in coming off an open date.'],
              ['Baseline TD rate per drive', pctOf(BASE_DRIVE.td), 'Starting point for the drive distribution, before the team-specific shift.'],
              ['Baseline FG rate per drive', pctOf(BASE_DRIVE.fg), 'Together these produce 2.07 points per drive, the FBS average.'],
            ].map(([a, b, c]) => (
              <tr key={a} className="row-hover">
                <Td mono={false} style={{ color: 'var(--text-hi)' }}>{a}</Td>
                <Td align="right" className="font-bold" style={{ color: 'var(--accent-hi)' }}>{b}</Td>
                <Td mono={false} style={{ color: 'var(--text-low)' }}>{c}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Panel>

      {/* ---- Data ------------------------------------------------------------- */}
      <Panel>
        <PanelHead
          title="Where the data comes from"
          subtitle="Every record carries a provenance flag, and the interface shows it wherever the record appears."
        />
        <div className="grid gap-px" style={{ background: 'var(--line-faint)', gridTemplateColumns: 'repeat(auto-fit, minmax(168px, 1fr))' }}>
          {[
            { l: 'Teams', v: `${TEAMS.length}`, s: 'all verified' },
            { l: 'Conference games', v: `${CONFERENCE_GAMES.length}`, s: 'nine per team, cross-checked' },
            { l: 'Non-conference games', v: `${NON_CONFERENCE_GAMES.length}`, s: 'with rated opponents' },
            { l: 'Coaches', v: `${COACHES.length}`, s: `${COACHES.filter((c) => c.tenureYear === 1).length} in year one` },
            { l: 'Tracked players', v: `${ALL_PLAYERS.length}`, s: `${verifiedPlayers} verified identities` },
            { l: 'Compiled', v: DATASET.compiled, s: 'a static snapshot' },
          ].map((x) => (
            <div key={x.l} className="px-4 py-3" style={{ background: 'var(--bg-panel)' }}>
              <Label>{x.l}</Label>
              <div className="mt-1 text-[20px] font-semibold tabular-nums" style={{ color: 'var(--text-hi)' }}>{x.v}</div>
              <div className="mt-0.5 text-[11px]" style={{ color: 'var(--text-low)' }}>{x.s}</div>
            </div>
          ))}
        </div>

        <Divider />
        <div className="grid gap-4 px-5 py-4 md:grid-cols-3">
          <div className="rounded-[10px] p-3.5" style={{ background: 'var(--bg-panel-2)', border: '1px solid var(--line)' }}>
            <div className="flex items-center gap-2">
              <ProvenanceTag value="measured" />
              <span className="text-[12.5px] font-semibold" style={{ color: 'var(--text-hi)' }}>Measured</span>
            </div>
            <p className="mt-2 text-[12px] leading-relaxed" style={{ color: 'var(--text)' }}>
              Per-play efficiency, 2025 results, returning production and recruiting composites are counted directly off{' '}
              {MEASURED_META.plays.toLocaleString()} plays of {MEASURED_META.priorSeason} play-by-play, across{' '}
              {MEASURED_META.games.toLocaleString()} games and {MEASURED_META.teams} teams. Quality metrics are
              opponent-adjusted so an SEC schedule stops being counted as a weakness. Nothing in this tier was typed by
              hand — <code>npm&nbsp;run&nbsp;etl</code> regenerates all of it.
            </p>
          </div>
          <div className="rounded-[10px] p-3.5" style={{ background: 'var(--bg-panel-2)', border: '1px solid var(--line)' }}>
            <div className="flex items-center gap-2">
              <ProvenanceTag value="verified" />
              <span className="text-[12.5px] font-semibold" style={{ color: 'var(--text-hi)' }}>Verified</span>
            </div>
            <p className="mt-2 text-[12px] leading-relaxed" style={{ color: 'var(--text)' }}>
              Sourced from the public reporting listed below while this dataset was compiled: the 2026 schedule release
              and all sixteen team schedules, the Preseason Coaches All-SEC teams, announced Week 1 starting
              quarterbacks, reported portal additions, 2025 final standings, and the coaching carousel.
            </p>
          </div>
          <div className="rounded-[10px] p-3.5" style={{ background: 'var(--bg-panel-2)', border: '1px solid var(--line)' }}>
            <div className="flex items-center gap-2">
              <ProvenanceTag value="modeled" />
              <span className="text-[12.5px] font-semibold" style={{ color: 'var(--text-hi)' }}>Modeled</span>
            </div>
            <p className="mt-2 text-[12px] leading-relaxed" style={{ color: 'var(--text)' }}>
              Usage shares, player grades, PAR values, coach tendency indices and all seven rating components are analyst
              estimates calibrated against the measured and verified layers. They are model inputs, not measurements, and
              they are labelled as such everywhere they appear.
            </p>
          </div>
        </div>

        <Divider />
        <Table>
          <thead>
            <tr>
              <Th>Source</Th>
              <Th width={230}>Covers</Th>
            </tr>
          </thead>
          <tbody>
            {DATASET.sources.map((s) => (
              <tr key={s.url} className="row-hover">
                <Td mono={false}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-dotted underline-offset-2 transition-colors hover:text-[var(--accent-hi)]"
                    style={{ color: 'var(--text)' }}
                  >
                    {s.label}
                  </a>
                </Td>
                <Td mono={false} style={{ color: 'var(--text-low)' }}>{s.covers}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Panel>

      {/* ---- Limitations ------------------------------------------------------ */}
      <Panel>
        <PanelHead
          title="What this model cannot do"
          subtitle="Stated plainly, because a forecast without its limitations is just a number."
        />
        <div className="px-5 pb-5">
          <ul className="space-y-3">
            {[
              ['It is a snapshot, not a feed.', 'The dataset was compiled on 5 September 2026 and does not update for results, injuries or depth-chart changes. The Scenario Studio exists so you can impose those yourself.'],
              ['Roster coverage is curated, not exhaustive.', `${ALL_PLAYERS.length} players across sixteen teams — the contributors who move a projection, not every scholarship athlete. A deep bench injury will not show up because that player is not tracked.`],
              ['Player grades are estimates.', 'Team efficiency is counted off the 2025 play-by-play and opponent-adjusted. The per-player grades layered on top of it are not measured — they are analyst judgements, and they drive roster strength, the quarterback term and every PAR figure.'],
              ['The error bars are wide, and they should be.', 'A single-game σ of 15.8 points means a 10-point favourite loses about 26% of the time. Any single projection is a distribution, and the interface shows the distribution wherever it can.'],
              ['Coaching effects are the softest layer.', 'Tendencies travel between jobs far better than results do, but a first-year head coach with no head-coaching record — Kentucky’s, in this dataset — is genuinely close to unforecastable. That team carries the widest interval in the league by design.'],
              ['The playoff number is a heuristic.', 'Everything else derives from the ratings. The committee does not, so that one figure is an explicit approximation and is labelled as one wherever it appears.'],
              ['This is not betting advice.', 'The model is built to explain and to stress-test assumptions. It has no information the market does not have, and it is not calibrated against closing lines.'],
            ].map(([t, b]) => (
              <li key={t} className="flex gap-3">
                <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: 'var(--viz-neg)' }} />
                <span>
                  <strong className="text-[12.5px]" style={{ color: 'var(--text-hi)' }}>{t}</strong>
                  <span className="ml-1.5 text-[12.5px] leading-relaxed" style={{ color: 'var(--text)' }}>{b}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Panel>

      {/* ---- Reproducibility --------------------------------------------------- */}
      <Panel>
        <PanelHead title="Reproducibility" subtitle="Every projection in this app is deterministic." />
        <div className="px-5 pb-5">
          <p className="text-[12.5px] leading-relaxed" style={{ color: 'var(--text)' }}>
            All randomness comes from a seeded mulberry32 generator. The same seed and the same scenario always produce
            the same numbers, which is the only way a “what changed?” comparison means anything. The current seed is{' '}
            <span className="font-mono font-semibold" style={{ color: 'var(--accent-hi)' }}>{state.scenario.seed}</span>;
            the Reseed button in the Scenario Studio reshuffles the noise without touching the model, which is a quick way
            to see how much of a difference is signal and how much is Monte Carlo error.
          </p>
        </div>
      </Panel>
    </div>
  );
}

function pctOf(v: number) {
  return `${Math.round(v * 100)}%`;
}

/* -------------------------------------------------------------------------- */

function Pipeline() {
  const stages = [
    {
      n: '1',
      title: 'Team rating',
      body: 'Seven components sum to points above average on a neutral field.',
      out: 'A single number per team, plus the decomposition behind it.',
    },
    {
      n: '2',
      title: 'Game model',
      body: 'Rating gap plus home field, rest and weather. Then a drive-level simulation calibrated to the same expectation.',
      out: 'Spread, total, win probability and the full score distribution.',
    },
    {
      n: '3',
      title: 'Season simulation',
      body: 'Every game, thousands of times, with each team’s true strength drawn once per season.',
      out: 'Records, standings, title odds and playoff probabilities.',
    },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {stages.map((s, i) => (
        <div key={s.n} className="relative">
          <div
            className="h-full rounded-[12px] p-4"
            style={{ background: 'var(--bg-panel-2)', border: '1px solid var(--line)' }}
          >
            <span
              className="grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold"
              style={{ background: 'var(--accent-dim)', color: 'var(--accent-hi)', border: '1px solid var(--accent)' }}
            >
              {s.n}
            </span>
            <h3 className="mt-2.5 text-[13.5px] font-bold" style={{ color: 'var(--text-hi)' }}>{s.title}</h3>
            <p className="mt-1.5 text-[12px] leading-relaxed" style={{ color: 'var(--text)' }}>{s.body}</p>
            <div className="mt-3 pt-2.5" style={{ borderTop: '1px dashed var(--line)' }}>
              <Label>Produces</Label>
              <p className="mt-1 text-[11.5px] leading-snug" style={{ color: 'var(--text-low)' }}>{s.out}</p>
            </div>
          </div>
          {i < stages.length - 1 && (
            <span
              aria-hidden
              className="absolute -right-[13px] top-1/2 hidden -translate-y-1/2 text-[16px] md:block"
              style={{ color: 'var(--text-faint)' }}
            >
              →
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
