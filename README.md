# ga4_reporting_eppi

Eppi-vlastnená kópia Dataform receptu pre GA4 reporting pipeline (projekt gtm-ntxrpzps-ywm3z).
Migrované 7.7.2026 z github.com/janveverka86/ga4_reporting_roi (Roistory) kvôli nezávislosti.

**Jediná zmena oproti originálu:** kurzové + country referencie prepnuté z Roistory projektu
`roitools-bigquery` na náš `gtm-ntxrpzps-ywm3z`:
- `exchange_rates.daily_rates_*` (kurzy EUR/USD/CZK) — populuje vlastný FX loader + one-time backfill
- `country_information.loaded_csv_country_information` (vlajky krajín) — statické, backfill z Roistory

Kompiluje `dataform-exec@` SA. Release "production" → repoint na tento repo.
