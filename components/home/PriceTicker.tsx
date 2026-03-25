"use client";

import { useEffect, useState } from "react";
import styles from "./PriceTicker.module.css";

const API_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,ripple,binancecoin&vs_currencies=usd&include_24hr_change=true";

const COIN_IDS = ["bitcoin", "ethereum", "solana", "ripple", "binancecoin"] as const;

const DISPLAY_NAMES: Record<string, string> = {
  bitcoin: "BTC",
  ethereum: "ETH",
  solana: "SOL",
  ripple: "XRP",
  binancecoin: "BNB",
};

interface CoinData {
  usd: number;
  usd_24h_change?: number;
}

type PriceData = Record<string, CoinData>;

function formatPrice(price: number): string {
  return "$" + price.toLocaleString("en-US", {
    minimumFractionDigits: price < 10 ? 2 : price < 1000 ? 2 : 0,
    maximumFractionDigits: price < 10 ? 2 : price < 1000 ? 2 : 0,
  });
}

function formatChange(change: number): string {
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(2)}%`;
}

export default function PriceTicker() {
  const [prices, setPrices] = useState<PriceData | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchPrices() {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) return;
        const data: PriceData = await res.json();
        if (mounted) setPrices(data);
      } catch {
        // silently fail
      }
    }

    fetchPrices();
    const interval = setInterval(fetchPrices, 60_000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (!prices) {
    return (
      <div className={`${styles.ticker} ${styles.skeleton}`}>
        {COIN_IDS.map((id, i) => (
          <span key={id}>
            {i > 0 && <span className={styles.dot} />}
            <span className={styles.coin}>
              <span className={styles.coinName}>{DISPLAY_NAMES[id]}</span>
              <span className={styles.coinPrice}>--</span>
            </span>
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.ticker}>
      {COIN_IDS.map((id, i) => {
        const coin = prices[id];
        if (!coin) return null;

        const change = coin.usd_24h_change;
        const isPositive = change != null && change >= 0;
        const isNegative = change != null && change < 0;

        return (
          <span key={id} style={{ display: "contents" }}>
            {i > 0 && <span className={styles.dot} />}
            <span className={styles.coin}>
              <span className={styles.coinName}>{DISPLAY_NAMES[id]}</span>
              <span className={styles.coinPrice}>{formatPrice(coin.usd)}</span>
              {change != null && (
                <span
                  className={`${styles.coinChange} ${
                    isPositive ? styles.positive : isNegative ? styles.negative : ""
                  }`}
                >
                  {formatChange(change)}
                </span>
              )}
            </span>
          </span>
        );
      })}
    </div>
  );
}
