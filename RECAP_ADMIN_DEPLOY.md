# Contest Recap — Admin Panel Deploy Guide

Companion to the hub runbook (`CONTEST_RECAP_DEPLOY.md` in **beanstalk-api**),
covering just the web portal's part: the admin **Contest Recap** panel. Read the
hub runbook first — the API/BigQuery steps this drives live there.

## What the portal adds

A **Contest Recap** section in the contest-manager drawer, shown for a
**concluded** contest (`src/app/modules/admin/contest-manager/`):

- **Generate** — creates or loads the recap **draft** (`POST .../recap/generate`;
  idempotent, so it also surfaces a draft that auto-generated on conclude,
  without a new model call). **Regenerate** forces a fresh one.
- **Preview** — the recap exactly as players will see it: headline, market
  recap, highlight cards, the benchmark scoreboard (% beat market / savings),
  lessons, sign-off, with a Draft/Published badge + model + generated time.
- **Publish** — `POST .../recap/publish`; flips the draft live so players see it.

## What it depends on (do the hub runbook first)

The panel is a thin client over the API. Before it works end to end:

1. The **API is deployed** with the recap endpoints and `ANTHROPIC_API_KEY` set
   (until then, **Generate** surfaces an error instead of a draft).
2. **Migrations 011 & 012** have run.
3. You're signed in as an **admin / contest_manager** — the panel reuses the
   same auth as the existing Create/Conclude actions, and the
   generate/publish endpoints require that role.

### Config

The panel calls `${environment.baseUrl}/api/contests/:id/recap*`, so the only
config is that **`environment.prod.ts`'s `baseUrl` points at the deployed API**
(same origin the rest of the console already uses). Nothing recap-specific to add.

## Build & deploy

```bash
# From beanstalk-web, on merged main
npm ci

# The real gate — repo CI is GitGuardian only, so the build is what catches
# regressions. Must be clean.
npx ng build            # or: npm run build
```

> The contest-manager component's `anyComponentStyle` **warning** budget was
> raised 8 kb → 12 kb (the component is large: create form + lesson-gate picker
> + participants + notifications + recap). The **16 kb error ceiling is
> unchanged**, so a genuinely oversized stylesheet still fails the build.

Then deploy the built `dist/` through the portal's usual hosting process.

## Verify in the console

1. Open a **concluded** contest → the drawer shows the **Contest Recap** section.
2. **Generate** → the draft preview renders with a **Draft** badge.
3. Review it, then **Publish** → the badge flips to **Published** and
   "Players can now see this recap in the app."
4. A `404`/error on Generate almost always means the API is missing
   `ANTHROPIC_API_KEY` — see the hub runbook's smoke-test section.

## Related

- **Hub runbook:** `CONTEST_RECAP_DEPLOY.md` (beanstalk-api) — migrations,
  secrets, and the full curl smoke test.
- **Mobile:** `docs/CONTEST_RECAP_MOBILE.md` (beanstalk-mobile) — the
  player-facing Recap screen.
