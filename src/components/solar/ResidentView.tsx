import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Sun, Wallet, Leaf, Coins, Zap, Car, WashingMachine, Lamp, Check, RefreshCw, BatteryCharging, Ticket, ShoppingBag, ParkingCircle, ArrowUpRight, Sparkles, BrainCircuit, CloudSun, TrendingDown, Receipt, Trophy, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import township from "@/assets/township.jpg";
import { AnimatedNumber, Panel, QrGraphic, SectionTitle, shortName, TOWNSHIP_STATS, klHour, greeting, type RedeemedVoucher, type Township } from "./shared";

const DATA = [
  { time: "00:00", solar: 0.0, load: 0.8 },
  { time: "06:00", solar: 0.2, load: 1.2 },
  { time: "09:00", solar: 2.1, load: 1.5 },
  { time: "12:00", solar: 4.8, load: 1.1 },
  { time: "15:00", solar: 3.9, load: 1.4 },
  { time: "18:00", solar: 0.8, load: 2.2 },
  { time: "21:00", solar: 0.0, load: 1.8 },
];

const VOUCHERS = [
  { id: "fnb", title: "RM 10 F&B E-Voucher", place: "Elmina Lakeside Mall", cost: 100, rm: 10, co2: 4.2, Icon: Ticket },
  { id: "shop", title: "RM 20 Shopping Pass", place: "KL East Mall", cost: 200, rm: 20, co2: 8.4, Icon: ShoppingBag },
  { id: "park", title: "Free Day Parking Pass", place: "KLGCC Mall", cost: 150, rm: 15, co2: 6.3, Icon: ParkingCircle },
] as const;

export function ResidentView({ township: t, userName, points, setPoints, battery, setBattery, onRedeem }: {
  township: Township; userName: string; points: number; setPoints: (f: (p: number) => number) => void; battery: number; setBattery: (b: number) => void;
  onRedeem: (v: RedeemedVoucher) => void;
}) {
  const [ev, setEv] = useState(false);
  const [wash, setWash] = useState(false);
  const [exported, setExported] = useState(false);
  const [voucher, setVoucher] = useState<(typeof VOUCHERS)[number] | null>(null);
  const [code, setCode] = useState("");
  const [hour, setHour] = useState(14);
  useEffect(() => {
    const tick = () => setHour(klHour());
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, []);
  const area = shortName(t);
  const s = TOWNSHIP_STATS[t];
  const firstName = userName.trim().split(/\s+/)[0];
  const chart = DATA.map((d) => ({ ...d, solar: +(d.solar * s.scale).toFixed(1) }));
  const placeOf = (v: (typeof VOUCHERS)[number]) => (v.id === "fnb" ? s.mall : v.place);
  const billCut = Math.round((1 - s.bill / s.lastBill) * 100);

  const redeem = (v: (typeof VOUCHERS)[number]) => {
    if (points < v.cost) {
      toast.warning("Insufficient PRIME Solar Points.");
      return;
    }
    const c = `SDP-SOLAR-${v.id.toUpperCase()}-2026-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    setPoints((p) => p - v.cost);
    setCode(c);
    setVoucher(v);
    onRedeem({
      code: c, title: v.title, place: placeOf(v), rm: v.rm, co2: v.co2,
      redeemedAt: new Date().toLocaleString("en-MY", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }),
    });
    toast.success(`${v.title} redeemed — saved to your Voucher Wallet.`);
  };

  const kpis = [
    { Icon: Sun, label: "Today's Solar Generation", value: <><AnimatedNumber value={s.solar} decimals={1} /> <small className="text-base font-semibold text-muted-foreground">kWh</small></>, sub: `+${s.vsAvg}% vs ${area} Neighborhood Average`, badge: true, tone: "solar" },
    { Icon: Wallet, label: "Estimated Grid Savings", value: <>RM <AnimatedNumber value={s.savings} decimals={2} /></>, sub: "TNB Peak Tariff Offset (TNBX Meter Synced)", tone: "primary" },
    { Icon: Leaf, label: "Carbon Avoidance", value: <><AnimatedNumber value={s.co2} decimals={1} /> <small className="text-base font-semibold text-muted-foreground">kg CO₂</small></>, sub: `Equivalent to ${s.trees} trees planted today`, tone: "primary" },
  ];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="rise relative overflow-hidden rounded-3xl shadow-lift">
        <img src={township} alt={`Aerial view of solar homes in ${t}`} width={1600} height={800} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="relative grid gap-6 p-6 text-primary-foreground md:grid-cols-[1.4fr_1fr] md:p-10">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-semibold backdrop-blur">
              <MapPin className="h-3.5 w-3.5 text-solar" /> {t}
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-[1.05] md:text-5xl">
              {greeting(hour)}, {firstName}.<br />
              <span className="text-solar">Your roof is earning.</span>
            </h1>
            <p className="mt-3 max-w-md text-sm opacity-85 md:text-base">
              Peak surplus window is open. Shift your loads now and turn sunshine into PRIME Points.
            </p>
          </div>
          <div className="self-end rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-semibold"><BatteryCharging className="h-4 w-4 text-solar" /> Home Battery (BESS)</span>
              <span className="font-display text-2xl font-bold"><AnimatedNumber value={battery} />%</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-primary-foreground/20">
              <div className="h-full rounded-full bg-gradient-solar transition-[width] duration-700 ease-[var(--ease-out)]" style={{ width: `${battery}%` }} />
            </div>
            <p className="mt-2 text-xs opacity-80">Surplus window 11:30 AM – 3:00 PM</p>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k, i) => (
          <Panel key={k.label} className="rise lift" style={{ animationDelay: `${i * 60}ms` }}>
            <div className={cn("mb-4 flex h-10 w-10 items-center justify-center rounded-xl", k.tone === "solar" ? "bg-solar-soft text-accent-foreground" : "bg-secondary text-primary")}>
              <k.Icon className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">{k.label}</p>
            <p className="mt-1 font-display text-3xl font-bold">{k.value}</p>
            <p className={cn("mt-3 text-xs", k.badge ? "inline-flex rounded-full bg-success-soft px-2.5 py-1 font-semibold text-primary" : "text-muted-foreground")}>{k.sub}</p>
          </Panel>
        ))}
        <button
          onClick={() => document.getElementById("rewards")?.scrollIntoView({ behavior: "smooth" })}
          className="rise lift press group cursor-pointer rounded-2xl bg-gradient-emerald p-5 text-left text-primary-foreground shadow-card md:p-6"
          style={{ animationDelay: "180ms" }}
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-solar text-solar-foreground"><Coins className="h-5 w-5" /></span>
            <ArrowUpRight className="h-5 w-5 opacity-70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
          <p className="text-sm font-medium opacity-80">PRIME Solar Credits Earned</p>
          <p className="mt-1 font-display text-3xl font-bold"><AnimatedNumber value={points} /> <small className="text-base font-semibold opacity-70">Pts</small></p>
          <p className="mt-3 text-xs opacity-80">Redeemable at {s.mall} →</p>
        </button>
      </section>

      {/* Bill forecast */}
      <section className="rise flex flex-wrap items-center gap-4 rounded-2xl border bg-card p-4 shadow-card md:px-6" style={{ animationDelay: "220ms" }}>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary"><Receipt className="h-5 w-5" /></span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">October TNB bill forecast: <span className="font-display text-lg text-primary">RM {s.bill.toFixed(2)}</span></p>
          <p className="text-xs text-muted-foreground">{billCut}% below last October (RM {s.lastBill.toFixed(2)}) · solar self-consumption 71% · TNBX smart-meter synced 12 min ago</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-3 py-1.5 text-xs font-bold text-primary">
          <TrendingDown className="h-3.5 w-3.5" /> −RM {(s.lastBill - s.bill).toFixed(2)}
        </span>
      </section>

      {/* Chart */}
      <Panel>
        <SectionTitle
          eyebrow="24-hour profile"
          title="Solar Yield vs Household Consumption"
          action={
            <div className="flex gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-solar" /> Solar Generation (kW)</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-grid" /> Household Grid Draw (kW)</span>
            </div>
          }
        />
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chart} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="gSolar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--solar)" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="var(--solar)" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gLoad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--grid)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--grid)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 6" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} unit=" kW" width={60} />
              <Tooltip
                contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-card)", fontSize: 13 }}
                formatter={(v: number, n: string) => [`${v.toFixed(1)} kW`, n === "solar" ? "Solar Generation" : "Household Grid Draw"]}
              />
              <Area type="monotone" dataKey="solar" stroke="var(--solar)" strokeWidth={2.5} fill="url(#gSolar)" />
              <Area type="monotone" dataKey="load" stroke="var(--grid)" strokeWidth={2.5} fill="url(#gLoad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-solar-soft px-4 py-3 text-sm font-semibold text-accent-foreground">
          <Zap className="h-4 w-4" /> Net Solar Peak Surplus Window (11:30 AM – 3:00 PM)
          <span className="ml-auto rounded-full bg-card px-2.5 py-0.5 text-xs">Battery Charge: <AnimatedNumber value={battery} />%</span>
        </div>
    </Panel>

      {/* AI Energy Coach */}
      <Panel className="rise relative overflow-hidden">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-solar-soft blur-2xl" />
        <SectionTitle
          eyebrow="AI Energy Coach"
          title="Your personalised energy briefing"
          action={<span className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary"><BrainCircuit className="h-3.5 w-3.5" /> Updated {String(hour).padStart(2, "0")}:00 MYT</span>}
        />
        <div className="grid gap-3 md:grid-cols-2">
          {[
            {
              Icon: CloudSun, tone: "solar",
              title: "Surplus window opening at 11:30 AM",
              body: `Irradiance forecast is 12% above the ${area} monthly mean. Your roof will generate ~4.8 kW at peak — enough to cover your home and still export.`,
            },
            !exported
              ? { Icon: BatteryCharging, tone: "primary", title: `Battery at ${battery}% — export the excess`, body: `Holding above 80% wastes tonight's headroom. Exporting 4.0 kWh to the ${area} micro-grid earns +120 PRIME Points and powers Central Park lighting.` }
              : { Icon: Check, tone: "success", title: "Export complete — nicely done", body: `Your 4.0 kWh export is lighting ${area} Central Park tonight. Battery headroom restored for tomorrow's morning peak.` },
            !ev
              ? { Icon: Car, tone: "primary", title: "Move EV charging to 12:30 PM", body: "Charging at 7 PM costs you peak TNB tariff. Shifting to the solar window saves RM 7.40 per session — about RM 222 a year." }
              : { Icon: TrendingDown, tone: "success", title: "EV charging locked to solar window", body: "Session scheduled for 12:30 PM. Estimated RM 7.40 grid tariff avoided on this charge alone." },
            {
              Icon: Sparkles, tone: "solar",
              title: "Coach's pick for tomorrow",
              body: wash
                ? "Laundry already ran on 100% solar today. Tomorrow: pre-cool the house at 1 PM instead of 6 PM to cut evening grid draw by ~30%."
                : "Run the washing machine during the surplus window and pre-cool the house at 1 PM — together they cut evening grid draw by ~30%.",
            },
          ].map((c) => (
            <div key={c.title} className="flex gap-3 rounded-xl border bg-background/60 p-4">
              <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", c.tone === "solar" ? "bg-solar-soft text-accent-foreground" : c.tone === "success" ? "bg-success-soft text-primary" : "bg-secondary text-primary")}>
                <c.Icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-bold leading-snug">{c.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Leaderboard */}
      <Panel className="rise">
        <SectionTitle
          eyebrow="Community"
          title={`${area} Solar Leaderboard — October`}
          action={<span className="flex items-center gap-1.5 rounded-full bg-solar-soft px-3 py-1 text-xs font-bold text-accent-foreground"><Trophy className="h-3.5 w-3.5" /> You are #3 of {s.homes.toLocaleString("en-MY")} homes</span>}
        />
        <div className="space-y-2">
          {[
            { rank: 1, name: "Lim Wei Shen", street: `${area} · Precinct 2`, kwh: 412.6, pts: 2410 },
            { rank: 2, name: "Priya Nair", street: `${area} · Precinct 1`, kwh: 398.1, pts: 2285 },
            { rank: 3, name: userName, street: `${area} · Precinct 1`, kwh: 384.4, pts: points, you: true },
            { rank: 4, name: "Tan Mei Ling", street: `${area} · Precinct 3`, kwh: 371.9, pts: 1940 },
            { rank: 5, name: "Raj Kumar", street: `${area} · Precinct 2`, kwh: 358.2, pts: 1875 },
          ].map((r) => (
            <div key={r.rank} className={cn("flex items-center gap-3 rounded-xl border p-3 transition-colors", r.you ? "border-solar/60 bg-solar-soft/60" : "bg-background hover:bg-muted/60")}>
              <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold", r.rank === 1 ? "bg-gradient-solar text-solar-foreground" : "bg-muted text-muted-foreground")}>{r.rank}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{r.name} {r.you && <span className="ml-1 rounded-full bg-gradient-solar px-2 py-0.5 text-[10px] font-bold text-solar-foreground">YOU</span>}</p>
                <p className="truncate text-xs text-muted-foreground">{r.street}</p>
              </div>
              <span className="tabular hidden text-sm font-semibold sm:inline">{r.kwh.toFixed(1)} kWh</span>
              <span className="tabular flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-bold text-primary"><Coins className="h-3 w-3" /> {r.pts.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">Top home each month wins a RM 100 {s.mall} voucher · 26 kWh to catch #2</p>
      </Panel>

      {/* AI Load shifting */}
      <section>
        <SectionTitle eyebrow="AI load-shifting engine" title="Recommended actions right now" action={<span className="flex items-center gap-1.5 text-xs font-semibold text-primary"><Sparkles className="h-4 w-4" /> 3 opportunities</span>} />
        <div className="grid gap-4 md:grid-cols-3">
          <ActionCard
            Icon={Car}
            title="EV Smart Charger Load-Shift"
            subtitle={`Solar surplus detected at 12:30 PM (+3.2 kW reserve at ${area}).`}
            detail="Charge your EV during peak irradiance to save RM 7.40 in grid tariffs."
            impact="Save RM 7.40"
            done={ev}
            label="Schedule Smart EV Charging"
            doneLabel={<><Check className="h-4 w-4" /> Scheduled for 12:30 PM</>}
            onClick={() => { setEv(true); toast.success("EV Smart Charger synced via TNBX API — Scheduled for 12:30 PM."); }}
          />
          <ActionCard
            Icon={WashingMachine}
            title="Heat Pump & Washing Machine Sync"
            subtitle="High irradiance forecast for next 3 hours."
            detail="Run heavy laundry cycles now using 100% self-generated solar power."
            impact="100% solar"
            done={wash}
            label="Start Smart Cycle Now"
            doneLabel={<><RefreshCw className="h-4 w-4 animate-spin" /> Washing Cycle Running</>}
            onClick={() => { setWash(true); toast.success("Smart Washer Signal Executed — Solar Cycle Running."); }}
          />
          <ActionCard
            Icon={Lamp}
            title="Micro-Grid Common Area Power Export"
            subtitle={`Battery energy storage (BESS) at ${battery}% capacity.`}
            detail={`Export 4.0 kWh reserve to power ${area} Central Park streetlights.`}
            impact="+120 Pts"
            done={exported}
            label="Export Power (+120 PRIME Pts)"
            doneLabel={<><Check className="h-4 w-4" /> Exported Today</>}
            onClick={() => {
              setExported(true); setPoints((p) => p + 120); setBattery(76);
              toast.success(`4.0 kWh exported to ${area} Township Grid! +120 PRIME Points added.`);
            }}
            featured
          />
        </div>
      </section>

      {/* Rewards */}
      <section id="rewards" className="scroll-mt-24">
        <SectionTitle eyebrow="Solar-to-Retail" title="PRIME Rewards Marketplace" action={<span className="rounded-full bg-secondary px-3 py-1 text-sm font-bold text-primary">Balance: <AnimatedNumber value={points} /> Pts</span>} />
        <div className="grid gap-4 md:grid-cols-3">
          {VOUCHERS.map((v) => {
            const ok = points >= v.cost;
            return (
              <div key={v.id} className="lift relative overflow-hidden rounded-2xl border bg-card shadow-card">
                <div className="relative flex h-28 items-center justify-between bg-gradient-emerald px-5 text-primary-foreground">
                  <v.Icon className="h-10 w-10 opacity-90" />
                  <span className="font-display text-3xl font-extrabold text-solar">{v.cost}<small className="ml-1 text-sm text-primary-foreground/80">Pts</small></span>
                  <span className="absolute -bottom-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-card" />
                </div>
                <div className="border-t border-dashed p-5">
                  <h3 className="font-bold">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{placeOf(v)}</p>
                  <Button onClick={() => redeem(v)} className={cn("press mt-4 w-full cursor-pointer rounded-xl", !ok && "bg-muted text-muted-foreground hover:bg-muted")}>
                    Redeem Voucher
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Dialog open={!!voucher} onOpenChange={(o) => !o && setVoucher(null)}>
        <DialogContent className="max-w-sm overflow-hidden rounded-3xl p-0">
          {voucher && (
            <>
              <div className="bg-gradient-emerald p-6 text-primary-foreground">
                <voucher.Icon className="h-9 w-9 text-solar" />
                <DialogHeader className="mt-3 text-left">
                  <DialogTitle className="text-2xl text-primary-foreground">{voucher.title}</DialogTitle>
                  <DialogDescription className="text-primary-foreground/80">{placeOf(voucher)} · Valid 30 days</DialogDescription>
                </DialogHeader>
              </div>
              <div className="flex flex-col items-center gap-3 p-6">
                <div className="grid w-full grid-cols-2 gap-2">
                  <div className="rounded-xl bg-muted p-3 text-center">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Voucher value</p>
                    <p className="font-display text-lg font-bold">RM {voucher.rm.toFixed(2)}</p>
                  </div>
                  <div className="rounded-xl bg-success-soft p-3 text-center">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">CO₂ you avoided</p>
                    <p className="font-display text-lg font-bold text-primary">{voucher.co2.toFixed(1)} kg</p>
                  </div>
                </div>
                <p className="text-center text-xs text-muted-foreground">Earned from your exported solar energy — sunshine, cashed out.</p>
                <div className="rounded-2xl border p-3"><QrGraphic seed={code} /></div>
                <p className="text-xs text-muted-foreground">Redemption code</p>
                <p className="rounded-lg bg-muted px-3 py-1.5 font-mono text-sm font-medium tracking-wider">{code}</p>
                <Button
                  className="press mt-2 w-full cursor-pointer rounded-xl"
                  onClick={() => setVoucher(null)}
                >
                  Close — saved in My Vouchers
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ActionCard({ Icon, title, subtitle, detail, impact, done, label, doneLabel, onClick, featured }: {
  Icon: React.ComponentType<{ className?: string }>; title: string; subtitle: string; detail: string; impact: string;
  done: boolean; label: string; doneLabel: React.ReactNode; onClick: () => void; featured?: boolean;
}) {
  return (
    <Panel className={cn("lift flex flex-col", featured && "border-solar/50 ring-1 ring-solar/30")}>
      <div className="flex items-start justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary"><Icon className="h-5 w-5" /></span>
        <span className="rounded-full bg-solar-soft px-2.5 py-1 text-xs font-bold text-accent-foreground">{impact}</span>
      </div>
      <h3 className="mt-4 text-lg font-bold leading-snug">{title}</h3>
      <p className="mt-1 text-sm italic text-muted-foreground">{subtitle}</p>
      <p className="mt-3 flex-1 text-sm">{detail}</p>
      <Button
        disabled={done}
        onClick={onClick}
        className={cn("press mt-5 h-11 w-full cursor-pointer gap-2 rounded-xl font-semibold", done && "bg-success text-primary-foreground disabled:opacity-100", featured && !done && "bg-gradient-solar text-solar-foreground shadow-solar hover:opacity-95")}
      >
        {done ? doneLabel : label}
      </Button>
    </Panel>
  );
}
