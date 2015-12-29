(function() { 'use strict';

// *****************************************************************************
// Extensions
// *****************************************************************************

_.mixin({
    capitalize   : capitalize,
    capitalizeAll: capitalizeAll,
    parseTitle   : parseTitle,
    parseQuery   : parseQuery,
});

// *****************************************************************************
// Definitions
// *****************************************************************************

/**
 * Function to capitalize one word of a given string.
 * 
 * @param  {String} str  string source
 * @return {String}      string capitalized
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
}

// *****************************************************************************

/**
 * Function to capitalize all words of a given string.
 * 
 * @param  {String} str  string source
 * @return {String}      string capitalized
 */
function capitalizeAll(str) {
    return str.split(' ').map(function(s) { return _.capitalize(s); }).join(' ');
}

// *****************************************************************************

/**
 * Function to parse a given url query to a readable title format.
 *
 * Example "i-am-an-url" will be parsed to "I Am An Url".
 * 
 * @param  {String} str  string source
 * @return {String}      string capitalized
 */
function parseTitle(str) {
    str = str.replace(/\-/g, ' ').replace(/\s{2}/g, ' ').trim();
    return _.capitalizeAll(str);
}

// *****************************************************************************
/**
 * Function to parse a given title formatted string to a valid url query.
 *
 * Example "I Am An Url" will be parsed to "i-am-an-url".
 * 
 * @param  {String} str  string source
 * @return {String}      string capitalized
 */
function parseQuery(str) {
    return str.toLowerCase().replace(/\s+/g, '-');
}

// *****************************************************************************

})();