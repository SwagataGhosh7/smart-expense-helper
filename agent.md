# agent.md

Guidance for anyone (human or AI) working on this Expense Tracker.

## Stack

- TanStack Start v1 (React 19) with file-based routing in `src/routes/`
- Tailwind CSS v4, design tokens defined in `src/styles.css`
- shadcn/ui primitives in `src/components/ui/`
- No backend. All data lives in the browser's localStorage.

## Structure

```text
src/
  routes/index.tsx        main tracker page (route metadata lives here)
  components/
    ExpenseForm.tsx       add + edit form
    ExpenseList.tsx       list rows, edit/delete actions
    SummaryCards.tsx      month total, all-time total, entry count
    ExpenseFilters.tsx    search + category/month chip filters
    ExpenseAnalytics.tsx  Recharts donut, bar and trend charts
  lib/expenses.ts         types, storage, currency/date formatting
```

## Rules

1. **Never hardcode colors.** Use semantic tokens (`bg-card`, `text-spend`,
   `bg-chip-food`). Add new tokens in `src/styles.css` under `:root`, `.dark`
   and `@theme inline` before using them.
2. **Storage stays in `src/lib/expenses.ts`.** Components never touch
   `localStorage` directly.
3. **Read storage after hydration.** Load inside `useEffect`, never in a
   `useState` initializer — SSR would mismatch.
4. **Money is rupees.** Format every amount with `formatRupees()` (`en-IN`,
   INR). Store amounts as numbers rounded to 2 decimals.
5. **Route metadata:** each content route defines its own `head()` with a
   unique title, description, `og:title`, `og:description`.

## Extending

- New category: add it to `CATEGORIES`, add a matching entry in
  `CATEGORY_CHIP`, and add the chip tokens in `src/styles.css`.
- New derived stat: compute it in `SummaryCards.tsx` from the `expenses` prop.
- Charts: use Recharts and pass colors as `var(--token)` strings so charts follow
  the theme; never pass hex values.
- Moving to a real backend later: replace `loadExpenses`/`saveExpenses` in
  `src/lib/expenses.ts`; the components stay unchanged.
