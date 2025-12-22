import { useCurrency } from "@/contexts/CurrencyContext";
import { cn } from "@/lib/utils";

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-muted">
      <button
        onClick={() => setCurrency("INR")}
        className={cn(
          "px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
          currency === "INR"
            ? "bg-background text-foreground shadow-soft"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        ₹ INR
      </button>
      <button
        onClick={() => setCurrency("USD")}
        className={cn(
          "px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
          currency === "USD"
            ? "bg-background text-foreground shadow-soft"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        $ USD
      </button>
    </div>
  );
}
