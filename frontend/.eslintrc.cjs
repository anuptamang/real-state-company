module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  extends: [
    "@nuxtjs/eslint-config-typescript",
    "plugin:vue/vue3-recommended",
    "prettier",
  ],
  rules: {
    "vue/component-tags-order": [
      "error",
      {
        order: ["script", "template", "style"],
      },
    ],
    "vue/multi-word-component-names": "off",
  },
};
