import { useEffect, useMemo, useState } from "react";

const fallbackMarket = [
  {
    id: "solana",
    symbol: "SOL",
    name: "Solana",
    current_price: 182.42,
    price_change_percentage_24h: 6.8,
    market_cap: 86_400_000_000,
  },
  {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    current_price: 3520.18,
    price_change_percentage_24h: 3.4,
    market_cap: 423_800_000_000,
  },
  {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    current_price: 68_240.55,
    price_change_percentage_24h: 2.1,
    market_cap: 1_340_000_000_000,
  },
  {
    id: "chainlink",
    symbol: "LINK",
    name: "Chainlink",
    current_price: 18.64,
    price_change_percentage_24h: -1.2,
    market_cap: 11_600_000_000,
  },
  {
    id: "avalanche-2",
    symbol: "AVAX",
    name: "Avalanche",
    current_price: 36.28,
    price_change_percentage_24h: -2.7,
    market_cap: 14_300_000_000,
  },
];

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

function normalizeMarket(items) {
  return items
    .map((item) => ({
      id: item.id,
      symbol: item.symbol.toUpperCase(),
      name: item.name,
      price: item.current_price,
      change: item.price_change_percentage_24h,
      cap: item.market_cap,
    }))
    .filter((item) => item.price && item.change !== null)
    .sort((first, second) => second.change - first.change);
}

export default function DayThree() {
  const [market, setMarket] = useState([]);
  const [status, setStatus] = useState("loading");
  const [search, setSearch] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    let mounted = true;
    let activeController = null;

    const loadMarket = async () => {
      const controller = new AbortController();
      activeController = controller;
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false",
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error("Market feed unavailable");
        const items = await response.json();
        if (!mounted) return;
        setMarket(normalizeMarket(items));
        setStatus("live");
        setLastUpdated(new Date());
      } catch (error) {
        if (!mounted || error.name === "AbortError") return;
        setMarket(normalizeMarket(fallbackMarket));
        setStatus("fallback");
        setLastUpdated(new Date());
      }
      if (activeController === controller) activeController = null;
    };

    loadMarket();
    const refreshTimer = window.setInterval(loadMarket, 30_000);
    return () => {
      mounted = false;
      window.clearInterval(refreshTimer);
      activeController?.abort();
    };
  }, []);

  const visibleMarket = useMemo(
    () =>
      market.filter((asset) =>
        `${asset.name} ${asset.symbol}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [market, search],
  );
  const totalCap = visibleMarket.reduce((total, asset) => total + asset.cap, 0);
  const averageChange = visibleMarket.length
    ? visibleMarket.reduce((total, asset) => total + asset.change, 0) /
      visibleMarket.length
    : 0;

  return (
    <>
      <section className="market-intro">
        <div>
          <p className="eyebrow">DAY 03 / REACT FUNDAMENTALS</p>
          <h1>
            Read the market
            <br />
            <em>as it moves.</em>
          </h1>
        </div>
        <div className="intro-copy">
          A live feed built around the effect lifecycle: fetch on mount, refresh
          every 30 seconds, clean up on unmount, then shape raw data into a
          useful view.
        </div>
      </section>
      <section className="market-dashboard">
        <div className="market-toolbar">
          <div>
            <span className="feed-pulse" /> LIVE MARKET FEED{" "}
            <b>{status === "live" ? "CONNECTED" : status.toUpperCase()}</b>
          </div>
          <label>
            <span>⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Find an asset"
              aria-label="Find an asset"
            />
          </label>
        </div>
        <div className="market-stats">
          <div>
            <small>VISIBLE ASSETS</small>
            <strong>{visibleMarket.length.toString().padStart(2, "0")}</strong>
          </div>
          <div>
            <small>COMBINED MARKET CAP</small>
            <strong>${(totalCap / 1_000_000_000).toFixed(1)}B</strong>
          </div>
          <div>
            <small>AVERAGE 24H MOVE</small>
            <strong className={averageChange >= 0 ? "positive" : "negative"}>
              {averageChange >= 0 ? "+" : ""}
              {averageChange.toFixed(2)}%
            </strong>
          </div>
          <div>
            <small>LAST EFFECT RUN</small>
            <strong>
              {lastUpdated
                ? lastUpdated.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "--:--"}
            </strong>
          </div>
        </div>
        {status === "loading" ? (
          <div className="market-loading">
            Connecting to external market feed...
          </div>
        ) : (
          <MarketTable assets={visibleMarket} />
        )}
      </section>
      <section className="market-learning">
        <div>
          <p className="eyebrow">WHAT THIS DEMONSTRATES</p>
          <h2>
            Raw data in.
            <br />
            <em>Signal out.</em>
          </h2>
        </div>
        <div className="transform-grid">
          <div>
            <b>01 / MAP</b>
            <span>
              Change each API item into a simpler shape.
              <code>{`items.map(item => ({ name, price }))`}</code>
            </span>
          </div>
          <div>
            <b>02 / FILTER</b>
            <span>
              Keep only matching items.
              <code>{`assets.filter(asset => asset.name.includes(search))`}</code>
            </span>
          </div>
          <div>
            <b>03 / SORT</b>
            <span>
              Put items in the order we need.
              <code>{`assets.sort((a, b) => b.change - a.change)`}</code>
            </span>
          </div>
          <div>
            <b>04 / REDUCE</b>
            <span>
              Combine many values into one result.
              <code>{`assets.reduce((total, asset) => total + asset.cap, 0)`}</code>
            </span>
          </div>
        </div>
      </section>
    </>
  );
}

function MarketTable({ assets }) {
  if (!assets.length)
    return <div className="market-loading">No assets match that search.</div>;
  return (
    <div className="market-table">
      <div className="market-row market-heading">
        <span>ASSET</span>
        <span>PRICE</span>
        <span>24H CHANGE</span>
        <span>MARKET CAP</span>
      </div>
      {assets.map((asset, index) => (
        <div className="market-row" key={asset.id}>
          <span className="asset-name">
            <i>{String(index + 1).padStart(2, "0")}</i>
            <strong>{asset.symbol}</strong>
            <small>{asset.name}</small>
          </span>
          <b>{money.format(asset.price)}</b>
          <b className={asset.change >= 0 ? "positive" : "negative"}>
            {asset.change >= 0 ? "+" : ""}
            {asset.change.toFixed(2)}%
          </b>
          <span>${(asset.cap / 1_000_000_000).toFixed(1)}B</span>
        </div>
      ))}
    </div>
  );
}
