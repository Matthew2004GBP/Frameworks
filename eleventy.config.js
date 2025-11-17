// eleventy.config.js
// Pretty much the heart of this project
const markdownIt = require("markdown-it");

module.exports = function (eleventyConfig) {

  // everything done in public is being grabbed to put into work, mailnly the css file
  eleventyConfig.addPassthroughCopy({ "./public/": "/" });


  // Transforming strings into slugs
  eleventyConfig.addFilter("slug", (val) => {
    const s = 
    (val === null || val === undefined) ? "" : String(val);

    return s
      .toLowerCase()           // Transform it into lowercases
      .replace(/[^a-z0-9]+/g, "-") // instead of spaces and anything else thats not a letter, use a -
      .replace(/(^-|-$)/g, "");    // no need for any extra dashes so theres no things like ---
  });


  // truncate filter: cut a long string down to n characters with optional word boundary
  eleventyConfig.addFilter("truncate", function (str, n = 120, word = true, ellipsis = "…") {
    if (!str) return "";
    if (str.length <= n) return str;

    let out = str.slice(0, n);

    // Cutting back to last space if my word boundary is enabled
    if (word && out.includes(" ")) {
      out = out.slice(0, out.lastIndexOf(" "));
    }

    return out + ellipsis;
  });


  // turning the ISO date string to something easy to understand for all like "Nov 11, 2025"
  eleventyConfig.addFilter("readableDate", function (iso) {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit"
      });
    } catch {
      // keeps returning the normal values if there happens to be an error somehow
      return iso;
    }
  });

  // Markdown renderer setup
  const md = markdownIt({ 
    html: true, 
    linkify: true });

  // Transforming the MD files into HTML files for my eleventy site
  eleventyConfig.addFilter("unique", function (arr) {
  if (!arr) 
    return [];
  
  // deletes things that are empty
  const cleaned = arr.filter(Boolean);
  return [...new Set(cleaned)];
  });


  // Words starts with uppercase
  eleventyConfig.addFilter("capitalize", (s = "") => {
    return s.replace(/\b\w/g, (c) => c.toUpperCase());
  });


  // transforms an objects to JSON strings
  eleventyConfig.addFilter("json", (obj) => {
    return JSON.stringify(obj);
  });


  // fetches a certain attribute from all item inside of the array
  eleventyConfig.addFilter("map", function (arr, attr) {
  if (!arr)
     return [];
  
     return arr.map(function (item) {
    if (attr) {
     return item ? item[attr] : item;
    }
     return item;
    });
  });


  // Images get the pass through with this
  eleventyConfig.addPassthroughCopy("images");
};
