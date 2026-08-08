import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts';

import { formatRupees } from './lib/expenses';

type Expense = {
  id: string;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  note?: string;
};

export default function ExpenseAnalytics({ expenses }: { expenses: Expense[] }) {
  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of expenses) map.set(e.category, (map.get(e.category) ?? 0) + e.amount);
    return Array.from(map.entries()).map(([category, value]) => ({ category, value }));
  }, [expenses]);

  const monthly = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of expenses) {
      const month = e.date.slice(0, 7);
      map.set(month, (map.get(month) ?? 0) + e.amount);
    }
    const arr = Array.from(map.entries())
      .map(([month, value]) => ({ month, value }))
      .sort((a, b) => (a.month < b.month ? 1 : -1));
    return arr.reverse();
  }, [expenses]);

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Analytics</h2>

      <div className="card" style={{ marginBottom: 18 }}>
        <h3 style={{ margin: '0 0 12px' }}>Spending by category</h3>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={byCategory} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis tickFormatter={(v) => formatRupees(v)} />
              <Tooltip formatter={(value: number) => formatRupees(value)} />
              <Bar dataKey="value" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3 style={{ margin: '0 0 12px' }}>Monthly trend</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={monthly} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => formatRupees(v)} />
              <Tooltip formatter={(value: number) => formatRupees(value)} />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
