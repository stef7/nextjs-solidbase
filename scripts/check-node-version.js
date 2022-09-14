/* eslint-disable unicorn/prefer-module */
const { readFileSync } = require("node:fs");
const path = require("node:path");

const requiredVersion = readFileSync(path.resolve(".nvmrc"), { encoding: "utf8" }).match(/^\D*\d+/)[0];

const currentVersion = process.versions.node.match(/^\D*\d+/)[0];

if (currentVersion !== requiredVersion)
  throw new Error(`Node.js major version ${requiredVersion} required, currently using ${currentVersion}.`);
