import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES, type Category } from "@/lib/expenses";

export type Filters = {
  query: string;
  category: Category | "All";
  month: string | "All";
};

export function ExpenseFilters({
  filters,
  months,
  onChange,
}: {
  filters: Filters;
  months: { key: string; label: string }[];
  onChange: (next: Filters) => void;
}) {
  const dirty =
    filters.query !== "" || filters.category !== "All" || filters.month !== "All";

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search notes…"
          value={filters.query}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {(["All", ...CATEGORIES] as const).map((c) => {
          const active = filters.category === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => onChange({ ...filters, category: c })}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 active:scale-95 ${
                active
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      {months.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1.5">
          {(["All", ...months.map((m) => m.key)] as string[]).map((key) => {
            const active = filters.month === key;
            const label = key === "All" ? "All months" : months.find((m) => m.key === key)!.label;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onChange({ ...filters, month: key })}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 active:scale-95 ${
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {label}
              </button>
            );
          })}
          {dirty ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-auto h-7 gap-1 text-xs"
              onClick={() => onChange({ query: "", category: "All", month: "All" })}
            >
              <X className="size-3" /> Clear
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
