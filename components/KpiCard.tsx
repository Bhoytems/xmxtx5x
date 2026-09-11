export default function KpiCard({
  label,
  value,
  delta,
  deltaPositive,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaPositive?: boolean;
}) {
  return (
    <div className="rounded-lg border border-base-700 bg-base-800 p-4">
      <p className="text-xs text-ink-500">{label}</p>
      <p className="tabular mt-2 text-2xl text-ink-100">{value}</p>
      {delta && (
        <p
          className={`tabular mt-1 text-xs ${
            deltaPositive ? "text-signal-teal" : "text-signal-red"
          }`}
        >
          {delta}
        </p>
      )}
    </div>
  );
}
