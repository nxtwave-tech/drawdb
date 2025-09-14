const tailwindcss = require("tailwindcss");

module.exports = {
  plugins: [
    tailwindcss("./tailwind.config.js"),
    require("autoprefixer"),
    require("postcss-prefixwrap")(".drawdb-scope", {
      ignoredSelectors: [
        ".semi-",
        "input",
        "button",
        "select",
        "textarea",
        "form",
        "label",
        "div",
        "span",
        "p",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "ul",
        "ol",
        "li",
        "a",
        "img",
        "table",
        "tr",
        "td",
        "th",
      ],
    }),
  ],
};
