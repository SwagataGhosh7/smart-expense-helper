# Expense Tracker (browser-only)

A single-page expense tracker in rupees, with data saved in this browser. Plus two project docs: `agent.md` and `scope.md`.

## What gets built

**Home page (`/`)**
- Header with app name and a total-spend summary card (all-time total, this-month total, expense count).
- "Add expense" form: amount (₹), category (Food, Transport, Bills, Shopping, Health, Other), date (defaults to today), optional note.
- Expense list grouped newest-first, showing amount, category chip, date, note, with edit and delete actions.
- Inline edit: clicking edit loads the row into the form; save updates it in place.
- Delete asks for confirmation before removing.
- Empty state when no expenses exist yet.
- Amounts formatted as Indian rupees (₹1,250.00, `en-IN`).

**Persistence**
- All expenses stored in browser localStorage under one key; restored on load. No accounts, no server.

**Design**
- Clean, calm finance-app look: warm neutral background, one strong accent color for spend figures, rounded cards, generous spacing. Category chips get distinct muted tones. Fully responsive; mobile-first single column.

**Docs**
- `agent.md` — how to work in this project: stack, folder conventions, design-token rule (no hardcoded colors), storage approach, how to extend features.
- `scope.md` — v1 scope (add/edit/delete expenses, rupees, browser-only storage), explicit out-of-scope items (charts, budgets, CSV export, login, multi-device sync), and a "possible next" list.

## Technical notes

- TanStack Start; rewrite `src/routes/index.tsx` as the tracker page with its own `head()` metadata (title/description/og).
- New files: `src/lib/expenses.ts` (types, localStorage read/write, currency formatting), `src/components/ExpenseForm.tsx`, `src/components/ExpenseList.tsx`, `src/components/SummaryCards.tsx`.
- localStorage read happens after hydration (`useEffect`) to avoid SSR mismatch.
- Colors added as semantic tokens in `src/styles.css`; components use token utilities only.
- shadcn/ui primitives (button, input, select, card) for form controls.
