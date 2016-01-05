(function() { 'use strict';

// ********************************************************************************
// Publish function linking
// ********************************************************************************

// Publish function linking
Meteor.publish('pages',       publishPages);
Meteor.publish('pageSidebar', publishPageSidebar);

// ********************************************************************************
// Publish function definitions
// ********************************************************************************

/**
 * Publish function to publish pages collection
 * to the client.
 * 
 * @return {Object}  object in form of a cursor to be used with "fetch", "map" or "forEach"
 */
function publishPages() {
    return Pages.find();
}
// ********************************************************************************

/**
 * Publish function to publish the page "sidebar"
 * of the pages collection to the client.
 * 
 * @return {Object}  object in form of a cursor to be used with "fetch", "map" or "forEach"
 */
function publishPageSidebar() {
    return Pages.findOne({ name: 'sidebar' });
}

// ********************************************************************************

})();
