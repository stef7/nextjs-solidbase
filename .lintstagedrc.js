// https://nextjs.org/docs/basic-features/eslint#lint-staged

const path = require("path");

module.exports = {
  "*.(j|t)s(x|)": (filenames) =>
    `next lint --fix --file ${filenames.map((f) => path.relative(process.cwd(), f)).join(" --file ")}`,
  "*.css": `stylelint --fix`,
};
