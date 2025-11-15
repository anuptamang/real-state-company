'use strict';

/**
 * global-option service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::global-option.global-option');
