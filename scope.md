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
- Responsive, mobile-first layout

## Out of scope (v1)

- Charts and analytics
- Monthly budgets and budget alerts
- Search, filtering, and CSV export
- User accounts, login, multi-device sync
- Recurring expenses, income tracking, multiple currencies
- Attachments or receipt photos
- Any server, database, or API

## Possible next

1. Filter by month and category
2. Spend-by-category donut chart and monthly trend
3. Monthly budget with progress indicator
4. CSV export / import
5. Cloud sync with accounts (would replace the localStorage layer only)

## Constraints

- Data is device-local: clearing browser storage deletes all expenses.
- No sensitive data is transmitted anywhere.
