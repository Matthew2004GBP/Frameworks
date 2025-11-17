// _data/categories.js
const slugify = (val) =>
  String(val || "")
     // Transforms to lowercase
    .toLowerCase()
    //Transforms anything thats not a letter into a dash
    .replace(/[^a-z0-9]+/g, "-")
    // in case there happens to be things like a double space or any other character this doesn't make a double dash
    .replace(/(^-|-$)/g, "");

module.exports = async function () {
  // here the CMS data gets imported
  const cmsdata = await require("./cmsdata")();

  //Remembers what Was seen already
  const seenCategories = new Set();
  // This will hold the final categories
  const categories = [];

  //starts looping throughout all the cms
  for (const item of cmsdata) {
    //ensures no empty things get added
    if (item && typeof item.category === "string" && item.category.trim()) {
      const name = item.category.trim();

      // Adds the category if it hasn't been seen before
      if (!seenCategories.has(name)) {
        // This prevents multiple catgories from being created and generating a ton of duplicates in eleventy
        seenCategories.add(name);

        //Adds the slug to the categories array
        categories.push({ name, slug: slugify(name) }
      );
      }
    }
  }

  return categories;
};
