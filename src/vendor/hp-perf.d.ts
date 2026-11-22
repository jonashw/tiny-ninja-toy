// Types for the parts of hp-perf.js this app uses.
export type PerfStep = { at: number; mark?: string; run?: () => void };
export type PerfSpec = { seconds?: number; steps?: PerfStep[]; done?: () => void };
export type Perf = {
  watchFrames(): void;
  autorun(spec: PerfSpec): void;
  mountControls(sheet: HTMLElement, opts: { spec: () => PerfSpec; key?: string }): HTMLElement;
  running(): boolean;
};
export function createPerf(opts?: { toy?: string; where?: () => "top" | "bottom"; info?: () => Record<string, unknown> }): Perf;
