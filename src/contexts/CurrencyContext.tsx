import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Currency = "USD" | "INR";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertPrice: (priceUSD: number) => number;
  formatPrice: (priceUSD: number) => string;
  exchangeRate: number;
  isLoadingRate: boolean;
  lastUpdated: Date | null;
}

const FALLBACK_RATE = 83; // Fallback if API fails

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("INR");
  const [exchangeRate, setExchangeRate] = useState<number>(FALLBACK_RATE);
  const [isLoadingRate, setIsLoadingRate] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        setIsLoadingRate(true);
        const response = await fetch(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );
        if (response.ok) {
          const data = await response.json();
          if (data.rates?.INR) {
            setExchangeRate(data.rates.INR);
            setLastUpdated(new Date());
          }
        }
      } catch (error) {
        console.error("Failed to fetch exchange rate:", error);
        // Keep using fallback rate
      } finally {
        setIsLoadingRate(false);
      }
    };

    fetchExchangeRate();
    // Refresh rate every hour
    const interval = setInterval(fetchExchangeRate, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const convertPrice = (priceUSD: number): number => {
    if (currency === "INR") {
      return priceUSD * exchangeRate;
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
        exchangeRate,
        isLoadingRate,
        lastUpdated,
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
