import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/solar/Header";
import { ResidentView } from "@/components/solar/ResidentView";
import { ExecutiveView } from "@/components/solar/ExecutiveView";
import { WalletDialog } from "@/components/solar/WalletDialog";
import { Welcome, type Session } from "@/components/solar/Welcome";
import type { RedeemedVoucher, Role, Township } from "@/components/solar/shared";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SolarPulse — Sime Darby Property Township Energy Platform" },
      { name: "description", content: "Live rooftop solar, AI load-shifting, PRIME rewards and ESG reporting for Sime Darby Property townships." },
      { property: "og:title", content: "SolarPulse — Sime Darby Property" },
      { property: "og:description", content: "Township solar energy, rewards and ESG reporting in one platform." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const KEY = "solarpulse-session";

function Index() {
  const [ready, setReady] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const [role, setRole] = useState<Role>("resident");
  const [township, setTownship] = useState<Township>("City of Elmina (Ilham & Ridge)");
  const [points, setPoints] = useState(1850);
  const [battery, setBattery] = useState(88);
  const [wallet, setWallet] = useState<RedeemedVoucher[]>([]);
  const [walletOpen, setWalletOpen] = useState(false);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || "null") as Session | null;
      if (s?.name) { setName(s.name); setRole(s.role); setTownship(s.township); }
    } catch { /* ignore */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (name) localStorage.setItem(KEY, JSON.stringify({ name, role, township }));
  }, [name, role, township]);

  if (!ready) return <div className="min-h-screen bg-background" />;
  if (!name) return <Welcome onEnter={(s) => { setName(s.name); setRole(s.role); setTownship(s.township); }} />;

  const signOut = () => {
    localStorage.removeItem(KEY);
    setName(null); setPoints(1850); setBattery(88); setWallet([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        role={role} setRole={setRole} township={township} setTownship={setTownship}
        points={points} walletCount={wallet.length} onOpenWallet={() => setWalletOpen(true)}
        userName={name} onSignOut={signOut}
      />
      <main key={role} className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        {role === "resident" ? (
          <ResidentView
            key={township}
            township={township} userName={name} points={points} setPoints={setPoints} battery={battery} setBattery={setBattery}
            onRedeem={(v) => setWallet((w) => [v, ...w])}
          />
        ) : (
          <ExecutiveView township={township} />
        )}
      </main>
      <WalletDialog open={walletOpen} onOpenChange={setWalletOpen} vouchers={wallet} />
      <footer className="mx-auto max-w-7xl px-6 pb-10 text-center text-xs text-muted-foreground">
        SolarPulse prototype · Sime Darby Property University Hackathon 2026<br />
        Data references: TNB tariff structure · SEDA NEM 3.0 · National Energy Transition Roadmap (NETR)
      </footer>
    </div>
  );
}
