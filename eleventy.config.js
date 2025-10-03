module.exports = function (eleventyConfig) {
  // Copy public/ folder to _site/
  eleventyConfig.addPassthroughCopy({
    "./public/": "/",
  });
};
