const { ethers, upgrades } = require("hardhat");

async function main() {
  const proxyAddress = "0x258b0F112b1d476542bC61f133C93C2aF0057E5A"; // your factory proxy

  console.log("Upgrading MiniDexPairUpgradeable...");

  const Factory = await ethers.getContractFactory("MiniDexFactoryUpgradeable");
  const upgraded = await upgrades.upgradeProxy(proxyAddress, Factory, {
    kind: "uups",
  });

  console.log("✅ Upgrade complete! Proxy still at:", await upgraded.getAddress());
}

main().catch((err) => {
  console.error("❌ Upgrade failed:", err);
  process.exit(1);
});
