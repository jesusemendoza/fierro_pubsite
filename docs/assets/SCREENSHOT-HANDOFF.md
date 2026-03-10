# Screenshot Capture Plan (DELETE AFTER COMPLETE)

Playwright MCP is configured in `~/.claude/settings.json`. Use it to automate the desktop screenshots below.

## App URL

https://app.getfierro.com

## Credentials

| Account | Email | Password |
|---------|-------|----------|
| Sarah Chen (homeowner) | `demo+homeowner@getfierro.com` | `DemoFierro2026!` |
| Marcus Rivera (flipper) | `demo+flipper@getfierro.com` | `DemoFierro2026!` |
| Tony Mendez (contractor) | `demo+homeowner+contractor1@getfierro.com` | `DemoFierro2026!` |

## Output Directories

- Desktop: `docs/assets/screenshots/desktop/`
- Mobile: `docs/assets/screenshots/mobile/` (manual — phone captures)

## Desktop Screenshots (automate with Playwright)

For each account: navigate to login, enter credentials, then capture the screens listed.

### Session 1 — Sarah Chen (homeowner owner)

| # | File Name | Page / Action |
|---|-----------|---------------|
| 1 | `homeowner-dashboard.png` | Project overview — budget bars, category breakdown, total spend vs budget |
| 2 | `homeowner-expenses.png` | Expense list — show mix of included/pending/rejected status badges |
| 3 | `homeowner-expense-detail.png` | Click into a single expense — vendor, category, amount, approval info |
| 4 | `homeowner-approvals.png` | Pending approvals queue — contractor-submitted expenses awaiting review |
| 5 | `homeowner-audit.png` | Audit timeline — add/approve/reject events with actor names and timestamps |
| 6 | `homeowner-team.png` | Team/collaborators view — Sarah (owner), Tony (GC), Maria (plumber) |

### Session 2 — Marcus Rivera (flipper owner)

| # | File Name | Page / Action |
|---|-----------|---------------|
| 7 | `flipper-portfolio.png` | Multi-project view — 3 flips at different stages (Pine St 12%, Elm St 85%, Oak Ave 89%) |
| 8 | `flipper-project-detail.png` | Click into Elm St project — mid-renovation budget categories with spend bars |

### Session 3 — Tony Mendez (contractor)

| # | File Name | Page / Action |
|---|-----------|---------------|
| 9 | `contractor-dashboard.png` | Contractor POV — scoped view of Kitchen & Bath Remodel project |
| 10 | `contractor-add-expense.png` | Click add expense — capture the form mid-entry (fill a couple fields but don't submit) |

## Mobile Screenshots (manual — grab from phone)

Login at https://app.getfierro.com on your phone and screenshot these:

| # | Login As | File Name | What to Capture |
|---|----------|-----------|-----------------|
| 1 | Sarah Chen | `homeowner-dashboard-mobile.png` | Budget ring/bars — hero shot |
| 2 | Sarah Chen | `homeowner-expenses-mobile.png` | Scrollable expense list with status badges |
| 3 | Sarah Chen | `homeowner-approval-action-mobile.png` | Contractor expense with approve/reject buttons |
| 4 | Marcus Rivera | `flipper-portfolio-mobile.png` | 3 project cards with progress indicators |
| 5 | Marcus Rivera | `flipper-project-mobile.png` | Elm St detail — budget categories |
| 6 | Tony Mendez | `contractor-add-expense-mobile.png` | Add expense form |
| 7 | Tony Mendez | `contractor-expenses-mobile.png` | Contractor's own expense list |

## Playwright Tips

- Set viewport to 1440x900 for desktop shots
- Wait for data to load before capturing (network idle or visible elements)
- Use full-page screenshots for list views, viewport-only for dashboards
- If the app uses dark/light mode, capture in light mode for marketing assets

## Context

- Demo data was seeded via the `create-demo-data` skill
- All auth.users token columns are set to empty strings (GoTrue fix)
- `user_profile.role` is cosmetic — access control uses `project_users.role`
- Database IDs: project 200 (homeowner), 300/301/302 (flipper)
- Supabase project: `lzvvfmkwrvkfymmvosgl`
