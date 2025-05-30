import React, { useEffect, useState } from "react";

const App = () => {
  const [graph, setGraph] = useState({});
  const [arbitrageDetected, setArbitrageDetected] = useState(false);
  const [cyclePath, setCyclePath] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPrices = async () => {
    setLoading(true);
    setError(null);
    try {
      const [btcRes, ethRes] = await Promise.all([
        fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"),
        fetch("https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT"),
      ]);

      const btcData = await btcRes.json();
      const ethData = await ethRes.json();

      const btcUsd = parseFloat(btcData.price);
      const ethUsd = parseFloat(ethData.price);

      const newGraph = {
        BTC: { USDT: btcUsd, ETH: btcUsd / ethUsd },
        ETH: { USDT: ethUsd, BTC: ethUsd / btcUsd },
        USDT: { BTC: 1 / btcUsd, ETH: 1 / ethUsd },
      };

      setGraph(newGraph);
      const { detected, path } = detectArbitrageCycle(newGraph, "BTC");
      setArbitrageDetected(detected);
      setCyclePath(path);
    } catch (err) {
      setError("Failed to fetch prices from Binance API.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const detectArbitrageCycle = (graph, source) => {
    const nodes = Object.keys(graph);
    const dist = {};
    const predecessor = {};

    nodes.forEach((node) => {
      dist[node] = Infinity;
      predecessor[node] = null;
    });
    dist[source] = 0;

    const edges = [];
    for (const u of nodes) {
      for (const [v, rate] of Object.entries(graph[u])) {
        edges.push({ from: u, to: v, weight: -Math.log(rate) });
      }
    }

    for (let i = 0; i < nodes.length - 1; i++) {
      for (const { from, to, weight } of edges) {
        if (dist[from] + weight < dist[to]) {
          dist[to] = dist[from] + weight;
          predecessor[to] = from;
        }
      }
    }

    for (const { from, to, weight } of edges) {
      if (dist[from] + weight < dist[to]) {
        const visited = new Set();
        let cycle = [];
        let curr = to;

        while (!visited.has(curr)) {
          visited.add(curr);
          curr = predecessor[curr];
        }

        const start = curr;
        cycle.push(start);
        curr = predecessor[start];

        while (curr !== start) {
          cycle.push(curr);
          curr = predecessor[curr];
        }

        cycle.reverse();
        return { detected: true, path: cycle };
      }
    }

    return { detected: false, path: [] };
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-slate-200 flex flex-col items-center p-6 font-inter">
      <h1 className=" font-orbitron text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-lg">
        Crypto Arbitrage Detector
      </h1>

      <button
        onClick={fetchPrices}
        disabled={loading}
        className="mb-6 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 rounded-xl shadow-lg font-semibold disabled:opacity-60"
      >
        {loading ? "🔄 Fetching Prices..." : "🔁 Refresh Prices"}
      </button>

      {error && (
        <div className="text-red-400 font-medium mb-4 animate-pulse">
          ⚠️ {error}
        </div>
      )}

      <div className="bg-neutral-900 rounded-2xl shadow-md p-6 w-full max-w-md mb-6 border border-neutral-700">
        <h2 className="text-xl font-semibold text-cyan-300 mb-4">Exchange Rates</h2>
        <ul className="space-y-2 text-sm font-mono">
          {Object.entries(graph).map(([from, targets]) =>
            Object.entries(targets).map(([to, rate]) => (
              <li
                key={`${from}-${to}`}
                className="flex justify-between px-2 py-1 hover:bg-neutral-800 rounded transition"
              >
                <span>{from} → {to}</span>
                <span>{rate.toFixed(6)}</span>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="bg-neutral-900 rounded-2xl shadow-md p-6 w-full max-w-md text-center border border-neutral-700">
        {arbitrageDetected ? (
          <>
            <p className="text-green-400 text-lg font-semibold mb-2 animate-bounce">
               Arbitrage Opportunity Detected!
            </p>
            <p className="text-slate-300 mb-1">Cycle Path:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {cyclePath.map((node, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-black text-xs font-bold px-2 py-1 rounded-full"
                >
                  {node}
                </span>
              ))}
            </div>
          </>
        ) : (
          <p className="text-slate-400 text-lg">No arbitrage detected currently</p>
        )}
      </div>

      <footer className="mt-auto pt-10 text-slate-500 text-xs">
  Powered by <span className="text-blue-300 font-semibold">FlashArbitrage</span> 🚀 | Live Crypto Arbitrage Tracker
</footer>

    </div>
  );
};

export default App;
