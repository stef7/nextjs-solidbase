/* eslint-disable unicorn/prefer-module */
const { readFileSync } = require("node:fs");
const path = require("node:path");

const requiredVersion = readFileSync(path.resolve(".nvmrc"), { encoding: "utf8" }).trim();

const currentVersion = process.versions.node;

if (currentVersion !== requiredVersion)
  throw new Error(`Node.js version ${requiredVersion} required. Currently using version ${currentVersion}.`);
