// The Speed readout switch and Record a speed run button (see speed.ts).
import React from "react";
import { PerfSpec } from "./vendor/hp-perf.js";
import { perf } from "./speed";

let autoran = false;

export function SpeedControls({ spec }: { spec: () => PerfSpec }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const specRef = React.useRef(spec);
  specRef.current = spec;
  React.useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const row = perf.mountControls(host, { spec: () => specRef.current(), key: "p" });
    if (!autoran && /#perfrun\b/.test(location.hash)) {
      autoran = true;
      perf.autorun(specRef.current());
    }
    return () => row.remove();
  }, []);
  return <div ref={ref} className="flex items-center gap-2 text-sm [&_button]:bg-blue-500 [&_button]:text-white [&_button]:font-bold [&_button]:py-2 [&_button]:px-4 [&_button]:rounded" />;
}
