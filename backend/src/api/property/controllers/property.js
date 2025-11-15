'use strict';

/**
 * property controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::property.property', ({ strapi }) => ({
  async find(ctx) {
    if (ctx.query.populate === "deep") {
      // Replace populate=deep with our custom populate structure
      ctx.query.populate = {
        images: true,
        seo: {
          populate: {
            shareImage: true,
          },
        },
      };
    }

    // Let the default controller handle the rest (filters, pagination, etc.)
    return await super.find(ctx);
  },

  async findOne(ctx) {
    if (ctx.query.populate === "deep") {
      // Replace populate=deep with our custom populate structure
      ctx.query.populate = {
        images: true,
        seo: {
          populate: {
            shareImage: true,
          },
        },
      };
    }

    // Let the default controller handle the rest
    return await super.findOne(ctx);
  },
}));
