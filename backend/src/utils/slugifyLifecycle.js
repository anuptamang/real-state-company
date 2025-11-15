"use strict";

/**
 * Generate a slug from a string — no external deps.
 * Converts spaces & special chars into lowercase kebab-case.
 */
function toSlug(text) {
  return text
    .toString()
    .normalize("NFD") // handle accents
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/[^a-zA-Z0-9\s-]/g, "") // remove non-alphanumeric
    .trim()
    .replace(/\s+/g, "-") // replace spaces with dashes
    .replace(/-+/g, "-") // collapse multiple dashes
    .toLowerCase();
}

/**
 * Ensure slug is unique for the given content type.
 */
async function ensureUniqueSlug(baseSlug, uid, excludeId = null) {
  const existing = await strapi.db.query(uid).findMany({
    where: {
      slug: { $startsWith: baseSlug },
      ...(excludeId ? { id: { $ne: excludeId } } : {}),
    },
    select: ["slug"],
  });

  if (!existing.length) return baseSlug;

  const slugs = existing.map((e) => e.slug);
  let counter = 2;
  let newSlug = baseSlug;

  while (slugs.includes(newSlug)) {
    newSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return newSlug;
}

module.exports = {
  /**
   * Lifecycle: beforeCreate
   */
  async beforeCreate(event) {
    const { model, params } = event;
    if (!params?.data?.title || !("slug" in model.attributes)) return;

    const baseSlug = toSlug(params.data.slug || params.data.title);
    params.data.slug = await ensureUniqueSlug(baseSlug, model.uid);
  },

  /**
   * Lifecycle: beforeUpdate
   */
  async beforeUpdate(event) {
    const { model, params, where } = event;
    if (!params?.data?.title || !("slug" in model.attributes)) return;

    const baseSlug = toSlug(params.data.slug || params.data.title);
    params.data.slug = await ensureUniqueSlug(baseSlug, model.uid, where?.id);
  },
};
