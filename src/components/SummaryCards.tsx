import { formatRupees, isThisMonth, type Expense } from "@/lib/expenses";

export function SummaryCards({ expenses }: { expenses: Expense[] }) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const monthTotal = expenses
    .filter((e) => isThisMonth(e.date))
    .reduce((sum, e) => sum + e.amount, 0);

  const items = [
    { label: "This month", value: formatRupees(monthTotal), accent: true },
    { label: "All time", value: formatRupees(total), accent: false },
    { label: "Entries", value: String(expenses.length), accent: false },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {item.label}
          </p>
          <p
            className={`mt-2 text-2xl font-semibold tabular-nums ${
              item.accent ? "text-spend" : "text-foreground"
            }`}
          >
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
