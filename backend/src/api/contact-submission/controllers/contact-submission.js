'use strict';

/**
 * contact-submission controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::contact-submission.contact-submission', ({ strapi }) => ({
  async create(ctx) {
    // Allow public submissions (no authentication required)
    // This is safe because we're only allowing creation, not reading/updating/deleting
    const response = await super.create(ctx);
    return response;
  },
}));
