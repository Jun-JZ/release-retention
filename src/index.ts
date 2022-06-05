import readline from "readline";
import path from "path";
import Deployments from "../input/Deployments.json";
import Environments from "../input/Environments.json";
import Projects from "../input/Projects.json";
import Releases from "../input/Releases.json";
import { getReleaseRetention, output } from "./core";

const FILE_RETENTION = path.resolve(
  __dirname,
  "../output/RetainedRelease.json"
);
const FILE_LOG = path.resolve(__dirname, "../output/verboseLog.log");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const main = () => {
  let n = parseInt(process.argv[2]);
  rl.close();
  if (!n) {
    console.error(
      "Usage: yarn start [n]: n is the number of releases you want to keep"
    );
    return;
  }

  const retainedRelease = getReleaseRetention(
    Projects,
    Environments,
    Deployments,
    Releases,
    n
  );

  output(retainedRelease, FILE_RETENTION, FILE_LOG);
};

main();
