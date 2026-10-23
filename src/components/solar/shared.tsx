import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export const TOWNSHIPS = [
  "City of Elmina (Ilham & Ridge)",
  "Bandar Bukit Raja",
  "Serenia City",
  "Nilai Impian",
] as const;
export type Township = (typeof TOWNSHIPS)[number];
export type Role = "resident" | "executive";

export type RedeemedVoucher = {
  code: string;
  title: string;
  place: string;
  rm: number;
  co2: number;
  redeemedAt: string;
};

export function shortName(t: Township) {
  return t.replace(" (Ilham & Ridge)", "").replace("City of ", "");
}

export function AnimatedNumber({ value, decimals = 0, className }: { value: number; decimals?: number; className?: string }) {
  const [display, setDisplay] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 700);
      const e = 1 - Math.pow(1 - p, 3);
      setDisplay(a + (value - a) * e);
      if (p < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return (
    <span className={cn("tabular", className)}>
      {display.toLocaleString("en-MY", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
    </span>
  );
}

export function SectionTitle({ eyebrow, title, action }: { eyebrow: string; title: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-glow">{eyebrow}</p>
        <h2 className="mt-1 text-xl font-bold text-foreground md:text-2xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function Panel({ className, children, style }: { className?: string; children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div className={cn("rounded-2xl border bg-card p-5 shadow-card md:p-6", className)} style={style}>
      {children}
    </div>
  );
}

/** Deterministic QR-like graphic seeded from a string. */
export function QrGraphic({ seed, size = 168 }: { seed: string; size?: number }) {
  const n = 25;
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const rand = () => ((h = (h * 1664525 + 1013904223) >>> 0) / 2 ** 32);
  const cells: [number, number][] = [];
  const finder = (x: number, y: number) =>
    (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!finder(x, y) && rand() > 0.52) cells.push([x, y]);
  const F = ({ x, y }: { x: number; y: number }) => (
    <g>
      <rect x={x} y={y} width={7} height={7} className="fill-ink" />
      <rect x={x + 1} y={y + 1} width={5} height={5} className="fill-card" />
      <rect x={x + 2} y={y + 2} width={3} height={3} className="fill-ink" />
    </g>
  );
  return (
    <svg viewBox={`-1 -1 ${n + 2} ${n + 2}`} width={size} height={size} role="img" aria-label="Voucher QR code" shapeRendering="crispEdges">
      <rect x={-1} y={-1} width={n + 2} height={n + 2} className="fill-card" />
      {cells.map(([x, y]) => <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} className="fill-ink" />)}
      <F x={0} y={0} /><F x={n - 7} y={0} /><F x={0} y={n - 7} />
    </svg>
  );
}

export type TownshipStats = {
  solar: number; vsAvg: number; savings: number; co2: number; trees: number;
  bill: number; lastBill: number; mall: string;
  homes: number; mwh: number; tco2: number; footfall: number; phase1: boolean; scale: number;
};

export const TOWNSHIP_STATS: Record<Township, TownshipStats> = {
  "City of Elmina (Ilham & Ridge)": { solar: 22.4, vsAvg: 15.2, savings: 18.2, co2: 15.8, trees: 1.2, bill: 86.4, lastBill: 139.2, mall: "Elmina Lakeside Mall", homes: 1240, mwh: 346.6, tco2: 242.5, footfall: 22.4, phase1: true, scale: 1 },
  "Bandar Bukit Raja": { solar: 19.8, vsAvg: 11.6, savings: 16.1, co2: 14.0, trees: 1.1, bill: 94.1, lastBill: 142.5, mall: "Bukit Raja Shopping Centre", homes: 850, mwh: 237.6, tco2: 166.3, footfall: 18.1, phase1: true, scale: 0.88 },
  "Serenia City": { solar: 17.2, vsAvg: 8.4, savings: 13.9, co2: 12.1, trees: 0.9, bill: 101.3, lastBill: 138.0, mall: "Serenia City Commercial Hub", homes: 480, mwh: 134.2, tco2: 93.9, footfall: 9.5, phase1: false, scale: 0.77 },
  "Nilai Impian": { solar: 15.6, vsAvg: 6.1, savings: 12.6, co2: 11.0, trees: 0.8, bill: 108.7, lastBill: 140.6, mall: "Nilai Impian Square", homes: 210, mwh: 58.7, tco2: 41.1, footfall: 6.2, phase1: false, scale: 0.7 },
};

/** Current hour in Malaysia (0–23). */
export function klHour(d = new Date()) {
  return Number(d.toLocaleString("en-GB", { hour: "2-digit", hour12: false, timeZone: "Asia/Kuala_Lumpur" })) % 24;
}

export function greeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("") || "?";
}
