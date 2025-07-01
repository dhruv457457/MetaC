const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const Pair = await ethers.getContractFactory("MiniDexPairUpgradeable");
  const pairImpl = await upgrades.deployImplementation(Pair, { kind: "uups" });
  console.log("Pair logic deployed at:", pairImpl);

  const Factory = await ethers.getContractFactory("MiniDexFactoryUpgradeable");
  const factory = await upgrades.deployProxy(
    Factory,
    [pairImpl, deployer.address],
    {
      initializer: "initialize",
      kind: "uups", // ✅ now it's uups-compatible
    }
  );
  await factory.waitForDeployment();

  console.log("Factory proxy deployed at:", await factory.getAddress());
}
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
