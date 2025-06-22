import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import Feed from "../models/Pair.js";
import User from "../models/User.js";

dotenv.config();

const __dirname = path.resolve();
const RPC_URL = process.env.RPC_URL;
const FACTORY_ADDRESS = process.env.FACTORY_ADDRESS;

const provider = new ethers.JsonRpcProvider(RPC_URL);

// Load ABIs using fs
const pairAbi = JSON.parse(fs.readFileSync(path.join(__dirname, "src/listeners/Pair.json"), "utf8"));
const factoryAbi = JSON.parse(fs.readFileSync(path.join(__dirname, "src/listeners/Factory.json"), "utf8"));

const lastBlockSeen = {};
const pairContracts = [];

export async function startSwapListener() {
  const factory = new ethers.Contract(FACTORY_ADDRESS, factoryAbi.abi, provider);
  const pairCount = await factory.allPairsLength();

  console.log(`🔍 Found ${pairCount} pairs. Starting staggered polling...`);

  for (let i = 0; i < pairCount; i++) {
    const pairAddress = await factory.allPairs(i);
    const contract = new ethers.Contract(pairAddress, pairAbi.abi, provider);
    pairContracts.push({ contract, address: pairAddress });
    lastBlockSeen[pairAddress] = (await provider.getBlockNumber()) - 3;
  }

  let currentIndex = 0;

  setInterval(async () => {
    const { contract, address } = pairContracts[currentIndex];
    const fromBlock = lastBlockSeen[address];
    const toBlock = await provider.getBlockNumber();

    if (toBlock <= fromBlock) {
      currentIndex = (currentIndex + 1) % pairContracts.length;
      return;
    }

    const allLogs = [];
    let start = fromBlock;

    while (start <= toBlock) {
      const end = Math.min(start + 99, toBlock);

      try {
        const chunkLogs = await contract.queryFilter("Swapped", start, end);
        allLogs.push(...chunkLogs);
      } catch (err) {
        console.error(`❌ Error polling ${address} from ${start} to ${end}: ${err.message}`);
      }

      start = end + 1;
    }

    for (const log of allLogs) {
      const { user, inputToken, outputToken, inputAmount, outputAmount } = log.args;
      const lowerUser = user.toLowerCase();

      const followers = await User.find({ follows: lowerUser });

      for (const follower of followers) {
        await Feed.updateOne(
          { owner: follower.address },
          {
            $push: {
              events: {
                type: "swap",
                actor: lowerUser,
                tokenIn: inputToken,
                tokenOut: outputToken,
                amountIn: inputAmount.toString(),
                amountOut: outputAmount.toString(),
                timestamp: Date.now() / 1000,
                txHash: log.transactionHash,
              },
            },
          },
          { upsert: true }
        );
      }

      console.log(`📡 Detected swap by ${user}, updated ${followers.length} feeds`);
    }

    lastBlockSeen[address] = toBlock;
    currentIndex = (currentIndex + 1) % pairContracts.length;
  }, 5000); // Poll one pair every 5 seconds
}
