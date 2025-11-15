const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::page.page", ({ strapi }) => ({
  async find(ctx) {
    if (ctx.query.populate === "deep") {
      // Replace populate=deep with our custom populate structure using fragments for dynamiczones
      ctx.query.populate = {
        blocks: {
          on: {
            "blocks.hero": {
              populate: {
                image: true,
                cta: true,
              },
            },
            "blocks.features": {
              populate: {
                features: {
                  populate: {
                    icon: true, // shared.icon component
                  },
                },
              },
            },
            "blocks.cta": {
              populate: {
                icon: true, // shared.icon component
                button: true,
              },
            },
            "blocks.content": true,
            "blocks.properties-list": {
              populate: {
                properties: {
                  populate: {
                    images: true,
                  },
                },
              },
            },
            "blocks.contact-form": true,
            "blocks.google-map": {
              populate: {
                pinInfo: true,
              },
            },
            "blocks.testimonials": {
              populate: {
                testimonials: {
                  populate: {
                    avatar: true,
                  },
                },
              },
            },
            "blocks.team": {
              populate: {
                team: {
                  populate: {
                    image: true,
                  },
                },
              },
            },
          },
        },
        seo: {
          populate: {
            shareImage: true, // The field is called shareImage, not metaImage
          },
        },
      };
    }

    // Let the default controller handle the rest (filters, pagination, etc.)
    return await super.find(ctx);
  },

  async findOne(ctx) {
    if (ctx.query.populate === "deep") {
      // Replace populate=deep with our custom populate structure using fragments for dynamiczones
      ctx.query.populate = {
        blocks: {
          on: {
            "blocks.hero": {
              populate: {
                image: true,
                cta: true,
              },
            },
            "blocks.features": {
              populate: {
                features: {
                  populate: {
                    icon: true, // shared.icon component
                  },
                },
              },
            },
            "blocks.cta": {
              populate: {
                icon: true, // shared.icon component
                button: true,
              },
            },
            "blocks.content": true,
            "blocks.properties-list": {
              populate: {
                properties: {
                  populate: {
                    images: true,
                  },
                },
              },
            },
            "blocks.contact-form": true,
            "blocks.google-map": {
              populate: {
                pinInfo: true,
              },
            },
            "blocks.testimonials": {
              populate: {
                testimonials: {
                  populate: {
                    avatar: true,
                  },
                },
              },
            },
            "blocks.team": {
              populate: {
                team: {
                  populate: {
                    image: true,
                  },
                },
              },
            },
          },
        },
        seo: {
          populate: {
            shareImage: true, // The field is called shareImage, not metaImage
          },
        },
      };
    }

    // Let the default controller handle the rest
    return await super.findOne(ctx);
  },
}));
