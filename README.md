
# 🚀 Flash Arbitrage

A lightweight React app to detect **crypto arbitrage opportunities** in real-time using live Binance prices.

---

## Arbitrage
Arbitrage is the simultaneous purchase and sale of an asset or financial instrument in different markets to exploit price discrepancies, thereby generating a risk-free profit. It relies on the principle that identical or equivalent assets should have the same price across markets; when this condition fails, arbitrage opportunities arise. Arbitrage helps to ensure price efficiency across markets by aligning prices through trading activities.

## Features

-  Fetches live BTC and ETH prices in USDT from Binance API  
-  Builds an exchange graph and detects arbitrage cycles using Bellman-Ford algorithm  
-  Highlights arbitrage cycle path if detected  
-  Manual refresh for latest price updates  
-  Error handling and loading states

---

## How to Use

1. Clone the repo  
2. Run `npm install` to install dependencies  
3. Start the app with `npm run dev`  
4. Click **Refresh Prices** to fetch latest data and check for arbitrage

---

## Tech Stack

- React.js
- Binance Public API  

---

## Algorithm Used

- Bellman Ford for arbitrage detection

---

## Have a look at the website at https://flash-arbitrage.vercel.app/


