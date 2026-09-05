import { useMemo, useState } from 'react';
import { BarList, Scatter } from '../components/charts';
import { IconReset } from '../components/icons';
import {
  AnimatedNumber, Divider, InfoDot, Label, Panel, PanelHead, Slider, Stat,
  Table, Td, Th, TeamMark,
} from '../components/ui';
import { MEASURED_ANCHOR } from '../data/measured';
import { ROSTERS } from '../data/players';
import { TEAMS, TEAM_BY_ID } from '../data/teams';
import type { TeamId } from '../data/types';
import {
  DEFAULT_COEFFICIENTS, deriveAll, externalAgreement,
  rosterStrength, spearmanVsSpPlus, type ModelCoefficients,
} from '../engine/model';
import { num, signed, teamInk } from '../lib/viz';
import { useStore } from '../state/store';

/* ============================================================================
 * Model Lab.
 *
 * The rating components are derived from observations by a handful of global
 * coefficients rather than authored per team. That claim is only worth making
 * if you can check it, so this view exposes every coefficient, re-derives the
 * league on each change, and scores the result against two independently
 * published rankings the model was never fitted to.
 * ========================================================================== */

interface CoefficientSpec {
  key: keyof ModelCoefficients;
  label: string;
  group: 'Units' | 'Roster & programme' | 'Coaching' | 'Calibration';
  min: number;
  max: number;
  step: number;
  hint: string;
  format?: (v: number) => string;
}

const SPECS: CoefficientSpec[] = [
  {
    key: 'priorWeight', label: 'Last season vs current roster', group: 'Units',
    min: 0, max: 1, step: 0.01,
    format: (v) => `${Math.round(v * 100)}% last season`,
    hint: 'At 0 a unit is rated purely on who is on the roster now; at 1, purely on what the programme did last year.',
  },
  {
    key: 'efficiencyScale', label: 'Efficiency scale', group: 'Units',
    min: 0, max: 8, step: 0.05, format: (v) => `${v.toFixed(2)} pts / sd`,
    hint: 'Points per standard deviation of prior-season per-play efficiency.',
  },
  {
    key: 'rosterScale', label: 'Roster scale', group: 'Units',
    min: 0, max: 8, step: 0.05, format: (v) => `${v.toFixed(2)} pts / sd`,
    hint: 'Points per standard deviation of summed roster value on a side of the ball.',
  },
  {
    key: 'qbScale', label: 'Quarterback scale', group: 'Roster & programme',
    min: 0, max: 0.3, step: 0.005, format: (v) => `${v.toFixed(3)} pts / grade`,
    hint: 'Points per grade point above a replacement-level starter. The single largest one-player term in the model.',
  },
  {
    key: 'qbReplacementGrade', label: 'Replacement quarterback', group: 'Roster & programme',
    min: 55, max: 85, step: 1, format: (v) => `grade ${v.toFixed(0)}`,
    hint: 'The grade a freely available conference starter is worth. Raising it charges every team for its quarterback.',
  },
  {
    key: 'continuityScale', label: 'Continuity scale', group: 'Roster & programme',
    min: 0, max: 3, step: 0.02, format: (v) => `${v.toFixed(2)} pts / sd`,
    hint: 'Points per standard deviation of returning production.',
  },
  {
    key: 'talentScale', label: 'Talent scale', group: 'Roster & programme',
    min: 0, max: 3, step: 0.02, format: (v) => `${v.toFixed(2)} pts / sd`,
    hint: 'Points per standard deviation of blue-chip ratio — recruiting talent independent of last season.',
  },
  {
    key: 'portalWeight', label: 'Portal weight', group: 'Roster & programme',
    min: 0, max: 2, step: 0.02, format: (v) => `${v.toFixed(2)}×`,
    hint: 'Multiplier on the estimated net value of a transfer cycle.',
  },
  {
    key: 'coachScale', label: 'Coaching scale', group: 'Coaching',
    min: 0, max: 3, step: 0.02, format: (v) => `${v.toFixed(2)} pts / sd`,
    hint: 'Points per standard deviation of the composite coaching index.',
  },
  {
    key: 'coachRegression', label: 'Coach regression', group: 'Coaching',
    min: 0, max: 80, step: 1, format: (v) => `${v.toFixed(0)} games`,
    hint: 'Games of prior experience a career record is regressed toward .500 with. At 0, one good season counts as much as ten.',
  },
  {
    key: 'transitionWeight', label: 'First-year penalty', group: 'Coaching',
    min: 0, max: 3, step: 0.02, format: (v) => `${v.toFixed(2)}×`,
    hint: 'Multiplier on the installation cost charged to a first-year staff.',
  },
  {
    key: 'anchorScale', label: 'Conference strength', group: 'Calibration',
    min: 0, max: 2, step: 0.01, format: (v) => `${v.toFixed(2)}×`,
    hint: 'Multiplier on each conference’s measured anchor — the scoring margin its teams post against an average FBS team, fitted from results. At 1.00 the projection uses what the games say. Moving it changes nothing between two teams in the same conference; it only affects games across conferences and against outside opponents.',
  },
];

const GROUPS = ['Units', 'Roster & programme', 'Coaching', 'Calibration'] as const;

export function ModelLab() {
  const { state, dispatch, ratings, go } = useStore();
  const mode = state.theme;
  const coeffs = state.scenario.coefficients;
  const [inspect, setInspect] = useState<TeamId>('UGA');

  const dirty = useMemo(
    () => (Object.keys(DEFAULT_COEFFICIENTS) as (keyof ModelCoefficients)[])
      .filter((k) => coeffs[k] !== DEFAULT_COEFFICIENTS[k]),
    [coeffs],
  );

  const derived = useMemo(() => deriveAll(coeffs), [coeffs]);
  const agreement = useMemo(() => externalAgreement(derived), [derived]);
  const rho = useMemo(() => spearmanVsSpPlus(agreement), [agreement]);
  const baselineRho = useMemo(
    () => spearmanVsSpPlus(externalAgreement(deriveAll(DEFAULT_COEFFICIENTS))),
    [],
  );

  const ordered = useMemo(
    () => [...TEAMS].sort((a, b) => ratings[b.id].total - ratings[a.id].total),
    [ratings],
  );
  const spread = ordered.length
    ? ratings[ordered[0].id].total - ratings[ordered[ordered.length - 1].id].total
    : 0;

  /**
   * How far each team's rating moves when a coefficient is doubled. This is the
   * quickest way to see which observation is actually carrying a given team.
   */
  const sensitivity = useMemo(() => {
    const base = deriveAll(coeffs);
    const sum = (d: ReturnType<typeof deriveAll>, id: TeamId) => {
      const c = d[id].components;
      return c.offense + c.defense + c.specialTeams + c.coaching +
        c.returningProduction + c.portalRecruiting + c.quarterback;
    };
    return SPECS.filter((sp) => sp.key !== 'anchorScale').map((sp) => {
      const bumped = deriveAll({ ...coeffs, [sp.key]: coeffs[sp.key] * 1.5 || 0.1 });
      const delta = sum(bumped, inspect) - sum(base, inspect);
      return { key: sp.key, label: sp.label, delta };
    }).sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  }, [coeffs, inspect]);

  const detail = derived[inspect].detail;
  const team = TEAM_BY_ID[inspect];

  return (
    <div className="space-y-4">
      {/* ---- Headline ------------------------------------------------------ */}
      <Panel>
        <PanelHead
          title="The model is twelve numbers"
          subtitle="No team carries a rating constant. Every component is derived from that team's observations by the coefficients below, applied identically to all sixteen. Move one and the whole league re-derives."
          right={
            dirty.length > 0 ? (
              <button className="btn !py-1 !text-[11px]" onClick={() => dispatch({ type: 'resetCoefficients' })}>
                <IconReset size={11} /> Reset {dirty.length}
              </button>
            ) : undefined
          }
        />
        <Divider />
        <div className="grid gap-px" style={{ background: 'var(--line-faint)', gridTemplateColumns: 'repeat(auto-fit, minmax(174px, 1fr))' }}>
          {[
            {
              l: 'Agreement with SP+',
              v: <AnimatedNumber value={rho} digits={3} />,
              s: `Spearman rank correlation${dirty.length ? ` · default ${baselineRho.toFixed(3)}` : ''}`,
              tone: (rho >= baselineRho - 0.02 ? 'accent' : 'negative') as 'accent' | 'negative',
            },
            { l: 'Conference spread', v: `${num(spread)} pts`, s: 'best to worst, neutral field' },
            { l: 'SEC anchor', v: signed(MEASURED_ANCHOR.SEC * coeffs.anchorScale), s: 'measured, against an average FBS team' },
            { l: 'Big Ten anchor', v: signed(MEASURED_ANCHOR.B1G * coeffs.anchorScale), s: 'measured, against an average FBS team' },
            { l: 'Coefficients changed', v: String(dirty.length), s: dirty.length ? 'from the defaults' : 'running the defaults' },
            { l: 'Rating constants in data', v: '0', s: 'nothing is authored per team' },
          ].map((x) => (
            <div key={x.l} className="px-4 py-3" style={{ background: 'var(--bg-panel)' }}>
              <Stat label={x.l} value={x.v} sub={x.s} size="sm" tone={x.tone} />
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-[1fr_1.1fr]">
        {/* ---- Coefficients ------------------------------------------------ */}
        <Panel>
          <PanelHead
            title="Coefficients"
            subtitle="Each one is a rate: points per standard deviation of an observation, or a weight between two sources of evidence."
          />
          <div className="space-y-5 px-5 pb-5">
            {GROUPS.map((group) => (
              <div key={group}>
                <Label className="mb-2.5">{group}</Label>
                <div className="space-y-3.5">
                  {SPECS.filter((sp) => sp.group === group).map((sp) => (
                    <div key={sp.key}>
                      <Slider
                        label={sp.label}
                        value={coeffs[sp.key]}
                        min={sp.min}
                        max={sp.max}
                        step={sp.step}
                        reset={DEFAULT_COEFFICIENTS[sp.key]}
                        onChange={(v) => dispatch({ type: 'coefficient', key: sp.key, value: v })}
                        format={sp.format}
                        hint={sp.hint}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* ---- External agreement ------------------------------------------ */}
        <div className="space-y-4">
          <Panel>
            <PanelHead
              title="Checked against two rankings it was never fitted to"
              subtitle="Conference rank from this model beside the published SP+ and AP preseason ranks. Agreement is evidence the structure is sound; each disagreement is a specific, inspectable claim."
              right={<InfoDot text="Not the back-test — that scores five seasons of real results and lives in scripts/etl/backtest.mjs. This is an external consistency check between two independent preseason rankings." />}
            />
            <Table>
              <thead>
                <tr>
                  <Th width={150}>Team</Th>
                  <Th align="right" width={62}>Rating</Th>
                  <Th align="right" width={58}>Model</Th>
                  <Th align="right" width={52}>SP+</Th>
                  <Th align="right" width={46}>AP</Th>
                  <Th align="right" width={70}>vs SP+</Th>
                </tr>
              </thead>
              <tbody>
                {agreement.map((r) => {
                  const t = TEAM_BY_ID[r.teamId];
                  const gap = r.spPlusGap;
                  return (
                    <tr
                      key={r.teamId}
                      className="row-hover cursor-pointer"
                      onClick={() => setInspect(r.teamId)}
                      style={r.teamId === inspect ? { background: 'var(--accent-dim)' } : undefined}
                    >
                      <Td mono={false}>
                        <span className="flex items-center gap-2">
                          <TeamMark team={t} size={10} />
                          <span className="truncate font-medium" style={{ color: teamInk(t, mode) }}>{t.school}</span>
                        </span>
                      </Td>
                      <Td align="right" className="font-semibold" style={{ color: 'var(--text-hi)' }}>
                        {num(ratings[r.teamId].total)}
                      </Td>
                      <Td align="right" style={{ color: 'var(--text)' }}>{r.modelRank}</Td>
                      <Td align="right" style={{ color: 'var(--text-low)' }}>{r.spPlusRank ?? '—'}</Td>
                      <Td align="right" style={{ color: 'var(--text-low)' }}>{r.apRank ?? '—'}</Td>
                      <Td align="right" className="font-semibold"
                        style={{ color: gap === null ? 'var(--text-faint)' : gap === 0 ? 'var(--text-faint)' : Math.abs(gap) >= 3 ? 'var(--viz-neg)' : 'var(--text-mid)' }}>
                        {gap === null ? '—' : gap === 0 ? 'level' : `${gap > 0 ? '+' : '−'}${Math.abs(gap)}`}
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <p className="px-4 py-2.5 text-[11px] leading-relaxed" style={{ color: 'var(--text-low)', borderTop: '1px solid var(--line-faint)' }}>
              Positive means this model rates them higher than SP+ does. At the default coefficients the
              two orderings correlate at {baselineRho.toFixed(3)} across the thirteen teams SP+ ranks —
              built from inputs, not fitted to that number.
            </p>
          </Panel>
        </div>
      </div>

      {/* ---- Team teardown -------------------------------------------------- */}
      <Panel>
        <PanelHead
          title={
            <span className="flex items-center gap-2">
              <TeamMark team={team} size={11} />
              <span style={{ color: teamInk(team, mode) }}>{team.school}</span>
              <span style={{ color: 'var(--text-low)' }}>— where the rating comes from</span>
            </span>
          }
          subtitle="The two blended sources for each unit, and which coefficient the rating is most sensitive to. Select any team in the table above."
        />
        <div className="grid gap-5 px-5 pb-5 lg:grid-cols-2">
          <div>
            <Label>Unit strength, blended</Label>
            <p className="mt-1 text-[11.5px] leading-snug" style={{ color: 'var(--text-low)' }}>
              Each unit mixes what the programme did last season with the value of the roster on hand,
              at {Math.round(coeffs.priorWeight * 100)}% / {Math.round((1 - coeffs.priorWeight) * 100)}%.
            </p>
            <div className="mt-3">
              <BarList
                showZero
                min={-8}
                max={8}
                labelWidth={124}
                valueWidth={62}
                format={(v) => `${signed(v)} pts`}
                data={[
                  { key: 'po', label: 'Offence — last season', value: detail.priorOffense, color: 'var(--viz-c1)' },
                  { key: 'ro', label: 'Offence — roster', value: detail.rosterOffense, color: 'var(--viz-c3)' },
                  { key: 'pd', label: 'Defence — last season', value: detail.priorDefense, color: 'var(--viz-c1)' },
                  { key: 'rd', label: 'Defence — roster', value: detail.rosterDefense, color: 'var(--viz-c3)' },
                ]}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                { l: 'Projected starter', v: detail.starter ? `${detail.starter.name}` : '—', s: detail.starter ? `grade ${detail.starter.grade}` : '' },
                { l: 'Offensive roster value', v: `${rosterStrength(ROSTERS[inspect], 'offense').toFixed(1)} PAR`, s: 'quarterbacks excluded' },
                { l: 'Defensive roster value', v: `${rosterStrength(ROSTERS[inspect], 'defense').toFixed(1)} PAR`, s: 'summed across the tracked roster' },
                { l: 'Coaching index', v: signed(detail.coachIndexValue, 2), s: 'record, development, acquisition' },
              ].map((x) => (
                <div key={x.l} className="rounded-[9px] px-3 py-2" style={{ background: 'var(--bg-panel-2)', border: '1px solid var(--line-faint)' }}>
                  <Label>{x.l}</Label>
                  <div className="mt-0.5 truncate text-[13px] font-semibold" style={{ color: 'var(--text-hi)' }}>{x.v}</div>
                  <div className="truncate text-[10.5px]" style={{ color: 'var(--text-faint)' }}>{x.s}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Sensitivity</Label>
            <p className="mt-1 text-[11.5px] leading-snug" style={{ color: 'var(--text-low)' }}>
              How far {team.abbr}'s rating moves if each coefficient is raised by half. The longest bar
              is the assumption this team's rating leans on hardest.
            </p>
            <div className="mt-3">
              <BarList
                showZero
                min={-4}
                max={4}
                height={19}
                labelWidth={152}
                valueWidth={62}
                format={(v) => `${signed(v)} pts`}
                data={sensitivity.map((sv) => ({
                  key: sv.key,
                  label: sv.label,
                  value: sv.delta,
                }))}
              />
            </div>
          </div>
        </div>
      </Panel>

      {/* ---- Model vs published --------------------------------------------- */}
      <Panel>
        <PanelHead
          title="Model rating against published rank"
          subtitle="If the derivation were arbitrary, this would be a cloud. Teams far off the trend are where the model makes a claim worth arguing with."
        />
        <div className="px-5 pb-5">
          <Scatter
            height={330}
            xLabel="SP+ conference rank (better ←)"
            yLabel="Model rating"
            invertY
            points={agreement
              .filter((r) => r.spPlusRank !== null)
              .map((r) => {
                const t = TEAM_BY_ID[r.teamId];
                return {
                  key: r.teamId,
                  x: -(r.spPlusRank as number),
                  y: ratings[r.teamId].total,
                  label: t.abbr,
                  color: t.primary,
                  emphasis: Math.abs(r.spPlusGap ?? 0) >= 2,
                  onClick: () => go('team', { teamId: r.teamId }),
                  detail: (
                    <>
                      <div className="font-semibold" style={{ color: 'var(--text-hi)' }}>{t.school}</div>
                      <div className="mt-1 tabular-nums">Model {num(ratings[r.teamId].total)} · rank {r.modelRank}</div>
                      <div className="tabular-nums" style={{ color: 'var(--text-low)' }}>SP+ conference rank {r.spPlusRank}</div>
                    </>
                  ),
                };
              })}
          />
          <p className="mt-3 text-[11.5px] leading-relaxed" style={{ color: 'var(--text-low)' }}>
            Highlighted teams are where the two disagree by two conference places or more. Those are the
            interesting cases: the model is reading the roster and the schedule differently, and the
            Team Lab shows exactly which component is responsible.
          </p>
        </div>
      </Panel>
    </div>
  );
}
