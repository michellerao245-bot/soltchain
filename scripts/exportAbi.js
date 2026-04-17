import fs from "fs";
import path from "path";

const artifactsPath = "./artifacts/contracts";
const outputPath = "./frontend/src/contractABI.json";

function getAllABIs(dir) {
  let abis = {};

  const contracts = fs.readdirSync(dir);

  for (const contract of contracts) {
    const contractPath = path.join(dir, contract);
    const files = fs.readdirSync(contractPath);

    for (const file of files) {
      if (file.endsWith(".json")) {
        const filePath = path.join(contractPath, file);
        const content = JSON.parse(fs.readFileSync(filePath, "utf8"));

        if (content.abi) {
          const contractName = file.replace(".json", "");
          abis[contractName] = content.abi;
        }
      }
    }
  }

  return abis;
}

const abis = getAllABIs(artifactsPath);

fs.writeFileSync(outputPath, JSON.stringify(abis, null, 2));

console.log("✅ ABI exported to frontend!");