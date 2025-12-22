import React, { createContext, useContext, useState, ReactNode } from "react";

type Currency = "USD" | "INR";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertPrice: (priceUSD: number) => number;
  formatPrice: (priceUSD: number) => string;
  exchangeRate: number;
}

const EXCHANGE_RATE = 83; // 1 USD = 83 INR

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("INR");

  const convertPrice = (priceUSD: number): number => {
    if (currency === "INR") {
      return priceUSD * EXCHANGE_RATE;
    }
    return priceUSD;
  };

  const formatPrice = (priceUSD: number): string => {
    const price = convertPrice(priceUSD);
    if (currency === "INR") {
      return `₹${price.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
    }
    return `$${price.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        convertPrice,
        formatPrice,
        exchangeRate: EXCHANGE_RATE,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
