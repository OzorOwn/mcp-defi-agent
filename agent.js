/**
 * DeFi Agent — Standalone demo (no MCP required)
 *
 * Demonstrates the DeFi capabilities available via the Clawdia API Gateway:
 * - Live token prices (500+ tokens)
 * - Wallet balance lookups (9 chains)
 * - Token swap quotes
 * - On-chain analytics
 *
 * For MCP integration with Claude Desktop or Cursor, see README.md
 *
 * Usage:
 *   API_KEY=gw_... node agent.js
 */

const GATEWAY = "https://agent-gateway-kappa.vercel.app";
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("Error: Set API_KEY environment variable");
  console.error('  Get one free: curl -X POST https://agent-gateway-kappa.vercel.app/api/keys/create');
  process.exit(1);
}

const headers = {
  "Authorization": `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
};

async function api(path, options = {}) {
  const res = await fetch(`${GATEWAY}${path}`, { ...options, headers: { ...headers, ...options.headers } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json();
}

async function demo() {
  console.log("🏦 DeFi Agent Demo\n");

  // 1. Get live prices
  console.log("═══ Live Prices ═══");
  try {
    const prices = await api("/v1/crypto-feeds/prices");
    const tokens = ["BTC", "ETH", "SOL", "AVAX", "MATIC"];
    for (const t of tokens) {
      if (prices[t]) {
        const p = prices[t];
        const change = p.change24h >= 0 ? `+${p.change24h?.toFixed(2)}%` : `${p.change24h?.toFixed(2)}%`;
        console.log(`  ${t.padEnd(6)} $${p.price?.toLocaleString().padEnd(12)} ${change}`);
      }
    }
  } catch (err) {
    console.log(`  Error: ${err.message}`);
  }

  // 2. Check wallet balance (Ethereum mainnet)
  console.log("\n═══ Wallet Lookup ═══");
  const demoWallet = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"; // vitalik.eth
  try {
    const balance = await api(`/v1/agent-wallet/balance/ethereum/${demoWallet}`);
    console.log(`  Address: ${demoWallet.slice(0, 10)}...${demoWallet.slice(-8)}`);
    console.log(`  Chain:   Ethereum`);
    console.log(`  Balance: ${balance.balance} ETH`);
    if (balance.tokens?.length > 0) {
      console.log(`  Tokens:  ${balance.tokens.length} found`);
      balance.tokens.slice(0, 5).forEach(t => {
        console.log(`    - ${t.symbol}: ${t.balance}`);
      });
    }
  } catch (err) {
    console.log(`  Error: ${err.message}`);
  }

  // 3. On-chain analytics
  console.log("\n═══ On-Chain Analytics ═══");
  try {
    const analytics = await api("/v1/onchain-analytics/gas/ethereum");
    console.log(`  Ethereum Gas:`);
    console.log(`    Fast:     ${analytics.fast?.gwei || analytics.fast} gwei`);
    console.log(`    Standard: ${analytics.standard?.gwei || analytics.standard} gwei`);
    console.log(`    Slow:     ${analytics.slow?.gwei || analytics.slow} gwei`);
  } catch (err) {
    console.log(`  Gas data: ${err.message}`);
  }

  // 4. DeFi swap quote
  console.log("\n═══ Swap Quote ═══");
  try {
    const quote = await api("/v1/frostbyte-wallet/swap/quote", {
      method: "POST",
      body: JSON.stringify({
        chain: "ethereum",
        fromToken: "ETH",
        toToken: "USDC",
        amount: "1",
      }),
    });
    console.log(`  1 ETH → ${quote.toAmount || quote.outputAmount} USDC`);
    console.log(`  Fee: ${quote.fee || "0.3%"}`);
    console.log(`  Route: ${quote.route || "Best price aggregated"}`);
  } catch (err) {
    console.log(`  Quote: ${err.message}`);
  }

  console.log("\n✅ Demo complete. See README.md for MCP integration with Claude/Cursor.\n");
}

demo().catch(console.error);
