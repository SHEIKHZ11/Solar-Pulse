import { useState } from "react";
import { Sun, Home, BarChart3, ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import township from "@/assets/township.jpg";
import { TOWNSHIPS, type Role, type Township } from "./shared";

export type Session = { name: string; role: Role; township: Township };

export function Welcome({ onEnter }: { onEnter: (s: Session) => void }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("resident");
  const [t, setT] = useState<Township>(TOWNSHIPS[0]);
  const valid = name.trim().length >= 2;

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img src={township} alt="Solar rooftops in a Sime Darby Property township" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="relative flex h-full flex-col justify-end p-12 text-primary-foreground">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-solar">Sime Darby Property</p>
          <h2 className="mt-2 max-w-md text-4xl font-extrabold leading-tight">Every rooftop, one township power plant.</h2>
          <p className="mt-3 max-w-md text-sm opacity-85">Track solar yield, shift loads with AI, and turn clean energy into PRIME rewards.</p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6">
        <form
          className="rise w-full max-w-md space-y-6"
          onSubmit={(e) => { e.preventDefault(); if (valid) onEnter({ name: name.trim(), role, township: t }); }}
        >
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-solar"><Sun className="h-5 w-5 text-solar-foreground" /></span>
            <span className="font-display text-xl font-bold">SolarPulse</span>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold">Welcome</h1>
            <p className="mt-1 text-sm text-muted-foreground">Tell us who you are to open your dashboard.</p>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-semibold">Your name</span>
            <Input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ahmad Razak" maxLength={40} className="h-12 rounded-xl" />
          </label>

          <div className="space-y-2">
            <span className="text-sm font-semibold">I am a</span>
            <div className="grid grid-cols-2 gap-3">
              {([["resident", Home, "Resident", "My home's solar & rewards"], ["executive", BarChart3, "SDP Executive", "Portfolio & ESG reporting"]] as const).map(([r, Icon, label, desc]) => (
                <button type="button" key={r} onClick={() => setRole(r)}
                  className={cn("press cursor-pointer rounded-2xl border p-4 text-left transition-colors", role === r ? "border-primary bg-secondary" : "bg-card hover:bg-muted")}>
                  <Icon className={cn("h-5 w-5", role === r ? "text-primary" : "text-muted-foreground")} />
                  <p className="mt-2 text-sm font-bold">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-semibold">{role === "resident" ? "My township" : "Focus township"}</span>
            <Select value={t} onValueChange={(v) => setT(v as Township)}>
              <SelectTrigger className="h-12 rounded-xl"><MapPin className="h-4 w-4 text-primary" /><SelectValue /></SelectTrigger>
              <SelectContent>{TOWNSHIPS.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
            </Select>
          </label>

          <Button type="submit" disabled={!valid} className="press h-12 w-full cursor-pointer gap-2 rounded-xl text-base font-bold">
            Open dashboard <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
