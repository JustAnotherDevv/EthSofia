// Save this as list-artifacts.js in your scripts folder

const fs = require("fs");
const path = require("path");

function listArtifactsRecursively(dir, artifacts = [], prefix = "") {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  files.forEach((file) => {
    if (file.isDirectory()) {
      listArtifactsRecursively(
        path.join(dir, file.name),
        artifacts,
        `${prefix}${file.name}/`
      );
    } else if (
      file.name.endsWith(".json") &&
      !file.name.endsWith(".dbg.json")
    ) {
      artifacts.push(`${prefix}${file.name.replace(".json", "")}`);
    }
  });

  return artifacts;
}

function listArtifacts() {
  const artifactsDir = path.join(__dirname, "..", "artifacts", "contracts");
  const artifacts = listArtifactsRecursively(artifactsDir);

  console.log("Available artifacts:");
  artifacts.forEach((artifact, index) => {
    console.log(`${index + 1}. ${artifact}`);
  });
}

listArtifacts();
