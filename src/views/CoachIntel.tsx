import { useMemo, useState } from 'react';
import { BarList, Radar, Sparkline } from '../components/charts';
import { Divider, InfoDot, Label, Panel, PanelHead, ProvenanceTag, Segmented, Stat, Table, Td, Th, TeamMark } from '../components/ui';
import { COACHES, COACH_BY_TEAM } from '../data/coaches';
import { TEAM_BY_ID } from '../data/teams';
import { CONFERENCE_BY_ID } from '../data/conferences';
import { DERIVED } from '../engine/model';
import type { Coach } from '../data/types';
import { CATEGORICAL, pct, signed, teamInk } from '../lib/viz';
import { useStore } from '../state/store';

/* ============================================================================
 * Coach Intelligence.
 *
 * Rosters turn over every year; staffs do not. This view is the argument for
 * why a first-year head coach is still forecastable at all — the tendencies
 * travel even when the players do not.
 * ========================================================================== */

const TENDENCY_AXES = [
  { key: 'pace', label: 'Tempo' },
  { key: 'passIdentity', label: 'Pass-first' },
  { key: 'fourthDown', label: '4th-down' },
  { key: 'pressure', label: 'Pressure' },
  { key: 'portalReliance', label: 'Portal' },
  { key: 'development', label: 'Development' },
  { key: 'acquisition', label: 'Recruiting' },
  { key: 'underdogEdge', label: 'Underdog' },
] as const;

type Lens = 'profile' | 'tendencies' | 'firstYear';

export function CoachIntel() {
  const { state, dispatch, season } = useStore();
  const mode = state.theme;
  const [lens, setLens] = useState<Lens>('profile');
  const coach = COACH_BY_TEAM[state.selectedTeam];

  const [compareId, setCompareId] = useState<string>(
    COACHES.find((c) => c.id !== coach.id)?.id ?? COACHES[0].id,
  );
  const compare = COACHES.find((c) => c.id === compareId)!;

  const firstYear = useMemo(() => COACHES.filter((c) => c.tenureYear === 1), []);

  const winPct = (c: Coach) => (c.career.wins + c.career.losses > 0 ? c.career.wins / (c.career.wins + c.career.losses) : 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Segmented
          ariaLabel="Coach view"
          value={lens}
          onChange={setLens}
          options={[
            { value: 'profile', label: 'Profile' },
            { value: 'tendencies', label: 'Tendencies' },
            { value: 'firstYear', label: 'First-year staffs' },
          ]}
        />
        <div className="ml-auto flex flex-wrap gap-1.5">
          {COACHES.map((c) => {
            const t = TEAM_BY_ID[c.teamId];
            return (
              <button
                key={c.id}
                onClick={() => dispatch({ type: 'selectTeam', teamId: c.teamId })}
                className="chip"
                style={c.id === coach.id ? { borderColor: t.primary, color: 'var(--text-hi)' } : undefined}
                title={c.name}
              >
                <TeamMark team={t} size={8} />
                {t.abbr}
              </button>
            );
          })}
        </div>
      </div>

      {lens === 'profile' && <CoachProfile coach={coach} />}

      {lens === 'tendencies' && (
        <>
          <Panel>
            <PanelHead
              title="Tendency comparison"
              subtitle="Each axis is indexed against the FBS mean, then rescaled to 0–1. These are the parts of a program that survive a coaching change."
              right={
                <select
                  className="field !w-auto !py-1 !text-[12px]"
                  value={compareId}
                  onChange={(e) => setCompareId(e.target.value)}
                  aria-label="Compare against"
                >
                  {COACHES.filter((c) => c.id !== coach.id).map((c) => (
                    <option key={c.id} value={c.id}>{c.name} — {TEAM_BY_ID[c.teamId].abbr}</option>
                  ))}
                </select>
              }
            />
            <div className="grid gap-5 px-5 pb-5 lg:grid-cols-[auto_1fr] lg:items-center">
              <Radar
                size={290}
                axes={TENDENCY_AXES.map((a) => ({ key: a.key, label: a.label }))}
                series={[coach, compare].map((c, i) => ({
                  key: c.id,
                  label: `${c.name} (${TEAM_BY_ID[c.teamId].abbr})`,
                  color: CATEGORICAL[mode][i],
                  values: TENDENCY_AXES.map((a) => (c.tendencies[a.key] + 1) / 2),
                }))}
              />
              <Table>
                <thead>
                  <tr>
                    <Th>Tendency</Th>
                    <Th align="right">
                      <span className="inline-flex items-center gap-1.5">
                        <span aria-hidden className="h-2 w-2 rounded-[2px]" style={{ background: CATEGORICAL[mode][0] }} />
                        {coach.name.split(' ').slice(-1)}
                      </span>
                    </Th>
                    <Th align="right">
                      <span className="inline-flex items-center gap-1.5">
                        <span aria-hidden className="h-2 w-2 rounded-[2px]" style={{ background: CATEGORICAL[mode][1] }} />
                        {compare.name.split(' ').slice(-1)}
                      </span>
                    </Th>
                  </tr>
                </thead>
                <tbody>
                  {TENDENCY_AXES.map((a) => (
                    <tr key={a.key} className="row-hover">
                      <Td mono={false} style={{ color: 'var(--text)' }}>{a.label}</Td>
                      <Td align="right" style={{ color: 'var(--text-hi)' }}>{signed(coach.tendencies[a.key], 2)}</Td>
                      <Td align="right" style={{ color: 'var(--text-hi)' }}>{signed(compare.tendencies[a.key], 2)}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Panel>

          <div className="grid gap-4 lg:grid-cols-2">
            {([
              { key: 'pace', title: 'Tempo', blurb: 'Positive is faster than the FBS mean. Tempo drives totals far more than it drives margins.' },
              { key: 'fourthDown', title: 'Fourth-down aggression', blurb: 'Against the analytics-optimal baseline. Aggression is worth a fraction of a point of expected value — and a lot of variance.' },
              { key: 'development', title: 'Player development', blurb: 'Production above what raw recruiting talent predicts. The clearest signal that travels between jobs.' },
              { key: 'portalReliance', title: 'Portal reliance', blurb: 'How much of the roster is acquired rather than developed.' },
            ] as const).map((panel) => (
              <Panel key={panel.key}>
                <PanelHead title={panel.title} subtitle={panel.blurb} dense />
                <div className="px-4 pb-4">
                  <BarList
                    min={-1}
                    max={1}
                    showZero
                    labelWidth={104}
                    valueWidth={48}
                    height={18}
                    format={(v) => signed(v, 2)}
                    data={[...COACHES]
                      .sort((a, b) => b.tendencies[panel.key] - a.tendencies[panel.key])
                      .map((c) => ({
                        key: c.id,
                        label: (
                          <span className="flex items-center gap-1.5">
                            <TeamMark team={TEAM_BY_ID[c.teamId]} size={8} />
                            <span className="truncate">{c.name}</span>
                          </span>
                        ),
                        value: c.tendencies[panel.key],
                        emphasis: c.id === coach.id,
                        onClick: () => dispatch({ type: 'selectTeam', teamId: c.teamId }),
                      }))}
                  />
                </div>
              </Panel>
            ))}
          </div>
        </>
      )}

      {lens === 'firstYear' && (
        <>
          <Panel>
            <PanelHead
              title={`${firstYear.length} first-year staffs — a record cycle`}
              subtitle="Almost half the conference changed head coaches. With no roster continuity to lean on, the model leans on what each coach did somewhere else."
            />
            <div className="grid gap-px" style={{ background: 'var(--line-faint)', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {firstYear.map((c) => {
                const t = TEAM_BY_ID[c.teamId];
                const o = season.teams[c.teamId];
                return (
                  <button
                    key={c.id}
                    onClick={() => { dispatch({ type: 'selectTeam', teamId: c.teamId }); setLens('profile'); }}
                    className="p-4 text-left transition-colors hover:bg-[var(--bg-hover)]"
                    style={{ background: 'var(--bg-panel)' }}
                  >
                    <div className="flex items-center gap-2">
                      <TeamMark team={t} size={12} />
                      <span className="text-[14px] font-bold" style={{ color: teamInk(t, mode) }}>{c.name}</span>
                      <span className="chip !text-[9.5px]">{t.abbr}</span>
                    </div>
                    <p className="mt-1.5 text-[11.5px]" style={{ color: 'var(--text-low)' }}>{c.previousRole}</p>
                    <p className="mt-2 text-[12px] leading-snug" style={{ color: 'var(--text)' }}>{c.archetypeBlurb}</p>
                    <div className="mt-3 grid grid-cols-3 gap-3">
                      <div>
                        <Label>Career</Label>
                        <div className="mt-0.5 text-[13px] font-semibold tabular-nums" style={{ color: 'var(--text-hi)' }}>
                          {c.career.wins}–{c.career.losses}
                        </div>
                      </div>
                      <div>
                        <Label>Year-one effect</Label>
                        <div
                          className="mt-0.5 text-[13px] font-semibold tabular-nums"
                          style={{ color: c.transitionEffect >= 0 ? 'var(--viz-pos)' : 'var(--viz-neg)' }}
                        >
                          {signed(c.transitionEffect)}
                        </div>
                      </div>
                      <div>
                        <Label>Projected</Label>
                        <div className="mt-0.5 text-[13px] font-semibold tabular-nums" style={{ color: 'var(--text-hi)' }}>
                          {o.meanWins.toFixed(1)} W
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Panel>

          <Panel>
            <PanelHead
              title="Uncertainty premium"
              subtitle="Volatility multiplier applied to each team's game-to-game variance. New staffs and unproven head coaches get wider error bars, in both directions."
              right={<InfoDot text="A multiplier of 1.3 means this team's single-game margin standard deviation is 30% larger than the league baseline of 15.8 points." />}
            />
            <div className="px-4 pb-4">
              <BarList
                min={0.8}
                max={1.4}
                labelWidth={116}
                valueWidth={52}
                height={18}
                format={(v) => `${v.toFixed(2)}×`}
                data={[...COACHES]
                  .sort((a, b) => b.volatility - a.volatility)
                  .map((c) => ({
                    key: c.id,
                    label: (
                      <span className="flex items-center gap-1.5">
                        <TeamMark team={TEAM_BY_ID[c.teamId]} size={8} />
                        <span className="truncate">{c.name}</span>
                      </span>
                    ),
                    value: c.volatility,
                    color: c.volatility > 1.15 ? 'var(--viz-neg)' : c.volatility < 0.95 ? 'var(--viz-pos)' : 'var(--viz-mid)',
                    emphasis: c.tenureYear === 1,
                    onClick: () => { dispatch({ type: 'selectTeam', teamId: c.teamId }); setLens('profile'); },
                  }))}
              />
            </div>
          </Panel>
        </>
      )}

      {lens === 'profile' && (
        <Panel>
          <PanelHead
            title="Every staff at a glance"
            subtitle="Career record, tenure and archetype across the conference."
          />
          <Table>
            <thead>
              <tr>
                <Th>Coach</Th>
                <Th width={130}>Team</Th>
                <Th align="center" width={54}>Year</Th>
                <Th align="right" width={84}>Career</Th>
                <Th align="right" width={60}>Win %</Th>
                <Th align="right" width={80}>vs ranked</Th>
                <Th width={168}>Archetype</Th>
                <Th align="right" width={92}>Proj wins</Th>
              </tr>
            </thead>
            <tbody>
              {[...COACHES].sort((a, b) => winPct(b) - winPct(a)).map((c) => {
                const t = TEAM_BY_ID[c.teamId];
                return (
                  <tr key={c.id} className="row-hover cursor-pointer" onClick={() => dispatch({ type: 'selectTeam', teamId: c.teamId })}>
                    <Td mono={false}>
                      <span className="font-semibold" style={{ color: 'var(--text-hi)' }}>{c.name}</span>
                    </Td>
                    <Td mono={false}>
                      <span className="flex items-center gap-1.5">
                        <TeamMark team={t} size={9} />
                        <span className="truncate" style={{ color: teamInk(t, mode) }}>{t.school}</span>
                      </span>
                    </Td>
                    <Td align="center" style={{ color: c.tenureYear === 1 ? 'var(--accent-hi)' : 'var(--text-low)' }}>
                      {c.tenureYear}
                    </Td>
                    <Td align="right" style={{ color: 'var(--text)' }}>
                      {c.career.seasons === 0 ? '—' : `${c.career.wins}–${c.career.losses}`}
                    </Td>
                    <Td align="right" style={{ color: 'var(--text-mid)' }}>
                      {c.career.seasons === 0 ? '—' : pct(winPct(c))}
                    </Td>
                    <Td align="right" style={{ color: 'var(--text-low)' }}>
                      {c.vsRanked ? `${c.vsRanked.wins}–${c.vsRanked.losses}` : '—'}
                    </Td>
                    <Td mono={false} style={{ color: 'var(--text-mid)' }}>{c.archetype}</Td>
                    <Td align="right" style={{ color: 'var(--text-hi)' }}>{season.teams[c.teamId].meanWins.toFixed(1)}</Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Panel>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function CoachProfile({ coach }: { coach: Coach }) {
  const { state, season } = useStore();
  const team = TEAM_BY_ID[coach.teamId];
  const mode = state.theme;
  const outlook = season.teams[coach.teamId];
  const seasonWins = coach.seasons.map((s) => s.wins);
  const coachingValue = DERIVED[coach.teamId].components.coaching;

  return (
    <Panel className="overflow-hidden">
      <div className="h-1" style={{ background: team.primary }} aria-hidden />
      <div className="flex flex-wrap items-start justify-between gap-5 px-5 pt-4 pb-4">
        <div className="min-w-0 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-[24px] font-bold leading-none tracking-[-0.02em]" style={{ color: 'var(--text-hi)' }}>
              {coach.name}
            </h2>
            <span className="chip"><TeamMark team={team} size={9} /> {team.school}</span>
            <span className="chip" style={{ color: 'var(--accent-hi)', borderColor: 'var(--accent)' }}>{coach.archetype}</span>
            {coach.tenureYear === 1 && <span className="chip">First year</span>}
            <ProvenanceTag value={coach.provenance} />
          </div>
          <p className="mt-2 text-[12.5px] leading-relaxed" style={{ color: 'var(--text)' }}>{coach.archetypeBlurb}</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11.5px]" style={{ color: 'var(--text-low)' }}>
            <span>{coach.almaMater}</span>
            {coach.age && <span>Age {coach.age}</span>}
            <span>Previously: {coach.previousRole}</span>
          </div>
        </div>
        {seasonWins.length > 1 && (
          <div className="text-right">
            <Label>Wins by season</Label>
            <div className="mt-1 flex justify-end">
              <Sparkline values={seasonWins} width={168} height={44} baseline={7} />
            </div>
            <p className="mt-0.5 text-[10.5px]" style={{ color: 'var(--text-faint)' }}>
              {coach.seasons[0].year}–{coach.seasons[coach.seasons.length - 1].year} · dashed line is seven wins
            </p>
          </div>
        )}
      </div>

      <Divider />
      <div className="grid gap-px" style={{ background: 'var(--line-faint)', gridTemplateColumns: 'repeat(auto-fit, minmax(146px, 1fr))' }}>
        {[
          { l: 'Career record', v: coach.career.seasons === 0 ? 'First season' : `${coach.career.wins}–${coach.career.losses}`, s: `${coach.career.seasons} season${coach.career.seasons === 1 ? '' : 's'}` },
          { l: `At ${team.abbr}`, v: coach.atSchool.wins + coach.atSchool.losses === 0 ? '—' : `${coach.atSchool.wins}–${coach.atSchool.losses}`, s: `Year ${coach.tenureYear}` },
          { l: 'Versus ranked', v: coach.vsRanked ? `${coach.vsRanked.wins}–${coach.vsRanked.losses}` : '—', s: 'AP Top 25 opponents' },
          { l: 'Versus top ten', v: coach.vsTop10 ? `${coach.vsTop10.wins}–${coach.vsTop10.losses}` : '—', s: 'The hardest games' },
          { l: 'Coaching value', v: signed(coachingValue), s: 'derived points of team rating', tone: coachingValue >= 0 ? ('positive' as const) : ('negative' as const) },
          { l: 'Volatility', v: `${coach.volatility.toFixed(2)}×`, s: 'game-to-game variance' },
          { l: '2026 projection', v: `${outlook.meanWins.toFixed(1)}–${(12 - outlook.meanWins).toFixed(1)}`, s: `${pct(outlook.pChampion, 1)} to win the ${CONFERENCE_BY_ID[TEAM_BY_ID[coach.teamId].conference].name}` },
        ].map((x) => (
          <div key={x.l} className="px-4 py-3" style={{ background: 'var(--bg-panel)' }}>
            <Stat label={x.l} value={x.v} sub={x.s} size="sm" tone={x.tone} />
          </div>
        ))}
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-[auto_1fr]">
        <Radar
          size={260}
          axes={TENDENCY_AXES.map((a) => ({ key: a.key, label: a.label }))}
          series={[{
            key: coach.id,
            label: coach.name,
            color: CATEGORICAL[mode][0],
            values: TENDENCY_AXES.map((a) => (coach.tendencies[a.key] + 1) / 2),
          }]}
        />
        <div>
          <Label>What defines this staff</Label>
          <ul className="mt-2.5 space-y-2.5">
            {coach.traits.map((t) => (
              <li key={t.label}>
                <div className="text-[12.5px] font-semibold" style={{ color: 'var(--text-hi)' }}>{t.label}</div>
                <div className="mt-0.5 text-[12px] leading-snug" style={{ color: 'var(--text-low)' }}>{t.detail}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {coach.seasons.length > 0 && (
        <>
          <Divider />
          <Table>
            <thead>
              <tr>
                <Th width={60} align="right">Year</Th>
                <Th>School</Th>
                <Th align="right" width={80}>Record</Th>
                <Th align="right" width={90}>Conference</Th>
                <Th>Note</Th>
              </tr>
            </thead>
            <tbody>
              {[...coach.seasons].reverse().map((s) => (
                <tr key={`${s.year}-${s.school}`} className="row-hover">
                  <Td align="right" style={{ color: 'var(--text-faint)' }}>{s.year}</Td>
                  <Td mono={false} style={{ color: 'var(--text)' }}>{s.school}</Td>
                  <Td align="right" className="font-semibold" style={{ color: 'var(--text-hi)' }}>{s.wins}–{s.losses}</Td>
                  <Td align="right" style={{ color: 'var(--text-low)' }}>
                    {s.confWins !== undefined ? `${s.confWins}–${s.confLosses}` : '—'}
                  </Td>
                  <Td mono={false} style={{ color: 'var(--accent-hi)' }}>{s.note ?? ''}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </Panel>
  );
}
