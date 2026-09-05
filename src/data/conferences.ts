import { MEASURED_ANCHOR } from './measured';
import { CHAMPIONSHIPS } from './measuredSchedule';
import { TEAMS } from './teams';
import type { Conference, Team } from './types';

/* ============================================================================
 * The two conferences.
 *
 * A conference is not just a label on a team. It decides what a standing means,
 * who plays for a title, and — through the measured anchor — where a league
 * sits against the rest of the country. Everything the app needs to know about
 * one lives here.
 * ========================================================================== */

export interface ConferenceMeta {
  id: Conference;
  name: string;
  /** Short form for chips, table headers and anywhere space is tight. */
  short: string;
  teams: Team[];
  championship: { venue: string; city: string };
  /** Points per game above an average FBS team, fitted from scoring margins. */
  anchor: number;
}

export const CONFERENCES: ConferenceMeta[] = [
  { id: 'SEC', name: 'SEC', short: 'SEC' },
  { id: 'B1G', name: 'Big Ten', short: 'B1G' },
].map((c) => ({
  ...c,
  id: c.id as Conference,
  teams: TEAMS.filter((t) => t.conference === c.id),
  championship: CHAMPIONSHIPS[c.id as Conference],
  anchor: MEASURED_ANCHOR[c.id as Conference],
}));

export const CONFERENCE_BY_ID = Object.fromEntries(
  CONFERENCES.map((c) => [c.id, c]),
) as Record<Conference, ConferenceMeta>;

/** What the league-wide views are currently looking at. */
export type Lens = Conference | 'ALL';

/** Teams under a lens, in the order the rest of the app expects. */
export function teamsUnder(lens: Lens): Team[] {
  return lens === 'ALL' ? TEAMS : CONFERENCE_BY_ID[lens].teams;
}

/** How to name whatever the lens is pointing at, in running text. */
export function lensLabel(lens: Lens): string {
  return lens === 'ALL' ? 'both conferences' : CONFERENCE_BY_ID[lens].name;
}

/** The count under a lens, spelled out — "the sixteen" reads better than "16". */
const SPELLED: Record<number, string> = {
  16: 'sixteen', 18: 'eighteen', 34: 'thirty-four',
};
export function lensCount(lens: Lens): string {
  const n = teamsUnder(lens).length;
  return SPELLED[n] ?? String(n);
}
