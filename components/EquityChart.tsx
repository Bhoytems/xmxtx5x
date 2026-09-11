"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// Placeholder series until the equity history endpoint is wired to
// Supabase (aggregate a daily snapshot of client_accounts.equity over time).
const data = [
  { day: "Mon", equity: 100000 },
  { day: "Tue", equity: 101200 },
  { day: "Wed", equity: 100800 },
  { day: "Thu", equity: 102600 },
  { day: "Fri", equity: 103400 },
  { day: "Sat", equity: 103400 },
  { day: "Sun", equity: 104100 },
];

export default function EquityChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data}>
        <CartesianGrid stroke="#1B2328" vertical={false} />
        <XAxis dataKey="day" stroke="#5C686E" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#5C686E"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{
            background: "#141B1F",
            border: "1px solid #262F35",
            borderRadius: 5,
            fontSize: 12,
          }}
          labelStyle={{ color: "#B7C0C4" }}
        />
        <Line type="monotone" dataKey="equity" stroke="#3DD9C4" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
