/// <reference lib="webworker" />
import { rateAll } from '../engine/ratings';
import { simulateSeason, type SeasonResult } from '../engine/season';
import type { Scenario } from '../engine/scenario';

export interface SeasonRequest {
  id: number;
  scenario: Scenario;
}

export interface SeasonResponse {
  id: number;
  result: SeasonResult;
}

self.onmessage = (e: MessageEvent<SeasonRequest>) => {
  const { id, scenario } = e.data;
  const result = simulateSeason(rateAll(scenario), scenario);
  const payload: SeasonResponse = { id, result };
  (self as unknown as Worker).postMessage(payload);
};
