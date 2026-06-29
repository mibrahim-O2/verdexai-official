export default function StatCard({ label, value, trend, icon }) {
  const isPositive = trend !== undefined && trend >= 0;

  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {trend !== undefined && (
          <p className={`text-xs mt-1.5 ${isPositive ? "text-primary" : "text-destructive"}`}>
            {isPositive ? "▲" : "▼"} {Math.abs(trend)}% vs last month
          </p>
        )}
      </div>
      {icon && (
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
      )}
    </div>
  );
}