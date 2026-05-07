export function Table({ children }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-left border-collapse">
        {children}
      </table>
    </div>
  );
}

export function Thead({ children }) {
  return (
    <thead className="bg-surface-hover border-b border-border text-sm font-semibold text-text-muted uppercase tracking-wider">
      {children}
    </thead>
  );
}

export function Tbody({ children }) {
  return <tbody className="divide-y divide-border bg-surface">{children}</tbody>;
}

export function Tr({ children, onClick, className = "" }) {
  return (
    <tr
      onClick={onClick}
      className={`${onClick ? "cursor-pointer hover:bg-surface-hover/50 transition-colors" : ""} ${className}`}
    >
      {children}
    </tr>
  );
}

export function Th({ children, className = "" }) {
  return <th className={`px-6 py-4 ${className}`}>{children}</th>;
}

export function Td({ children, className = "" }) {
  return <td className={`px-6 py-4 whitespace-nowrap ${className}`}>{children}</td>;
}
