'use strict';

/**
 * global-option router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::global-option.global-option');
