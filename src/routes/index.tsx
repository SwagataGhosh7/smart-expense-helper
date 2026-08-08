import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { BarChart3, ListOrdered } from "lucide-react";
import { ExpenseAnalytics } from "@/components/ExpenseAnalytics";
import { ExpenseFilters, type Filters } from "@/components/ExpenseFilters";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { SummaryCards } from "@/components/SummaryCards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createId, loadExpenses, saveExpenses, type Expense } from "@/lib/expenses";

const title = "Expense Tracker — Track and analyse spending in rupees";
const description =
  "Add, edit and delete expenses in rupees, then analyse spending by category and month. Saved privately in your browser.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Index,
});

function Index() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [filters, setFilters] = useState<Filters>({
    query: "",
    category: "All",
    month: "All",
  });

  useEffect(() => {
    setExpenses(loadExpenses());
    setHydrated(true);
  }, []);

  function update(next: Expense[]) {
    setExpenses(next);
    saveExpenses(next);
  }

  function handleSubmit(values: Omit<Expense, "id">) {
    if (editing) {
      update(expenses.map((e) => (e.id === editing.id ? { ...values, id: e.id } : e)));
      setEditing(null);
    } else {
      update([{ ...values, id: createId() }, ...expenses]);
    }
  }

  function handleDelete(id: string) {
    if (editing?.id === id) setEditing(null);
    update(expenses.filter((e) => e.id !== id));
  }

  const months = useMemo(() => {
    const keys = Array.from(new Set(expenses.map((e) => e.date.slice(0, 7)))).sort(
      (a, b) => (a < b ? 1 : -1),
    );
    return keys.map((key) => ({
      key,
      label: new Date(`${key}-01T00:00:00`).toLocaleDateString("en-IN", {
        month: "short",
        year: "2-digit",
      }),
    }));
  }, [expenses]);

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    return expenses.filter((e) => {
      if (filters.category !== "All" && e.category !== filters.category) return false;
      if (filters.month !== "All" && e.date.slice(0, 7) !== filters.month) return false;
      if (q && !(e.note ?? "").toLowerCase().includes(q) && !e.category.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [expenses, filters]);

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <header className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Expense Tracker
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Log what you spend in rupees, then see where it goes. Saved privately in this
            browser.
          </p>
        </header>

        <SummaryCards expenses={expenses} />

        <ExpenseForm
          editing={editing}
          onSubmit={handleSubmit}
          onCancelEdit={() => setEditing(null)}
        />

        <Tabs defaultValue="expenses" className="space-y-4">
          <TabsList>
            <TabsTrigger value="expenses" className="gap-1.5">
              <ListOrdered className="size-4" /> Expenses
            </TabsTrigger>
            <TabsTrigger value="analysis" className="gap-1.5">
              <BarChart3 className="size-4" /> Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="expenses"
            className="space-y-3 animate-in fade-in duration-300"
          >
            {expenses.length > 0 ? (
              <ExpenseFilters filters={filters} months={months} onChange={setFilters} />
            ) : null}

            {hydrated ? (
              <ExpenseList
                expenses={filtered}
                onEdit={setEditing}
                onDelete={handleDelete}
              />
            ) : (
              <div className="h-24 rounded-2xl border border-border bg-card/50" />
            )}
          </TabsContent>

          <TabsContent value="analysis" className="animate-in fade-in duration-300">
            {hydrated ? (
              <ExpenseAnalytics expenses={expenses} />
            ) : (
              <div className="h-56 rounded-2xl border border-border bg-card/50" />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
