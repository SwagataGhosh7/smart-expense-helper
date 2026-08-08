import { useMemo } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CATEGORIES, formatRupees, type Category, type Expense } from "@/lib/expenses";

const CATEGORY_VAR: Record<Category, string> = {
  Food: "var(--chip-food-foreground)",
  Transport: "var(--chip-transport-foreground)",
  Bills: "var(--chip-bills-foreground)",
  Shopping: "var(--chip-shopping-foreground)",
  Health: "var(--chip-health-foreground)",
  Other: "var(--chip-other-foreground)",
};

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function lastMonths(count: number) {
  const now = new Date();
  const out: { key: string; label: string }[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push({
      key: monthKey(d),
      label: d.toLocaleDateString("en-IN", { month: "short" }),
    });
  }
  return out;
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name?: string; value?: number; payload?: { name?: string } }[];
  label?: string | number;
}) {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  const name = entry?.payload?.name ?? label ?? entry?.name;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="font-medium text-popover-foreground">{name}</p>
      <p className="mt-0.5 tabular-nums text-spend">{formatRupees(entry?.value ?? 0)}</p>
    </div>
  );
}

export function ExpenseAnalytics({ expenses }: { expenses: Expense[] }) {
  const byCategory = useMemo(
    () =>
      CATEGORIES.map((category) => ({
        name: category,
        value: expenses
          .filter((e) => e.category === category)
          .reduce((sum, e) => sum + e.amount, 0),
      })).filter((row) => row.value > 0),
    [expenses],
  );

  const byMonth = useMemo(() => {
    const months = lastMonths(6);
    return months.map(({ key, label }) => ({
      name: label,
      value: expenses
        .filter((e) => e.date.slice(0, 7) === key)
        .reduce((sum, e) => sum + e.amount, 0),
    }));
  }, [expenses]);

  const total = byCategory.reduce((sum, r) => sum + r.value, 0);
  const top = byCategory.reduce<{ name: string; value: number } | null>(
    (best, row) => (!best || row.value > best.value ? row : best),
    null,
  );
  const daysThisMonth = new Date().getDate();
  const monthTotal = byMonth[byMonth.length - 1]?.value ?? 0;

  if (expenses.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center text-sm text-muted-foreground">
        Add a few expenses to unlock spending analysis.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Top category
          </p>
          <p className="mt-2 text-lg font-semibold text-foreground">{top?.name ?? "—"}</p>
          <p className="text-sm tabular-nums text-muted-foreground">
            {formatRupees(top?.value ?? 0)}
            {total > 0 ? ` · ${Math.round(((top?.value ?? 0) / total) * 100)}% of spend` : ""}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Average per day (this month)
          </p>
          <p className="mt-2 text-lg font-semibold tabular-nums text-spend">
            {formatRupees(monthTotal / daysThisMonth)}
          </p>
          <p className="text-sm text-muted-foreground">
            Across {daysThisMonth} day{daysThisMonth === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground">Spend by category</h3>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byCategory}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={82}
                  paddingAngle={3}
                  stroke="var(--card)"
                  strokeWidth={2}
                >
                  {byCategory.map((row) => (
                    <Cell key={row.name} fill={CATEGORY_VAR[row.name as Category]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {byCategory.map((row) => (
              <li
                key={row.name}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: CATEGORY_VAR[row.name as Category] }}
                />
                {row.name} · {formatRupees(row.value)}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground">Last 6 months</h3>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byMonth}>
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: "var(--muted)" }}
                  content={<ChartTooltip />}
                />
                <Bar dataKey="value" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground">Monthly trend</h3>
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={byMonth}>
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                />
                <YAxis hide />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--spend)"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "var(--spend)" }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
