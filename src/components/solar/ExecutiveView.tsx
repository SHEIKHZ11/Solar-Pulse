import { useMemo, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { Home, Zap, Leaf, TrendingUp, Search, FileText, Download, Eye, Building2, Battery, Target, AlertTriangle, FileWarning, Wrench } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { AnimatedNumber, Panel, SectionTitle, TOWNSHIP_STATS, shortName, type Township } from "./shared";

const ROWS = [
  { name: "City of Elmina (Ilham & Ridge)", units: 1240, kwp: 6200, bess: "Installed (BESS)", status: "Active (NETR Phase 1)", active: true,
    breakdown: [["Ilham Residence", "513 units connected via TNBX SARE Agreement"], ["Elmina Ridge", "727 units · 3,635 kWp rooftop PV"], ["Central Park BESS", "2.4 MWh community storage"]] },
  { name: "Bandar Bukit Raja", units: 850, kwp: 4250, bess: "Grid Direct", status: "Active (NETR Phase 1)", active: true,
    breakdown: [["Bukit Raja Phase 1–3", "850 units connected via TNBX SARE Agreement"], ["Grid export", "Direct NEM 3.0 feed-in"], ["BESS", "Feasibility study Q2 2027"]] },
  { name: "Serenia City", units: 480, kwp: 2400, bess: "Planned", status: "Phase 2 Expansion", active: false,
    breakdown: [["Serenia Aria & Amanda", "480 units in pre-install survey"], ["Target commissioning", "Q4 2027"], ["Planned BESS", "1.2 MWh"]] },
  { name: "Nilai Impian", units: 210, kwp: 1050, bess: "Planned", status: "Phase 2 Expansion", active: false,
    breakdown: [["Nilai Impian 2", "210 units in pre-install survey"], ["Target commissioning", "Q1 2028"], ["Planned BESS", "0.5 MWh"]] },
];

const SCOPES = [
  { scope: "Scope 1", desc: "Direct emissions — fleet & on-site generators", baseline: 3120, reduced: 96.4 },
  { scope: "Scope 2", desc: "Purchased electricity — offset by township PV", baseline: 18640, reduced: 312.4 },
  { scope: "Scope 3", desc: "Value chain — resident & retail energy use", baseline: 92400, reduced: 1284.0 },
];

export function ExecutiveView({ township }: { township: Township }) {
  const [q, setQ] = useState("");
  const [inspect, setInspect] = useState<(typeof ROWS)[number] | null>(null);
  const [report, setReport] = useState(false);
  const rows = useMemo(() => ROWS.filter((r) => r.name.toLowerCase().includes(q.toLowerCase())), [q]);

  const s = TOWNSHIP_STATS[township];
  const proj = s.phase1 ? "" : " (projected)";
  const kpis = [
    { Icon: Home, label: s.phase1 ? "Active Solar Homes" : "Homes in Pre-install Survey", value: <AnimatedNumber value={s.homes} />, unit: "Homes", sub: `${shortName(township)} · ${s.phase1 ? "NETR Phase 1" : "Phase 2 expansion"} · portfolio 2,090 active` },
    { Icon: Zap, label: `Monthly Clean Energy Yield${proj}`, value: <AnimatedNumber value={s.mwh} decimals={1} />, unit: "MWh", sub: "Tracking toward 2030 NETR target", progress: Math.round((s.mwh / 560) * 100) },
    { Icon: Leaf, label: `Net Scope 1 & 2 Reduction${proj}`, value: <AnimatedNumber value={s.tco2} decimals={1} />, unit: "t CO₂e", sub: "Audited for CDP B-Rating reporting" },
    { Icon: TrendingUp, label: "Retail Footfall Multiplier", value: <>+<AnimatedNumber value={s.footfall} decimals={1} />%</>, unit: "Mall Visits", sub: `Solar voucher visits to ${s.mall}` },
  ];

  return (
    <div className="space-y-8">
      <section className="rise flex flex-wrap items-end justify-between gap-4 rounded-3xl bg-ink p-6 text-ink-foreground md:p-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-solar">ESG Command Centre</p>
          <h1 className="mt-2 text-3xl font-extrabold md:text-5xl">Township Energy Portfolio</h1>
          <p className="mt-2 text-sm opacity-70">Focus: {township} · Net Zero 2050 pathway</p>
        </div>
        <Button onClick={() => setReport(true)} className="press h-12 cursor-pointer gap-2 rounded-xl bg-gradient-solar px-5 font-bold text-solar-foreground shadow-solar hover:opacity-95">
          <FileText className="h-4 w-4" /> Generate Board Report
        </Button>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k, i) => (
          <Panel key={k.label} className="rise lift" style={{ animationDelay: `${i * 60}ms` }}>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary"><k.Icon className="h-5 w-5" /></span>
            <p className="mt-4 text-sm font-medium text-muted-foreground">{k.label}</p>
            <p className="mt-1 font-display text-3xl font-bold">{k.value} <small className="text-sm font-semibold text-muted-foreground">{k.unit}</small></p>
            {k.progress && (
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-gradient-solar" style={{ width: `${k.progress}%` }} /></div>
            )}
            <p className="mt-3 text-xs text-muted-foreground">{k.sub}</p>
          </Panel>
        ))}
      </section>

      {/* Ops alerts */}
      <Panel className="rise border-solar/40">
        <SectionTitle eyebrow="Operations" title="Needs attention" action={<span className="rounded-full bg-solar-soft px-3 py-1 text-xs font-bold text-accent-foreground">3 open items</span>} />
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { Icon: AlertTriangle, title: "2 inverters offline — Serenia City", body: "Pre-install survey units lost telemetry 34 min ago. Maintenance vendor dispatched, ETA tomorrow 9 AM." },
            { Icon: FileWarning, title: "CDP Q4 disclosure due in 12 days", body: "Scope 1–3 data is 96% complete. Generate the board report below to close the remaining evidence gap." },
            { Icon: Wrench, title: "Elmina BESS firmware window", body: "Central Park storage (2.4 MWh) scheduled for firmware v4.2 on Sunday 2–4 AM. Zero resident impact expected." },
          ].map((a) => (
            <div key={a.title} className="flex gap-3 rounded-xl border bg-background p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-solar-soft text-accent-foreground"><a.Icon className="h-4 w-4" /></span>
              <div>
                <p className="text-sm font-bold leading-snug">{a.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{a.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-6">
        <Panel className="overflow-hidden p-0 md:p-0">
          <div className="p-5 md:p-6 md:pb-4">
            <SectionTitle
              eyebrow="Expansion grid"
              title="Township Solar Performance"
              action={
                <div className="relative w-full sm:w-64">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search township…" className="h-10 rounded-xl pl-9" aria-label="Search township" />
                </div>
              }
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>{["Township Name", "Active Solar Units", "Total PV Capacity", "BESS Storage", "Status", "Action"].map((h) => <th key={h} className="px-5 py-3 font-semibold">{h}</th>)}</tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.name} className={cn("border-t transition-colors hover:bg-muted/50", r.name === township && "bg-secondary/60")}>
                    <td className="px-5 py-4 font-semibold"><span className="flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" />{r.name}</span></td>
                    <td className="tabular px-5 py-4">{r.units.toLocaleString()} Homes</td>
                    <td className="tabular px-5 py-4">{r.kwp.toLocaleString()} kWp</td>
                    <td className="px-5 py-4">{r.bess}</td>
                    <td className="px-5 py-4">
                      <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold", r.active ? "bg-success-soft text-primary" : "bg-solar-soft text-accent-foreground")}>
                        <span className={cn("h-1.5 w-1.5 rounded-full", r.active ? "bg-success" : "bg-solar")} />{r.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Button size="sm" variant="outline" onClick={() => setInspect(r)} className="press cursor-pointer gap-1.5 rounded-lg"><Eye className="h-3.5 w-3.5" /> Inspect Data</Button>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && <tr><td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">No townships match “{q}”.</td></tr>}
              </tbody>
            </table>
          </div>
        </Panel>

        <div className="grid gap-6 md:grid-cols-2">
          <Panel>
            <SectionTitle eyebrow="Capacity" title="PV by township (kWp)" />
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ROWS.map((r) => ({ n: r.name.replace("City of ", "").replace(" (Ilham & Ridge)", ""), kwp: r.kwp, a: r.active }))} margin={{ left: -20, right: 0 }}>
                  <XAxis dataKey="n" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                  <Tooltip cursor={{ fill: "var(--muted)" }} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} formatter={(v: number) => [`${v.toLocaleString()} kWp`, "PV Capacity"]} />
                  <Bar dataKey="kwp" radius={[8, 8, 0, 0]}>
                    {ROWS.map((r) => <Cell key={r.name} fill={r.active ? "var(--primary)" : "var(--solar)"} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
          <div className="rounded-2xl bg-gradient-emerald p-6 text-primary-foreground shadow-lift">
            <Target className="h-6 w-6 text-solar" />
            <h3 className="mt-3 text-lg font-bold">Executive ESG & CDP Board Reporting</h3>
            <p className="mt-1 text-sm opacity-80">Consolidated Scope 1–3 offsets across 2 active townships (4 enrolled), formatted for CDP and NETR disclosure.</p>
            <Button onClick={() => setReport(true)} className="press mt-5 h-auto w-full cursor-pointer whitespace-normal rounded-xl bg-gradient-solar py-3 font-bold text-solar-foreground hover:opacity-95">
              Generate CDP & NETR Compliance Report (PDF)
            </Button>
          </div>
        </div>
      </div>

      <Sheet open={!!inspect} onOpenChange={(o) => !o && setInspect(null)}>
        <SheetContent className="w-full sm:max-w-md">
          {inspect && (
            <>
              <SheetHeader>
                <SheetTitle className="text-2xl">{inspect.name}</SheetTitle>
                <SheetDescription>{inspect.status}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 grid grid-cols-2 gap-3 px-4">
                {[[Home, "Solar units", `${inspect.units.toLocaleString()}`], [Zap, "PV capacity", `${inspect.kwp.toLocaleString()} kWp`], [Battery, "Storage", inspect.bess], [Leaf, "Est. CO₂e / yr", `${Math.round(inspect.kwp * 0.58).toLocaleString()} t`]].map(([I, l, v]) => {
                  const Ico = I as typeof Home;
                  return (
                    <div key={l as string} className="rounded-xl border p-3">
                      <Ico className="h-4 w-4 text-primary" />
                      <p className="mt-2 text-xs text-muted-foreground">{l as string}</p>
                      <p className="font-display text-lg font-bold">{v as string}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 space-y-2 px-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Breakdown</p>
                {inspect.breakdown.map(([a, b]) => (
                  <div key={a} className="rounded-xl bg-muted p-3 text-sm"><span className="font-semibold">{a}:</span> {b}</div>
                ))}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={report} onOpenChange={setReport}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-2xl">
          <div id="esg-report" className="bg-card">
            <DialogHeader className="border-b pb-4 text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Confidential · Board Paper · FY2026</p>
              <DialogTitle className="text-2xl">Sime Darby Property Berhad — Net Zero 2050 Energy Transition Audit</DialogTitle>
              <DialogDescription>CDP Climate & NETR compliance summary · 2 active, 2 in Phase 2</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-3 gap-3 py-5">
              {[["Solar homes", "2,090"], ["Clean yield / mo", "584.2 MWh"], ["CDP target", "B-Rating"]].map(([l, v]) => (
                <div key={l} className="rounded-xl bg-muted p-3"><p className="text-xs text-muted-foreground">{l}</p><p className="font-display text-lg font-bold">{v}</p></div>
              ))}
            </div>
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground"><th className="py-2">Scope</th><th className="py-2">Baseline (t CO₂e)</th><th className="py-2 text-right">Offset (t CO₂e)</th></tr></thead>
              <tbody>
                {SCOPES.map((s) => (
                  <tr key={s.scope} className="border-b">
                    <td className="py-3"><p className="font-semibold">{s.scope}</p><p className="text-xs text-muted-foreground">{s.desc}</p></td>
                    <td className="tabular py-3">{s.baseline.toLocaleString()}</td>
                    <td className="tabular py-3 text-right font-semibold text-primary">−{s.reduced.toLocaleString(undefined, { minimumFractionDigits: 1 })}</td>
                  </tr>
                ))}
                <tr><td className="py-3 font-bold">Total offset</td><td /><td className="tabular py-3 text-right font-display text-lg font-bold text-primary">−{SCOPES.reduce((a, s) => a + s.reduced, 0).toLocaleString(undefined, { minimumFractionDigits: 1 })}</td></tr>
              </tbody>
            </table>
            <p className="mt-4 text-xs text-muted-foreground">Figures are prototype estimates for hackathon demonstration.</p>
          </div>
          <Button
            className="press mt-2 w-full cursor-pointer gap-2 rounded-xl"
            onClick={() => { toast.success("Preparing official PDF — choose “Save as PDF” in the print dialog."); setTimeout(() => window.print(), 400); }}
          >
            <Download className="h-4 w-4" /> Download Official PDF Report
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
