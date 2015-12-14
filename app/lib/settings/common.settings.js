// ********************************************************************************
// Common configuration object
// ********************************************************************************

/**
 * Common config object.
 * @type {Object}
 */
C_CONFIG_COMMON = { server: {}, language: {}, pages: {} };

// ********************************************************************************
// Language configuration
// ********************************************************************************

/**
 * Common language default.
 * @type {String}
 */
C_CONFIG_COMMON.language.default = 'en';

// ********************************************************************************
// Pages configuration
// ********************************************************************************

/**
 * Common pages default.
 * @type {String}
 */
C_CONFIG_COMMON.pages.default = 'index';

/**
 * Common date format.
 * @type {String}
 */
C_CONFIG_COMMON.dateFormat = 'MMM Do YYYY';

/**
 * Common time format.
 * @type {String}
 */
C_CONFIG_COMMON.timeFormat = 'h:mm:ss a';

/**
 * Common date time format.
 * @type {String}
 */
C_CONFIG_COMMON.dateTimeFormat = C_CONFIG_COMMON.dateFormat + ', ' + C_CONFIG_COMMON.timeFormat;

// ********************************************************************************
