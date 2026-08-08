# scope.md

## Product

A single-page expense tracker for personal daily spending, in Indian rupees,
with data stored only in the user's browser.

## In scope (v1)

- Add an expense: amount (₹), category, date (defaults to today), optional note
- Edit an existing expense in place
- Delete an expense with a confirmation dialog
- Categories: Food, Transport, Bills, Shopping, Health, Other
- Summary: this-month total, all-time total, number of entries
- Expense list sorted newest first, with category chips and formatted dates
- Empty state before the first expense
- Amounts formatted as `₹1,250.00` using the `en-IN` locale
- Persistence in browser localStorage; restored on reload
- Analysis tab: top category, average spend per day, spend-by-category donut,
  last-6-months bar chart and monthly trend line (Recharts)
- Filters: search notes/category, category chips, month chips, clear filters
- Tabbed interface with subtle entrance animations
- Responsive, mobile-first layout

## Out of scope (v1)

- Monthly budgets and budget alerts
- CSV export / import
- User accounts, login, multi-device sync
- Recurring expenses, income tracking, multiple currencies
- Attachments or receipt photos
- Any server, database, or API

## Possible next

1. Monthly budget with progress indicator
2. CSV export / import
3. Cloud sync with accounts (would replace the localStorage layer only)

## Constraints

- Data is device-local: clearing browser storage deletes all expenses.
- No sensitive data is transmitted anywhere.
