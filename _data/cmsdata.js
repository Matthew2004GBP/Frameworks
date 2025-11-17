// _data/cmsdata.js
// Build-time CMS fetch with caching + normalized fields for templates & search.

const EleventyFetch = require("@11ty/eleventy-fetch");

// Simple slug helper for titles, categories, etc.
const slugify = (s = "") =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Helper to remove duplicates and falsy values from an array
const unique = (arr = []) => [...new Set(arr.filter(Boolean))];

module.exports = async function () {
  // API URL: can be overridden with CMS_API_URL, otherwise uses demo JSONPlaceholder
  const url =
    process.env.CMS_API_URL ||
    "https://jsonplaceholder.typicode.com/posts"; // demo API

  try {
    // Cache JSON for about an hour so rebuilds can come in faster.
    const posts = await EleventyFetch(url, {
      duration: "1h",
      type: "json",
    });

    // The main 3 categories
    const categories = ["About", "Hobbies", "Future"];

    // The main tags that will be searched for by the user hopefully
    const extraTagsByCat = {
      About: ["Computer programming", "DC", "College"],
      Hobbies: ["hobbies", "karate", "sleeping"],
      Future: ["future", "Tech career", "Plans"],
    };

    // The appearance of the titles and some nicer tags/categories for the first few posts
    const friendly = [
      {
        title: "What course am I taking?",
        tags: ["Computer programming", "DC", "College"],
        category: "About",
      },
      {
        title: "My favorite hobbies",
        tags: ["hobbies", "karate", "sleeping"],
        category: "Hobbies",
      },
      {
        title: "My future plans",
        tags: ["future", "Tech career", "Plans"],
        category: "Future",
      },
    ];

    // Used to create staggered dates for each item
    const now = Date.now();

    // raw API posts
    const modeled = posts.slice(0, 12).map(function (p, i) {
      // Optional override for nicer titles/tags/categories for first few posts
      const override = friendly[i] ? friendly[i] : null;

      // Category from override
      let category = categories[i % categories.length];
      if (override && override.category) {
        category = override.category;
      }

      const body = p.body ? p.body : "";

      // main tags
      let baseTitleTags = [];
      const t = override && override.title ? override.title : p.title;
      if (t) {
        baseTitleTags = t
          .split(/\s+/)
          .slice(0, 3)
          .map(function (word) {
            return word.toLowerCase();
          });
      }

    // The empty tags waiting ti bve filled up with info
      let tags = [];

      // tags added if the friendly override decided to give some tags
      if (override && override.tags) {
        tags = tags.concat(override.tags);
      }

      // The category would be itself as a tag along with the others
      if (category) {
        tags.push(category.toLowerCase());
      }

      // The tags that came from the titles would be added as tags
      tags = tags.concat(baseTitleTags);


      // Ensuring the tags are not repeating themselves at any point
      tags = unique(tags);


      // will override if available or else API title will be falling back to "Untitled"
      let title = "Untitled";
      if (override && override.title) {
        title = override.title;
      } else if (p.title) {
        title = p.title;
      }

      // Slug is using the title plus ID so there are no collisions
      const baseSlug = slugify(title);
      const slug = p.id ? baseSlug + "-" + p.id : baseSlug;

      // Short excerpt
      let excerpt = body;
      if (body.length > 160) {
        excerpt = body.slice(0, 157 /* keep ellipsis space */) + "…";
      }

      return {
        title,
        slug,
        category,
        tags,
        body,
        excerpt,
        // The dates being staggerd each of them should be a day apart
        publishedAt: new Date(now - i * 86400000).toISOString(),
      };
    });

    // newest ones appear first
    modeled.sort(function (a, b) {
      return new Date(b.publishedAt) - new Date(a.publishedAt);
    });

    return modeled;
  } catch (err) {
    console.error("CMS fetch error:", err);

    // if the API is off for whatever reason, the Graceful fallback will still build the site
    return [
      {
        title: "Fallback: Example Item",
        slug: "fallback-example",
        category: "About",
        tags: ["fallback", "about", "course", "durham"],
        body:
          "The CMS/API was unavailable; this is local fallback content so the build succeeds.",
        excerpt:
          "The CMS/API was unavailable; this is local fallback content so the build succeeds.",
        publishedAt: new Date().toISOString(),
        imageUrl: null,
      },
    ];
  }
};
