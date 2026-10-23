import { Ticket, Leaf, Wallet } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QrGraphic, type RedeemedVoucher } from "./shared";

export function WalletDialog({ open, onOpenChange, vouchers }: {
  open: boolean; onOpenChange: (o: boolean) => void; vouchers: RedeemedVoucher[];
}) {
  const totalRm = vouchers.reduce((s, v) => s + v.rm, 0);
  const totalCo2 = vouchers.reduce((s, v) => s + v.co2, 0);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md overflow-hidden rounded-3xl p-0">
        <div className="bg-gradient-emerald p-6 text-primary-foreground">
          <Wallet className="h-8 w-8 text-solar" />
          <DialogHeader className="mt-3 text-left">
            <DialogTitle className="text-2xl text-primary-foreground">My Voucher Wallet</DialogTitle>
            <DialogDescription className="text-primary-foreground/80">
              {vouchers.length > 0
                ? `${vouchers.length} voucher${vouchers.length > 1 ? "s" : ""} · RM ${totalRm.toFixed(2)} value · ${totalCo2.toFixed(1)} kg CO₂ avoided`
                : "Your redeemed PRIME rewards live here"}
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="max-h-[55vh] space-y-3 overflow-y-auto p-5">
          {vouchers.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground"><Ticket className="h-6 w-6" /></span>
              <p className="text-sm font-semibold">No vouchers yet</p>
              <p className="max-w-xs text-xs text-muted-foreground">Earn PRIME Points from your solar roof, then redeem them in the Rewards Marketplace below.</p>
            </div>
          ) : (
            vouchers.map((v) => (
              <div key={v.code} className="flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-card">
                <div className="shrink-0 rounded-xl border p-1.5"><QrGraphic seed={v.code} size={64} /></div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{v.title}</p>
                  <p className="text-xs text-muted-foreground">{v.place} · Valid 30 days</p>
                  <p className="mt-1 font-mono text-[11px] tracking-wide text-muted-foreground">{v.code}</p>
                  <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-primary">
                    <Leaf className="h-3 w-3" /> {v.co2.toFixed(1)} kg CO₂ avoided · Redeemed {v.redeemedAt}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-solar-soft px-2.5 py-1 text-xs font-bold text-accent-foreground">RM {v.rm}</span>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
