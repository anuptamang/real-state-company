'use strict';

/**
 * user-profile controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::user-profile.user-profile', ({ strapi }) => ({
  async find(ctx) {
    // Only allow users to access their own profile
    const user = ctx.state.user;
    
    if (!user) {
      return ctx.unauthorized('You must be logged in to view your profile');
    }

    // Filter to only return the current user's profile
    ctx.query.filters = {
      ...ctx.query.filters,
      user: user.id,
    };

    const response = await super.find(ctx);
    return response;
  },

  async findOne(ctx) {
    // Only allow users to access their own profile
    const user = ctx.state.user;
    
    if (!user) {
      return ctx.unauthorized('You must be logged in to view your profile');
    }

    const { id } = ctx.params;
    const profile = await strapi.entityService.findOne('api::user-profile.user-profile', id, {
      populate: ['user'],
    });

    if (!profile || profile.user?.id !== user.id) {
      return ctx.forbidden('You can only access your own profile');
    }

    return super.findOne(ctx);
  },

  async create(ctx) {
    // Get the authenticated user
    const user = ctx.state.user;
    
    if (!user) {
      return ctx.unauthorized('You must be logged in to create a profile');
    }

    // Check if profile already exists
    const existingProfile = await strapi.entityService.findMany('api::user-profile.user-profile', {
      filters: { user: user.id },
    });

    if (existingProfile && existingProfile.length > 0) {
      return ctx.badRequest('Profile already exists. Use update instead.');
    }

    // Add user to the request body
    ctx.request.body.data = {
      ...ctx.request.body.data,
      user: user.id,
    };

    const response = await super.create(ctx);
    return response;
  },

  async update(ctx) {
    // Get the authenticated user
    const user = ctx.state.user;
    
    if (!user) {
      return ctx.unauthorized('You must be logged in to update your profile');
    }

    const { id } = ctx.params;
    const profile = await strapi.entityService.findOne('api::user-profile.user-profile', id, {
      populate: ['user'],
    });

    if (!profile || profile.user?.id !== user.id) {
      return ctx.forbidden('You can only update your own profile');
    }

    // Prevent changing the user relation
    if (ctx.request.body.data?.user) {
      delete ctx.request.body.data.user;
    }

    const response = await super.update(ctx);
    return response;
  },
}));
