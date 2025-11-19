'use strict';

/**
 * property-comment controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::property-comment.property-comment', ({ strapi }) => ({
  async create(ctx) {
    // Get the authenticated user
    const user = ctx.state.user;
    
    if (!user) {
      return ctx.unauthorized('You must be logged in to submit a comment');
    }

    // Log the incoming request for debugging
    console.log('Creating comment with data:', ctx.request.body.data);
    console.log('User ID:', user.id);

    // Validate property exists and get the actual property entity
    if (ctx.request.body.data?.property) {
      const propertyId = ctx.request.body.data.property;
      console.log('Looking for property with ID:', propertyId);
      
      try {
        const property = await strapi.entityService.findOne('api::property.property', propertyId);
        console.log('Property found:', property ? 'Yes' : 'No');
        
        if (!property) {
          return ctx.badRequest(`Property with ID ${propertyId} not found`);
        }
      } catch (error) {
        console.error('Error finding property:', error);
        return ctx.badRequest(`Error validating property: ${error.message}`);
      }
    } else {
      return ctx.badRequest('Property ID is required');
    }

    // Prepare the data for creation
    const commentData = {
      property: ctx.request.body.data.property,
      comment: ctx.request.body.data.comment,
      user: user.id,
      approved: false, // Default to unapproved
    };

    // Add parent if it's a reply
    if (ctx.request.body.data.parent) {
      commentData.parent = ctx.request.body.data.parent;
    }
    
    console.log('Final data being sent to create:', commentData);

    // Use entityService directly to bypass potential validation issues
    try {
      const comment = await strapi.entityService.create('api::property-comment.property-comment', {
        data: commentData,
      });

      // Populate the response
      const populatedComment = await strapi.entityService.findOne(
        'api::property-comment.property-comment',
        comment.id,
        {
          populate: {
            user: {
              fields: ['username', 'email'],
            },
            property: {
              fields: ['id', 'title'],
            },
          },
        }
      );

      return { data: populatedComment };
    } catch (error) {
      console.error('Error creating comment with entityService:', error);
      // Fall back to super.create if entityService fails
      ctx.request.body.data = commentData;
      const response = await super.create(ctx);
      return response;
    }
  },

  async find(ctx) {
    // Only return approved comments for public access
    // Admins can see all comments
    const user = ctx.state.user;
    const isAdmin = user && user.role?.type === 'admin';

    if (!isAdmin) {
      ctx.query.filters = {
        ...ctx.query.filters,
        approved: true,
      };
    }

    // Populate user and replies
    ctx.query.populate = {
      user: {
        fields: ['username', 'email'],
      },
      replies: {
        populate: {
          user: {
            fields: ['username', 'email'],
          },
        },
        filters: isAdmin ? {} : { approved: true },
        sort: 'createdAt:asc',
      },
    };

    // Fetch user profiles for all users in comments
    const response = await super.find(ctx);
    
    if (response.data && Array.isArray(response.data)) {
      // Get all unique user IDs from comments and replies
      const userIds = new Set();
      response.data.forEach((comment) => {
        if (comment.user?.id) {
          userIds.add(comment.user.id);
        }
        if (comment.replies && Array.isArray(comment.replies)) {
          comment.replies.forEach((reply) => {
            if (reply.user?.id) {
              userIds.add(reply.user.id);
            }
          });
        }
      });

      // Fetch user profiles for all users
      if (userIds.size > 0) {
        try {
          const profiles = await strapi.entityService.findMany('api::user-profile.user-profile', {
            filters: {
              user: {
                id: {
                  $in: Array.from(userIds),
                },
              },
            },
            populate: ['user'],
          });

          // Create a map of user ID to profile
          const profileMap = new Map();
          if (Array.isArray(profiles)) {
            profiles.forEach((profile) => {
              if (profile.user?.id) {
                profileMap.set(profile.user.id, profile);
              }
            });
          }

          // Attach profiles to users
          response.data.forEach((comment) => {
            if (comment.user?.id && profileMap.has(comment.user.id)) {
              comment.user.profile = profileMap.get(comment.user.id);
            }
            if (comment.replies && Array.isArray(comment.replies)) {
              comment.replies.forEach((reply) => {
                if (reply.user?.id && profileMap.has(reply.user.id)) {
                  reply.user.profile = profileMap.get(reply.user.id);
                }
              });
            }
          });
        } catch (error) {
          // If profile fetch fails, continue without profiles
          console.warn('Failed to fetch user profiles:', error);
        }
      }
    }

    return response;
  },
}));
