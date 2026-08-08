import { useEffect, useMemo, useState } from "react";
import ExpenseAnalytics from "./ExpenseAnalytics";

const CATEGORIES = ["Food", "Transport", "Bills", "Shopping", "Health", "Other"] as const;

type Category = (typeof CATEGORIES)[number];

type Expense = {
  id: string;
  amount: number;
  category: Category;
  date: string;
  note?: string;
};

const STORAGE_KEY = "smart-expense-helper.expenses.v1";

const defaultExpense: Omit<Expense, "id"> = {
  amount: 0,
  category: "Food",
  date: new Date().toISOString().slice(0, 10),
  note: "",
};

const rupeeFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function loadExpenses(): Expense[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is Expense =>
        !!item &&
        typeof item.id === "string" &&
        typeof item.amount === "number" &&
        typeof item.date === "string" &&
        CATEGORIES.includes(item.category) &&
        (typeof item.note === "string" || item.note === undefined),
    );
  } catch {
    return [];
  }
}

function saveExpenses(expenses: Expense[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

function createId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function sortByDateDesc(expenses: Expense[]) {
  return [...expenses].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

function totalAmount(expenses: Expense[]) {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

function monthTotal(expenses: Expense[]) {
  const month = new Date().toISOString().slice(0, 7);
  return expenses.reduce((sum, expense) => (expense.date.startsWith(month) ? sum + expense.amount : sum), 0);
}

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Expense, "id">>(defaultExpense);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setExpenses(sortByDateDesc(loadExpenses()));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveExpenses(expenses);
  }, [expenses, hydrated]);

  const editingExpense = useMemo(
    () => expenses.find((expense) => expense.id === editingId) ?? null,
    [editingId, expenses],
  );

  useEffect(() => {
    if (!editingExpense) {
      setForm(defaultExpense);
      return;
    }
    setForm({
      amount: editingExpense.amount,
      category: editingExpense.category,
      date: editingExpense.date,
      note: editingExpense.note ?? "",
    });
  }, [editingExpense]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (form.amount <= 0) return;

    if (editingId) {
      setExpenses((current) =>
        sortByDateDesc(
          current.map((expense) => (expense.id === editingId ? { ...expense, ...form } : expense)),
        ),
      );
    } else {
      setExpenses((current) => sortByDateDesc([{ id: createId(), ...form }, ...current]));
    }

    setEditingId(null);
    setForm(defaultExpense);
  }

  function handleDelete(id: string) {
    setExpenses((current) => current.filter((expense) => expense.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm(defaultExpense);
    }
  }

  return (
    <div className="container">
      <header>
        <h1 className="page-title">Smart Expense Helper</h1>
        <p className="page-subtitle">Track expenses in rupees with local browser storage and simple summaries.</p>
      </header>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 18 }}>
        <div style={{ flex: 1 }}>
          <section className="card stats">
            <div className="stat">
              <p className="stat-label">Total spent</p>
              <p className="stat-value">{rupeeFormatter.format(totalAmount(expenses))}</p>
            </div>
            <div className="stat">
              <p className="stat-label">This month</p>
              <p className="stat-value">{rupeeFormatter.format(monthTotal(expenses))}</p>
            </div>
            <div className="stat">
              <p className="stat-label">Entries</p>
              <p className="stat-value">{expenses.length}</p>
            </div>
          </section>
        </div>
      </div>

      <section className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <label className="label">
              Amount (₹)
              <input
                className="input"
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={(event) => setForm((current) => ({ ...current, amount: Number(event.target.value) }))}
              />
            </label>

            <label className="label">
              Category
              <select className="select" value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value as Category }))}>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="label">
              Date
              <input className="input" type="date" value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} />
            </label>

            <label className="label" style={{ gridColumn: '1 / -1' }}>
              Note
              <textarea className="textarea" value={form.note} onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))} />
            </label>
          </div>

          <div className="actions">
            <button className="button-primary" type="submit">
              {editingId ? 'Save expense' : 'Add expense'}
            </button>
            {editingId ? (
              <button className="button-danger" type="button" onClick={() => { setEditingId(null); setForm(defaultExpense); }}>
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="card expense-list">
          {expenses.length === 0 ? (
            <div className="empty-state">No expenses yet. Add one to get started.</div>
          ) : (
            expenses.map((expense) => (
              <article key={expense.id} className="expense-item">
                <div className="expense-header">
                  <div>
                    <p className="expense-title">{rupeeFormatter.format(expense.amount)}</p>
                    <div className={`chip chip-${expense.category}`}>{expense.category}</div>
                  </div>
                  <div className="expense-meta">
                    <span>{formatDate(expense.date)}</span>
                  </div>
                </div>
                {expense.note ? <p>{expense.note}</p> : null}
                <div className="actions">
                  <button className="button-primary" type="button" onClick={() => setEditingId(expense.id)}>
                    Edit
                  </button>
                  <button className="button-danger" type="button" onClick={() => handleDelete(expense.id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
      </section>

      <section className="card">
        <ExpenseAnalytics expenses={expenses} />
      </section>
    </div>
  );
}
