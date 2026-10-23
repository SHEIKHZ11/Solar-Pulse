import { Sun, Leaf, Home, BarChart3, ShieldCheck, Coins, MapPin, Ticket, Bell, Zap, BrainCircuit, AlertTriangle, FileWarning, BatteryCharging, LogOut } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { AnimatedNumber, TOWNSHIPS, initials, shortName, type Role, type Township } from "./shared";

const RESIDENT_NOTIFS = [
  { Icon: Zap, tone: "solar", title: "Export confirmed", body: "4.0 kWh sent to your township micro-grid · +120 PRIME Pts", time: "12 min ago" },
  { Icon: BrainCircuit, tone: "primary", title: "AI Coach briefing ready", body: "Surplus window opens 11:30 AM — 3 actions recommended", time: "2 h ago" },
  { Icon: Ticket, tone: "primary", title: "New reward available", body: "KL East Mall added a RM 20 Shopping Pass to the marketplace", time: "Yesterday" },
];

const EXEC_NOTIFS = [
  { Icon: AlertTriangle, tone: "warn", title: "2 inverters offline", body: "Serenia City pre-install survey — maintenance dispatched", time: "34 min ago" },
  { Icon: FileWarning, tone: "warn", title: "CDP Q4 submission due", body: "Board report draft ready for review · 12 days remaining", time: "3 h ago" },
  { Icon: BatteryCharging, tone: "primary", title: "Elmina BESS at 91%", body: "Central Park storage nearing capacity — export window advised", time: "1 h ago" },
];


export function Header({ role, setRole, township, setTownship, points, walletCount, onOpenWallet, userName, onSignOut }: {
  role: Role; setRole: (r: Role) => void; township: Township; setTownship: (t: Township) => void; points: number;
  walletCount: number; onOpenWallet: () => void; userName: string; onSignOut: () => void;
}) {
  const resident = role === "resident";
  const notifs = resident ? RESIDENT_NOTIFS : EXEC_NOTIFS;
  return (
    <header className="sticky top-0 z-40 border-b bg-card/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 md:px-6">
        <div className="flex items-center gap-2 rounded-full bg-gradient-emerald py-1.5 pl-1.5 pr-4 text-primary-foreground shadow-lift">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-solar sun-pulse">
            <Sun className="h-4 w-4 text-solar-foreground" />
          </span>
          <span className="text-sm font-semibold leading-tight">
            <span className="hidden opacity-80 2xl:inline">Sime Darby Property | </span>
            <span className="font-display font-bold">SolarPulse</span>
          </span>
          <Leaf className="h-4 w-4 opacity-80" />
        </div>

        <Select value={township} onValueChange={(v) => setTownship(v as Township)}>
          <SelectTrigger className="h-10 w-auto rounded-full border-border bg-background font-medium" aria-label="Select township">
            <MapPin className="h-4 w-4 text-primary" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TOWNSHIPS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>


        <span className={cn("flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold md:ml-auto sm:text-sm", resident ? "bg-secondary text-primary" : "bg-ink text-ink-foreground")}>
          {resident ? <Home className="h-4 w-4" /> : <BarChart3 className="h-4 w-4" />} {resident ? "Resident Dashboard" : "SDP Executive Dashboard"}
        </span>

        <Popover>
          <PopoverTrigger asChild>
            <button aria-label="Notifications" className="press relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border bg-background text-muted-foreground transition-colors hover:text-foreground">
              <Bell className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                {notifs.length}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 rounded-2xl p-2">
            <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Notifications</p>
            {notifs.map((n) => (
              <div key={n.title} className="flex gap-3 rounded-xl p-3 transition-colors hover:bg-muted">
                <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", n.tone === "warn" ? "bg-solar-soft text-accent-foreground" : n.tone === "solar" ? "bg-solar-soft text-accent-foreground" : "bg-secondary text-primary")}>
                  <n.Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-snug">{n.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{n.body}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground/70">{n.time}</p>
                </div>
              </div>
            ))}
          </PopoverContent>
        </Popover>

        {resident && (
          <button
            onClick={onOpenWallet}
            className="press relative flex cursor-pointer items-center gap-1.5 rounded-full border bg-background px-3.5 py-2 text-xs font-bold text-muted-foreground transition-colors hover:text-foreground"
          >
            <Ticket className="h-3.5 w-3.5" />
            My Vouchers
            {walletCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-solar px-1 text-[10px] font-bold text-solar-foreground">
                {walletCount}
              </span>
            )}
          </button>
        )}

        <div className="flex items-center gap-2 rounded-full border bg-background py-1 pl-1 pr-1">
          <span className={cn("flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold", resident ? "bg-secondary text-secondary-foreground" : "bg-ink text-ink-foreground")}>
            {initials(userName)}
          </span>
          <span className="hidden flex-col pr-1 leading-tight 2xl:flex">
            <span className="text-sm font-semibold">{userName}</span>
            <span className="text-[11px] text-muted-foreground">{resident ? `Resident · ${shortName(township)}` : "SDP Executive"}</span>
          </span>
          {resident ? (
            <span className="flex items-center gap-1 rounded-full bg-gradient-solar px-3 py-1.5 text-xs font-bold text-solar-foreground">
              <Coins className="h-3.5 w-3.5" /> <AnimatedNumber value={points} /> Pts
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-ink px-3 py-1.5 text-xs font-bold text-ink-foreground">
              <ShieldCheck className="h-3.5 w-3.5" /> SDP Admin Access
            </span>
          )}
          <button onClick={onSignOut} aria-label="Sign out" title="Sign out" className="press flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
