// _data/categories.js

// This part of the project turns strings into friendly user slugs
function slugify(value) {

  // make everything lowercase
  let lower = String
  (value || "").toLowerCase();

  // replace any non letters/numbers with "-"
  lower = lower.replace
  (/[^a-z0-9]+/g, "-");

  // Removing the -
  lower = lower.replace
  (/(^-|-$)/g, "");

  return lower;
}

// Calling category data and transform it into arrays of categorys givin a name and a slug
module.exports = async function () {

  // using the same cms data that is being used with the cmsdata.js file
  const cmsdata = await require
  ("./cmsdata")();

  // keeps track of what categories were already used
  const seen = new Set();

  // this will hold the final output
  const out = [];

  // Looping all items into the CMS data
  for (let it of cmsdata || []) {

    // Ensures there is an actual item there and not nothing things
    if 
    (it && typeof it.category === "string" && it.category.trim()) {

      //If the category has not been seen before
      if (!seen.has(it.category)) {

        // stopping categories from being duplicated
        seen.add(it.category);

        // adding the name and slug of the category to the array
        out.push({ 
          name: it.category, 
          slug: slugify(it.category) 
        });
      }
    }
  }

  // Preparing the final list of the categories
  return out;
};
