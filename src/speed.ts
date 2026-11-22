// Speed readout and speed run, as every House Party toy has them (src/vendor/hp-perf.js).
// Readout: the Speed readout switch, P (F already fits the ninjas), or #fps on the address. Speed run: the
// Record a speed run button, or #perfrun on the address. A run plays the page hands off, logs one row a second,
// then shows a report to copy or save. Nothing is sent anywhere.
import { createPerf } from "./vendor/hp-perf.js";

// at the top, because the bottom-left corner holds the camera buttons
export const perf = createPerf({ toy: "tiny-ninja-toy", where: () => "top" });
perf.watchFrames();

// Stand-ins for a person's hands
export function press(key: string) {
  document.dispatchEvent(new KeyboardEvent("keypress", { key, bubbles: true }));
}
export function clickButton(label: string) {
  const b = [...document.querySelectorAll("button")].find((x) => x.textContent === label);
  b?.click();
}
export function tapCanvas(fx: number, fy: number) {
  const c = document.querySelector("canvas");
  if (!c) return;
  const r = c.getBoundingClientRect();
  c.dispatchEvent(
    new MouseEvent("click", { bubbles: true, clientX: r.left + r.width * fx, clientY: r.top + r.height * fy }),
  );
}
