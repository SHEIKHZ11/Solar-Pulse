# SolarPulse

**Township-scale solar intelligence for Sime Darby Property.**

SolarPulse turns a township's rooftop solar fleet into something residents can act on and the
developer can report on. One platform, two audiences:

- **Residents** see what their roof is earning right now, get an AI Energy Coach that tells them
  exactly when to shift load (EV charging, washing machine, pre-cooling) into their surplus window,
  and spend the points they save on real vouchers at their own township mall — every redemption
  showing the ringgit and the kilograms of CO₂ it cost to earn.
- **Sime Darby Property executives** get an ESG command centre: portfolio yield, township-by-township
  grid state, offline inverters, and a board-ready CDP / NETR report pulled from the same numbers
  residents are seeing.

## Why it exists

Township solar today is meters nobody reads. Residents have panels but no feedback loop, so nothing
changes at 2pm on a Sunday. The developer has ESG targets (CDP, NETR) but only gets data once a
quarter, after the fact. SolarPulse closes both gaps with the same dataset: the resident's RM 14 a
month is the executive's 22% footfall and the board's carbon number.

## What's in the prototype

| Area | What it does |
| --- | --- |
| Welcome gate | Name, role and township — the dashboard is built around those answers. |
| Resident dashboard | Live yield, savings and CO₂ for the chosen township; 24-hour generation chart; bill forecast; neighbourhood leaderboard. |
| AI Energy Coach | Surplus-window briefing, an export recommendation when the battery is full, and a coach's pick for tomorrow's load shifting. |
| PRIME rewards | Three vouchers with RM + CO₂ impact receipts, a unique redemption code, QR pass, and a "My Vouchers" wallet (resident only). |
| Executive dashboard | Portfolio KPIs, township table, generation breakdown, "needs attention" ops panel, and a printable CDP / NETR board report. |
| Township data | City of Elmina and Bandar Bukit Raja are live Phase 1 (2,090 homes); Serenia City and Nilai Impian are Phase 2 and labelled projected. |

Switching township changes every figure in the app — solar yield, savings, bill forecast, chart
scale, the mall the vouchers redeem at, and the leaderboard size.

## Data model

| Township | Phase | Homes | Capacity |
| --- | --- | --- | --- |
| City of Elmina | 1 — active | 1,240 (Ilham 513 + Ridge 727) | 6,200 kWp |
| Bandar Bukit Raja | 1 — active | 850 | 4,250 kWp |
| Serenia City | 2 — planned | 480 | projected |
| Nilai Impian | 2 — planned | 210 | projected |

Voucher catalog: RM 10 F&B (4.2 kg CO₂), RM 20 retail (8.4 kg), RM 15 park & recreation (6.3 kg).

All figures are simulated from TNB tariff structure, SEDA NEM 3.0 and NETR targets. No customer data
is used. The TNB smart-meter, inverter and PRIME reward integrations are simulated behind the same
service boundaries they would use in production.

## Path to a real product

1. Pilot in one township — City of Elmina, where the meter population already exists.
2. Replace the simulated feeds with TNB smart-meter export, inverter APIs and the PRIME rewards service.
3. Add account linking so a resident's real roof and real bill appear.
4. Roll out to the remaining Phase 1 townships, then Phase 2.

## Run it

```sh
npm i
npm run dev
```

Open http://localhost:8080.

## Built with

TanStack Start (React 19, TypeScript) · Tailwind CSS v4 · Recharts · sonner · lucide-react.
No backend, no database and no API keys — the prototype is self-contained so it runs the same for
everyone who clones it.

## Sources

TNB tariff structure · SEDA NEM 3.0 · Sime Darby Property NETR and CDP disclosures.
