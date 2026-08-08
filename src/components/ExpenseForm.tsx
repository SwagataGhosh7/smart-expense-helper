import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, todayISO, type Category, type Expense } from "@/lib/expenses";

type Draft = { amount: string; category: Category; date: string; note: string };

const emptyDraft = (): Draft => ({
  amount: "",
  category: "Food",
  date: todayISO(),
  note: "",
});

export function ExpenseForm({
  editing,
  onSubmit,
  onCancelEdit,
}: {
  editing: Expense | null;
  onSubmit: (values: Omit<Expense, "id">) => void;
  onCancelEdit: () => void;
}) {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editing) {
      setDraft({
        amount: String(editing.amount),
        category: editing.category,
        date: editing.date,
        note: editing.note ?? "",
      });
      setError(null);
    }
  }, [editing]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const amount = Number(draft.amount);
    if (!draft.amount.trim() || Number.isNaN(amount) || amount <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }
    if (!draft.date) {
      setError("Pick a date.");
      return;
    }
    setError(null);
    onSubmit({
      amount: Math.round(amount * 100) / 100,
      category: draft.category,
      date: draft.date,
      note: draft.note.trim() || undefined,
    });
    setDraft(emptyDraft());
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      <h2 className="text-base font-semibold text-foreground">
        {editing ? "Edit expense" : "Add an expense"}
      </h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (₹)</Label>
          <Input
            id="amount"
            inputMode="decimal"
            placeholder="0.00"
            value={draft.amount}
            onChange={(e) => setDraft({ ...draft, amount: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={draft.category}
            onValueChange={(value) => setDraft({ ...draft, category: value as Category })}
          >
            <SelectTrigger id="category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={draft.date}
            onChange={(e) => setDraft({ ...draft, date: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="note">Note (optional)</Label>
          <Input
            id="note"
            placeholder="Lunch with team"
            value={draft.note}
            onChange={(e) => setDraft({ ...draft, note: e.target.value })}
          />
        </div>
      </div>

      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}

      <div className="mt-5 flex flex-wrap gap-2">
        <Button type="submit">{editing ? "Save changes" : "Add expense"}</Button>
        {editing ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setDraft(emptyDraft());
              setError(null);
              onCancelEdit();
            }}
          >
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}
