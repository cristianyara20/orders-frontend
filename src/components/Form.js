export function Button({ children, variant = "primary", className = "", ...props }) {
  const baseStyles = "px-4 py-2 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover focus:ring-primary shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/30",
    secondary: "bg-surface-hover text-text hover:bg-border focus:ring-border",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
    outline: "border-2 border-border bg-transparent text-text hover:border-primary hover:text-primary focus:ring-primary",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Input({ label, error, className = "", ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-medium text-text">{label}</label>}
      <input
        className={`px-4 py-2 bg-surface border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
          error ? "border-red-500 focus:border-red-500" : "border-border hover:border-text-muted focus:border-primary"
        }`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

export function Select({ label, error, children, className = "", ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-medium text-text">{label}</label>}
      <select
        className={`px-4 py-2 bg-surface border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors appearance-none ${
          error ? "border-red-500 focus:border-red-500" : "border-border hover:border-text-muted focus:border-primary"
        }`}
        {...props}
      >
        {children}
      </select>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
