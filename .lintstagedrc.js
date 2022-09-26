// https://nextjs.org/docs/basic-features/eslint#lint-staged

const path = require("path");

module.exports = {
  "*.[jt]sx?": (filenames) =>
    `next lint --fix --file ${filenames.map((f) => path.relative(process.cwd(), f)).join(" --file ")}`,
  "*.{css,css}": `stylelint --fix`,
};
