const fabric = require('@umijs/fabric');

module.exports = {
  ...fabric.default,
  rules: {
    ...fabric.default.rules,
  },
  globals: {
    page: true,
  },
};
