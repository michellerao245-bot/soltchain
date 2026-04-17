import React, { useState, useEffect, useCallback, useRef, useTransition } from "react";
import axios from "axios";

// 🔴 HOOK (ADVANCED)
export const useMarketData = (apiBaseUrl) => {
  const [tokens, setTokens] = useState([]);
  const [inrRate, setInrRate] = useState(83.45);
  const [status, setStatus] = useState("loading");
  const [lastUpdated, setLastUpdated] = useState(null);

  const isMounted = useRef(true);
  const [isPending, startTransition] = useTransition();

  const fetchTokens = useCallback(async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/api/tokens`);
      
      if (!isMounted.current) return;

      startTransition(() => {
        setTokens(res.data || []);
        setLastUpdated(new Date());
        setStatus("fresh");
      });

    } catch (err) {
      if (isMounted.current) setStatus("error");
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    isMounted.current = true;

    fetchTokens();
    const interval = setInterval(fetchTokens, 25000);

    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
  }, [fetchTokens]);

  return { tokens, inrRate, status, lastUpdated, isPending };
};

// 🔴 COMPONENT (FULL UI)
const MarketsPage = () => {
  const { tokens, inrRate, status, lastUpdated, isPending } = useMarketData(
    process.env.REACT_APP_API_URL
  );

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("price");

  const filtered = tokens
    .filter((t) =>
      (t.symbol || "").toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => (b[sortKey] || 0) - (a[sortKey] || 0));

  return (
    <div style={{ padding: "15px", color: "white", maxWidth: "600px", margin: "auto" }}>
      
      {/* HEADER */}
      <h2>SOLTDEX Markets</h2>

      {/* STATUS */}
      <div style={{ fontSize: "12px", marginBottom: "10px", color: "#64748b" }}>
        Status: {status} {isPending && "⏳"}
        <br />
        Updated: {lastUpdated?.toLocaleTimeString()}
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search token..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
          borderRadius: "8px",
          border: "1px solid #333",
          background: "#111",
          color: "white"
        }}
      />

      {/* SORT */}
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => setSortKey("price")}>Sort by Price</button>
        <button onClick={() => setSortKey("change")}>Sort by Change</button>
      </div>

      {/* LIST */}
      {filtered.length > 0 ? (
        filtered.map((t) => {
          const price = Number(t.price || 0);
          const change = Number(t.change || 0);

          return (
            <div
              key={t.symbol}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px",
                borderBottom: "1px solid #222"
              }}
            >
              <div>
                <b>{t.symbol}</b>/USDT
                <div style={{ fontSize: "12px", color: "#666" }}>
                  Vol: {t.volume}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div>${price.toFixed(6)}</div>
                <div style={{ fontSize: "12px" }}>
                  ₹{(price * inrRate).toFixed(2)}
                </div>
              </div>

              <div
                style={{
                  color: change >= 0 ? "#10b981" : "#ef4444",
                  fontWeight: "bold"
                }}
              >
                {change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
              </div>
            </div>
          );
        })
      ) : (
        <div>No tokens found</div>
      )}
    </div>
  );
};

export default MarketsPage;