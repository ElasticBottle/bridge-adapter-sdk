module.exports = {
  root: true,
  extends: [
    "bridge-adapter-sdk",
    "plugin:@tanstack/eslint-plugin-query/recommended",
  ],
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
};
