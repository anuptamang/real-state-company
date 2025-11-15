"use strict";

/**
 * global-option controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::global-option.global-option",
  ({ strapi }) => ({
    async find(ctx) {
      // Use the Entity Service API instead of db.query()
      const entity = await strapi.entityService.findMany(
        "api::global-option.global-option",
        {
          populate: {
            site: {
              populate: {
                favicon: true,
                defaultSeo: {
                  populate: {
                    shareImage: true,
                  },
                },
              },
            },
            header: {
              populate: {
                logo: true,
                menu: {
                  populate: {
                    items: {
                      populate: {
                        page: true,
                        property: true,
                      },
                    },
                  },
                },
              },
            },
            footer: {
              populate: {
                socialMedia: true,
                menu: {
                  populate: {
                    items: {
                      populate: {
                        page: true,
                        property: true,
                      },
                    },
                  },
                },
              },
            },
          },
        }
      );

      const sanitized = await this.sanitizeOutput(entity, ctx);
      return this.transformResponse(sanitized);
    },
  })
);
