const hre = require("hardhat");

async function main() {
  const Builder = await hre.ethers.getContractFactory(
    // "contracts/examples/SimpleBlog"
    // "contracts/examples/Blog.sol:Blog"
    // "contracts/examples/SimpleW3box.sol:SimpleW3box"
    "contracts/DecentralizedWebsiteBuilder.sol:DecentralizedWebsiteBuilder"
  );
  //   const SimpleFlatDirectory = await hre.ethers.getContractFactory(
  //     "SimpleFlatDirectory"
  //   );
  //   const FlatDirectory = await hre.ethers.getContractFactory("FlatDirectory");
  //   const SimpleComment = await hre.ethers.getContractFactory("SimpleComment");

  console.log("Deploying Website Builder and its dependencies...");

  const builder = await Builder.deploy();
  await builder.deployed();

  console.log("Website Builder deployed to:", builder.address);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
