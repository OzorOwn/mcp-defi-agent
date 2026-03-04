# MCP DeFi Agent for Claude Desktop & Cursor

Give your AI assistant DeFi superpowers using the [Model Context Protocol (MCP)](https://modelcontextprotocol.io). Connect Claude Desktop or Cursor to live crypto prices, wallet balances, swap quotes, and on-chain analytics.

## Quick Start (Standalone Demo)

```bash
# Get a free API key (200 free credits, no signup)
curl -X POST https://agent-gateway-kappa.vercel.app/api/keys/create

# Run the demo
API_KEY=gw_your_key node agent.js
```

## MCP Integration with Claude Desktop

Add the DeFi MCP server to your Claude Desktop config:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "defi": {
      "command": "npx",
      "args": ["-y", "defi-mcp@latest"],
      "env": {
        "API_GATEWAY": "https://agent-gateway-kappa.vercel.app",
        "API_KEY": "gw_your_key_here"
      }
    }
  }
}
```

Restart Claude Desktop. You can now ask Claude:

- "What's the current price of ETH?"
- "Check the balance of vitalik.eth"
- "Get me a swap quote for 1 ETH to USDC"
- "What's the current gas price on Ethereum?"
- "Show me the top DeFi tokens by market cap"

## MCP Integration with Cursor

Add to `.cursor/mcp.json` in your project:

```json
{
  "mcpServers": {
    "defi": {
      "command": "npx",
      "args": ["-y", "defi-mcp@latest"],
      "env": {
        "API_GATEWAY": "https://agent-gateway-kappa.vercel.app",
        "API_KEY": "gw_your_key_here"
      }
    }
  }
}
```

## Available MCP Tools

| Tool | Description | Example |
|------|-------------|---------|
| `get_prices` | Live prices for 500+ tokens | "What are BTC, ETH, SOL prices?" |
| `get_wallet_balance` | Check wallet on 9 chains | "Balance of 0xd8dA..." |
| `get_swap_quote` | Token swap quotes | "Quote 1 ETH → USDC" |
| `get_gas_prices` | Current gas on any chain | "Ethereum gas price?" |
| `get_token_info` | Token metadata and stats | "Tell me about AAVE" |

## Supported Chains

Ethereum, Base, Polygon, Arbitrum, Optimism, Avalanche, BSC, Fantom, Solana

## APIs Used

| Service | Endpoint | Credits |
|---------|----------|---------|
| Crypto Feeds | `/v1/crypto-feeds/prices` | 1 |
| Wallet API | `/v1/agent-wallet/balance/{chain}/{address}` | 1 |
| Frostbyte Wallet | `/v1/frostbyte-wallet/swap/quote` | 1 |
| On-Chain Analytics | `/v1/onchain-analytics/gas/{chain}` | 1 |
| DeFi Trading | `/v1/defi-trading/prices` | 1 |

## Free Tier

Every API key comes with **200 free credits** (1 credit = 1 API call). No signup, no credit card.

Need more? [Top up with USDC or Monero →](https://api-catalog-three.vercel.app/pricing)

## License

MIT
