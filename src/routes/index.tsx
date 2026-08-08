import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { SummaryCards } from "@/components/SummaryCards";
import {
  createId,
  loadExpenses,
  saveExpenses,
  type Expense,
} from "@/lib/expenses";

const title = "Expense Tracker — Track daily spending in rupees";
const description =
  "A simple expense tracker: add, edit and delete expenses in rupees. Everything is saved privately in your browser.";

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

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Expense Tracker
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Log what you spend in rupees. Saved privately in this browser.
          </p>
        </header>

        <SummaryCards expenses={expenses} />

        <ExpenseForm
          editing={editing}
          onSubmit={handleSubmit}
          onCancelEdit={() => setEditing(null)}
        />

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">Expenses</h2>
          {hydrated ? (
            <ExpenseList
              expenses={expenses}
              onEdit={setEditing}
              onDelete={handleDelete}
            />
          ) : (
            <div className="h-24 rounded-2xl border border-border bg-card/50" />
          )}
        </section>
      </div>
    </main>
  );
}
