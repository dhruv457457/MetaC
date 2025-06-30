import { getPairContractReadOnly, getFactoryContractReadOnly } from "./contractUtils";
import { ethers } from "ethers";

// Token list for symbol lookup
const tokenList = [
  { symbol: "TKA", address: "0x1e792D4c34c3d04Bd127aFEf0c1696E912c755aa" },
  { symbol: "TKB", address: "0x9e53abdDBFa9DC6A9bCD9D0e5DD7144F2701718D" },
  { symbol: "USDT", address: "0xD9b7b6a9146291f87ea383E47Bf7FEc6b707e699" },
  { symbol: "MOO", address: "0xA18938653750B70DCBbC0DF5a03D9F2e5958D8E8" },
];
async function getBlockTimestamp(provider, blockNumber) {
  const block = await provider.getBlock(blockNumber);
  return block.timestamp;
}

export async function getUserTransactions(pairAddress, userAddress) {
  const { pair, provider } = await getPairContractReadOnly(pairAddress);
  const latestBlock = await provider.getBlockNumber();
  const startBlock = latestBlock - 5000;

  const swapLogs = await pair.queryFilter(
    pair.filters.Swapped(userAddress),
    startBlock,
    latestBlock
  );
  const addLogs = await pair.queryFilter(
    pair.filters.LiquidityAdded(userAddress),
    startBlock,
    latestBlock
  );
  const removeLogs = await pair.queryFilter(
    pair.filters.LiquidityRemoved(userAddress),
    startBlock,
    latestBlock
  );
  const rewardLogs = await pair.queryFilter(
    pair.filters.RewardClaimed(userAddress),
    startBlock,
    latestBlock
  );

  const txs = [];

  for (const log of swapLogs) {
    const ts = await getBlockTimestamp(provider, log.blockNumber);
    txs.push({
      type: "swap",
      inputToken: log.args.inputToken,
      outputToken: log.args.outputToken,
      inputAmount: log.args.inputAmount ? ethers.formatUnits(log.args.inputAmount, 18) : "0.00",
      outputAmount: log.args.outputAmount ? ethers.formatUnits(log.args.outputAmount, 18) : "0.00",
      timestamp: ts,
      txHash: log.transactionHash,
      blockNumber: log.blockNumber,
    });
  }

  for (const log of addLogs) {
    const ts = await getBlockTimestamp(provider, log.blockNumber);
    txs.push({
      type: "liquidity",
      direction: "add",
      amountA: log.args.amountA ? ethers.formatUnits(log.args.amountA, 18) : "0.00",
      amountB: log.args.amountB ? ethers.formatUnits(log.args.amountB, 18) : "0.00",
      timestamp: ts,
      txHash: log.transactionHash,
    });
  }

  for (const log of removeLogs) {
    const ts = await getBlockTimestamp(provider, log.blockNumber);
    txs.push({
      type: "liquidity",
      direction: "remove",
      amountLP: log.args.liquidity ? ethers.formatUnits(log.args.liquidity, 18) : "0.00",
      timestamp: ts,
      txHash: log.transactionHash,
    });
  }

  for (const log of rewardLogs) {
    const ts = await getBlockTimestamp(provider, log.blockNumber);
    txs.push({
      type: "reward",
      amount: log.args.amount ? ethers.formatUnits(log.args.amount, 18) : "0.00",
      timestamp: ts,
      txHash: log.transactionHash,
    });
  }

  return txs.sort((a, b) => b.timestamp - a.timestamp);
}

export async function getAllUserSwaps(userAddress, limit = 100) {
  if (!userAddress) return [];

  try {
    const res = await fetch(
      `http://localhost:5000/api/swaps/recent?user=${userAddress}&limit=${limit}`
    );
    if (!res.ok) throw new Error("Backend fetch failed");
    const data = await res.json();

    return data.map((tx) => ({
      ...tx,
      inputTokenSymbol: getTokenSymbol(tx.inputToken),
      outputTokenSymbol: getTokenSymbol(tx.outputToken),
    }));
  } catch (err) {
    console.error("❌ Failed to fetch from backend:", err);
    return [];
  }
}

export async function getAllSwapsAcrossPairs(limit = 50) {
  try {
    const res = await fetch(`http://localhost:5000/api/swaps/recent?limit=${limit}`);
    if (!res.ok) throw new Error("Backend fetch failed");
    const data = await res.json();

    return data.map((tx) => ({
      ...tx,
      inputTokenSymbol: getTokenSymbol(tx.inputToken),
      outputTokenSymbol: getTokenSymbol(tx.outputToken),
    }));
  } catch (err) {
    console.error("❌ Failed to fetch all swaps:", err);
    return [];
  }
}

export async function saveSwapToBackend(swapData) {
  try {
    const res = await fetch("http://localhost:5000/api/swaps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(swapData),
    });

    const json = await res.json();
    return json;
  } catch (err) {
    console.error("❌ Failed to save swap:", err);
  }
}

export function getTokenSymbol(address) {
  const token = tokenList.find(
    (t) => t.address.toLowerCase() === address.toLowerCase()
  );
  return token ? token.symbol : address.slice(0, 6) + "..." + address.slice(-4);
}
