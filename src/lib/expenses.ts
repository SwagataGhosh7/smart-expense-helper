export const CATEGORIES = [
  "Food",
  "Transport",
  "Bills",
  "Shopping",
  "Health",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type Expense = {
  id: string;
  amount: number;
  category: Category;
  date: string; // YYYY-MM-DD
  note?: string;
};

const STORAGE_KEY = "expense-tracker.expenses.v1";

export function loadExpenses(): Expense[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is Expense =>
        !!e &&
        typeof e.id === "string" &&
        typeof e.amount === "number" &&
        typeof e.date === "string" &&
        CATEGORIES.includes(e.category),
    );
  } catch {
    return [];
  }
}

export function saveExpenses(expenses: Expense[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch {
    // storage full or unavailable — ignore
  }
}

const rupeeFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatRupees(amount: number) {
  return rupeeFormatter.format(amount);
}

export function formatDate(date: string) {
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function todayISO() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

export function isThisMonth(date: string) {
  return date.slice(0, 7) === todayISO().slice(0, 7);
}

export function sortByDateDesc(expenses: Expense[]) {
  return [...expenses].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function createId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export const CATEGORY_CHIP: Record<Category, string> = {
  Food: "bg-chip-food text-chip-food-foreground",
  Transport: "bg-chip-transport text-chip-transport-foreground",
  Bills: "bg-chip-bills text-chip-bills-foreground",
  Shopping: "bg-chip-shopping text-chip-shopping-foreground",
  Health: "bg-chip-health text-chip-health-foreground",
  Other: "bg-chip-other text-chip-other-foreground",
};
