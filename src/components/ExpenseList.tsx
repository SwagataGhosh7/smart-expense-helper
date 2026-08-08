import { Pencil, Trash2, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  CATEGORY_CHIP,
  formatDate,
  formatRupees,
  sortByDateDesc,
  type Expense,
} from "@/lib/expenses";

export function ExpenseList({
  expenses,
  onEdit,
  onDelete,
}: {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}) {
  if (expenses.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
        <Receipt className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
        <p className="mt-3 text-sm font-medium text-foreground">No expenses yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add your first expense above and it will be saved in this browser.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {sortByDateDesc(expenses).map((expense) => (
        <li
          key={expense.id}
          className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm"
        >
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${CATEGORY_CHIP[expense.category]}`}
          >
            {expense.category}
          </span>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {expense.note || expense.category}
            </p>
            <p className="text-xs text-muted-foreground">{formatDate(expense.date)}</p>
          </div>

          <p className="text-base font-semibold tabular-nums text-spend">
            {formatRupees(expense.amount)}
          </p>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Edit expense of ${formatRupees(expense.amount)}`}
              onClick={() => onEdit(expense)}
            >
              <Pencil className="size-4" />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Delete expense of ${formatRupees(expense.amount)}`}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this expense?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {formatRupees(expense.amount)} · {expense.category} ·{" "}
                    {formatDate(expense.date)}. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(expense.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </li>
      ))}
    </ul>
  );
}
