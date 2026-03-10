---
name: create-demo-data
description: Create realistic demo accounts in Fierro's Supabase database for marketing screenshots, product demos, or testing. Use when you need to seed the database with homeowner, flipper/investor, or contractor personas with realistic projects, expenses, vendors, and budget data.
argument-hint: [persona-type]
---

# Create Demo Data

Create a realistic demo account in Fierro's Supabase database for the persona described in `$ARGUMENTS`.

If no persona is specified, ask the user which persona to create.

## Supabase Project

- **Project ID:** `lzvvfmkwrvkfymmvosgl`
- Use the `mcp__plugin_supabase_supabase__execute_sql` tool for all database operations.

## Account Creation Order

Database has RLS and foreign keys. Insert in this exact order:

1. **auth.users** — the login accounts (owner + team members)
2. **organizations** — the billing container
3. **user_profile** — display name, role, linked to org
4. **organization_memberships** — user ↔ org link (owner + contractors + investors)
5. **projects** — one or more projects under the org
6. **project_users** — user ↔ project link with role (owner/contractor/investor)
7. **sub_projects** — budget categories within each project
8. **vendors** — vendor directory per project
9. **expenses** — individual line items (some created_by contractors, reviewed_by owner)
10. **expense_status_events** — status change history for each expense
11. **audit_timeline** — full audit log (add, approve, reject events)
12. **projects.audit_timeline_enabled** — set `true` on projects that should show audit

## auth.users Insert Template

```sql
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, is_sso_user, is_anonymous,
  confirmation_token, recovery_token,
  email_change_token_new, email_change_token_current, email_change,
  phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '{uuid}',
  'authenticated', 'authenticated',
  '{email}',
  crypt('{password}', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"sub": "{uuid}", "email": "{email}", "email_verified": true, "phone_verified": false}',
  now(), now(), false, false,
  '', '',
  '', '', '',
  '', '', ''
);
```

**Important:**
- Do NOT include `confirmed_at` — it is a generated column and will error.
- All varchar/text columns (`confirmation_token`, `recovery_token`, `email_change_token_new`, `email_change_token_current`, `email_change`, `phone_change`, `phone_change_token`, `reauthentication_token`) MUST be set to empty strings `''`, not left as NULL. GoTrue scans these into Go strings and will throw "Database error querying schema" on login if any are NULL.

## ID Conventions

Use predictable IDs for easy reference and cleanup:

- **User UUIDs:** `de00000X-0000-4000-a000-00000000000X` where X is a sequence number
- **Org IDs:** Start at 100+
- **Project IDs:** Start at 200+
- **Sub-project IDs:** Match the project ID prefix (project 200 → sub_projects 200-209)
- **Vendor IDs:** Match the project ID prefix (project 200 → vendors 200-209)

Check existing max IDs before inserting to avoid conflicts:

```sql
SELECT MAX(id) FROM organizations;
SELECT MAX(id) FROM projects;
SELECT MAX(id) FROM sub_projects;
SELECT MAX(id) FROM vendors;
```

## Schema Reference

### organizations
```
id (bigint), name (text), description (text?), billing_plan (text, default 'free'),
address (text?), timezone (text), image_uri (text)
```
`billing_plan` values: `'free'`, `'plus'`, `'builder'`

### user_profile
```
id (uuid, FK → auth.users), first_name (text?), last_name (text?),
username (text?), role (text?, default 'owner'), organization_id (bigint?, FK → organizations)
```

### organization_memberships
```
organization_id (bigint), user_id (uuid), role (text, default 'member'),
status (text, default 'active')
```
`role` values: `'owner'`, `'admin'`, `'member'`, `'viewer'`

### projects
```
id (bigint), title (text?), description (text?), address (text?),
contract_value (numeric, default 0), organization_id (bigint, FK → organizations)
```

### project_users
```
project_id (bigint), user_id (uuid), role (text, default 'owner')
```
`role` values: `'owner'`, `'contractor'`, `'investor'`

### sub_projects (budget categories)
```
id (bigint), name (text), budget (numeric, default 0), color (text, default 'blue'),
icon (text?, default 'chart'), project_id (bigint, FK → projects), cost_code (text?)
```

### vendors
```
id (bigint), name (text), color (text?, default 'red'), icon (text?),
project_id (bigint?, FK → projects)
```

### expenses
```
id (bigint, identity), title (text), total (numeric), status (text, default 'pending'),
vendor_name (text, CHECK length > 0), vendor_id (bigint, FK → vendors),
expense_date (date, default CURRENT_DATE), sub_project_id (bigint, FK → sub_projects),
project_id (bigint, FK → projects), created_by (uuid, FK → auth.users),
reviewed_by (uuid?, FK → auth.users), reviewed_at (timestamptz?)
```
`status` values: `'pending'`, `'included'`, `'rejected'`

### expense_status_events
```
id (bigint, identity), expense_id (bigint, FK → expenses),
from_status (text?, NULL for creation), to_status (text),
reason (text?), changed_by (uuid?), changed_at (timestamptz, default now())
```

### audit_timeline
```
id (bigint, identity ALWAYS), actor_id (uuid), actor_type (text: 'human'|'ai'),
action (text: 'add'|'approve'|'reject'|'update_settings'),
entity_type (text: 'expense'|'project_settings'), entity_id (bigint),
project_id (bigint, FK → projects),
before_state (jsonb, NULLABLE), after_state (jsonb, NOT NULL),
field_diffs (jsonb, default '[]'), note (text?), created_at (timestamptz)
```
**Important:** `after_state` is NOT NULL — always provide a value, even `'{}'::jsonb`.

## Persona Guidelines

### Homeowner / DIYer
- **Project examples:** Kitchen remodel, bathroom renovation, basement finish, addition, whole-house renovation
- **Budget range:** $15K–$80K
- **Sub-project names:** Use room/trade names homeowners recognize (Kitchen, Bathroom, Electrical, Plumbing, Flooring, Cabinets, Countertops, Paint, Appliances)
- **Vendors:** Mix of big-box (Home Depot, Lowe's) and local trades (plumber, electrician, cabinet shop)
- **Expense titles:** Homeowner language, not contractor jargon. "Kitchen faucet - Moen Arbor" not "P-trap assembly 1.5in"
- **Expense amounts:** Realistic retail/contractor prices. Receipts $50–$500, invoices $800–$5,000
- **Billing plan:** `'free'` (1 project is enough)

### Flipper / Investor
- **Project examples:** SFH flips with addresses, show 2-4 properties at different stages
- **Budget range:** $30K–$120K rehab per property
- **Sub-project names:** Trade-focused (Structural, Kitchen, Bath, Electrical, Plumbing, HVAC, Flooring, Exterior & Roof, Paint & Drywall, Landscaping)
- **Vendors:** Contractors and supply houses, some reused across projects
- **Expense titles:** More trade-oriented but still clear. "Stock cabinets - white shaker 16pc"
- **Portfolio stages:** Mix of early (10-15%), mid (60-85%), and near-complete (85-95%) projects
- **Billing plan:** `'plus'` (multiple projects)

### General Contractor (future)
- **Project examples:** Commercial or large residential builds
- **Budget range:** $100K–$500K+
- **Sub-project names:** CSI cost code style (01-General Conditions, 03-Concrete, 06-Wood & Plastics)
- **Vendors:** Subcontractors and material suppliers
- **Billing plan:** `'builder'`

## Team Members

Every demo account should have multiple users to showcase collaboration:

- **Owner** logs most expenses, approves contractor submissions
- **Contractors** (1-2 per project) log materials/labor with `created_by` set to their UUID
- **Investors** (flipper accounts) get read-only access, zero expenses created

For contractor expenses, set `reviewed_by` to the owner UUID and `reviewed_at` ~1 day after `expense_date`. Include 1-2 rejected expenses per contractor (duplicates, wrong project charges) with `status_reason`.

Owner's own included expenses should also have `reviewed_by`/`reviewed_at` set (self-approved).

## Audit Data

After creating expenses, generate audit trail in bulk using SQL:

```sql
-- 1. Status events: creation (NULL → pending) for ALL expenses
INSERT INTO expense_status_events (expense_id, from_status, to_status, changed_by, changed_at)
SELECT id, NULL, 'pending', created_by, expense_date::timestamptz + interval '9 hours'
FROM expenses WHERE project_id IN ({project_ids}) AND deleted_datetime IS NULL;

-- 2. Status events: approval (pending → included)
INSERT INTO expense_status_events (expense_id, from_status, to_status, changed_by, changed_at)
SELECT id, 'pending', 'included', reviewed_by,
  COALESCE(reviewed_at, expense_date::timestamptz + interval '1 day 14 hours')
FROM expenses WHERE project_id IN ({project_ids}) AND status = 'included' AND deleted_datetime IS NULL;

-- 3. Status events: rejection (pending → rejected) with reason
INSERT INTO expense_status_events (expense_id, from_status, to_status, reason, changed_by, changed_at)
SELECT id, 'pending', 'rejected',
  CASE WHEN title ILIKE '%duplicate%' THEN 'Duplicate entry' WHEN title ILIKE '%wrong%' THEN 'Wrong project' ELSE 'Not approved' END,
  reviewed_by, reviewed_at
FROM expenses WHERE project_id IN ({project_ids}) AND status = 'rejected' AND deleted_datetime IS NULL;

-- 4. Audit timeline: "add" events
INSERT INTO audit_timeline (actor_id, actor_type, action, entity_type, entity_id, project_id, after_state, field_diffs, created_at)
SELECT created_by, 'human', 'add', 'expense', id, project_id,
  jsonb_build_object('title', title, 'total', total::text, 'status', 'pending', 'vendor_name', vendor_name),
  '[]'::jsonb, expense_date::timestamptz + interval '9 hours'
FROM expenses WHERE project_id IN ({project_ids}) AND deleted_datetime IS NULL;

-- 5. Audit timeline: "approve" events
INSERT INTO audit_timeline (actor_id, actor_type, action, entity_type, entity_id, project_id, before_state, after_state, field_diffs, created_at)
SELECT reviewed_by, 'human', 'approve', 'expense', id, project_id,
  '{"status":"pending"}'::jsonb, '{"status":"included"}'::jsonb,
  '[{"field":"status","old":"pending","new":"included"}]'::jsonb,
  COALESCE(reviewed_at, expense_date::timestamptz + interval '1 day 14 hours')
FROM expenses WHERE project_id IN ({project_ids}) AND status = 'included' AND deleted_datetime IS NULL;

-- 6. Audit timeline: "reject" events
INSERT INTO audit_timeline (actor_id, actor_type, action, entity_type, entity_id, project_id, before_state, after_state, field_diffs, note, created_at)
SELECT reviewed_by, 'human', 'reject', 'expense', id, project_id,
  '{"status":"pending"}'::jsonb, '{"status":"rejected"}'::jsonb,
  '[{"field":"status","old":"pending","new":"rejected"}]'::jsonb,
  CASE WHEN title ILIKE '%duplicate%' THEN 'Duplicate entry' WHEN title ILIKE '%wrong%' THEN 'Wrong project' ELSE 'Not approved' END,
  reviewed_at
FROM expenses WHERE project_id IN ({project_ids}) AND status = 'rejected' AND deleted_datetime IS NULL;

-- 7. Enable audit timeline on projects
UPDATE projects SET audit_timeline_enabled = true WHERE id IN ({project_ids});
```

## Making Data Realistic

1. **Spread dates** across weeks/months — not all same day
2. **Mix statuses:** ~70% included, ~25% pending, ~5% rejected
3. **Budget tension:** Some categories near-maxed (95%+), some comfortable (60-70%), some over budget
4. **Pending expenses** on recent dates (last 1-2 weeks) — shows active management
5. **Vendor variety:** 6-12 vendors per project, some appearing on multiple expenses
6. **Real product names:** Samsung fridge, Moen faucet, Kohler toilet, Bosch dishwasher
7. **Logical ordering:** Demo/structural first, then rough trades, then finishes, then paint last
8. **Multi-user activity:** Contractors log 5-15 expenses each, owner approves next day
9. **Rejected expenses:** 1-2 per contractor with clear reasons (duplicate, wrong project)
10. **Investors:** Added to project_users with role 'investor', zero expenses — read-only visibility

## After Creating

1. **Verify budget health** with:
```sql
SELECT sp.name, sp.budget,
  COALESCE(SUM(e.total) FILTER (WHERE e.status = 'included'), 0) as spent,
  COALESCE(SUM(e.total) FILTER (WHERE e.status = 'pending'), 0) as pending,
  sp.budget - COALESCE(SUM(e.total), 0) as remaining
FROM sub_projects sp
LEFT JOIN expenses e ON e.sub_project_id = sp.id AND e.deleted_datetime IS NULL
WHERE sp.project_id = {PROJECT_ID}
GROUP BY sp.id, sp.name, sp.budget
ORDER BY sp.id;
```

2. **Update `docs/demo-accounts.md`** with credentials, structure, and database IDs.

3. **Test login** at app.getfierro.com to confirm the account works.

## Cleanup Template

```sql
DELETE FROM audit_timeline WHERE project_id IN ({project_ids});
DELETE FROM expense_status_events WHERE expense_id IN (SELECT id FROM expenses WHERE project_id IN ({project_ids}));
DELETE FROM expenses WHERE project_id IN ({project_ids});
DELETE FROM vendors WHERE project_id IN ({project_ids});
DELETE FROM project_users WHERE project_id IN ({project_ids});
DELETE FROM sub_projects WHERE project_id IN ({project_ids});
DELETE FROM projects WHERE id IN ({project_ids});
DELETE FROM organization_memberships WHERE organization_id IN ({org_ids});
DELETE FROM user_profile WHERE id IN ('{user_uuids}');
DELETE FROM organizations WHERE id IN ({org_ids});
DELETE FROM auth.users WHERE id IN ('{user_uuids}');
```
