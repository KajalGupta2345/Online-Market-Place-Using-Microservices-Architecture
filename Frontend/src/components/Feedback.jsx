export function Loader({ label = 'Loading…' }) {
  return (
    <div className="py-16 flex flex-col items-center justify-center gap-2 text-ink/50">
      <div className="w-6 h-6 border-2 border-line border-t-pine-600 rounded-full animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="border border-rust/30 bg-rust/5 text-rust text-sm rounded px-4 py-3 mb-4">
      {message}
    </div>
  );
}

export function EmptyState({ title, subtitle, action }) {
  return (
    <div className="py-20 text-center">
      <p className="font-display text-lg font-semibold text-ink">{title}</p>
      {subtitle && <p className="text-sm text-ink/50 mt-1">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
