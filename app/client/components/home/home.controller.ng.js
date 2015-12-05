/**
 * @name        AmwHomeCtrl
 * @author      Marco Schaule <marco.schaule@net-designer.net>
 * @file        This file is an AngularJS controller.
 * 
 * @copyright   (c) 2015  net-designer.net, Marco Schaule <marco.schaule@net-designer.net>
 * @license     https://github.com/OnceMac/net-designer.net/blob/master/LICENSE
 */
(function() { 'use strict';

// *****************************************************************************
// Controller module
// *****************************************************************************

angular
    .module('amw-controllers')
    .controller('AmwHomeCtrl', Controller);

// *****************************************************************************
// Controller definition function
// *****************************************************************************

function Controller() {
    var vm = this;

    // *****************************************************************************
    // Private variables
    // *****************************************************************************

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    // *****************************************************************************
    // Function linking
    // *****************************************************************************

    // *****************************************************************************
    // Function definitions
    // *****************************************************************************

    // *****************************************************************************
}

// *****************************************************************************

})();




// (function() { 'use strict';

// // *****************************************************************************
// // Initialization
// // *****************************************************************************

// /**
//  * Initialization function for public files.
//  */
// function init() {

//     // Layout events, also used by subtemplates
//     Template.body.events({
//         'click .sign-out'              : eventSignOut,
//         'click #btn-toggle-menu-system': eventToggleMenuSystem,
//     });

//     // Layout helpers like processing and routing
//     Template.body.helpers({
//         'objSidebar'    : helperGetPageSidebar,
//         'isProcessing'  : helperIsProcessing,
//         'strClassClosed': helperStrClassClosed,
//     });
    
// } init();

// // *****************************************************************************
// // Helper function definitions
// // *****************************************************************************

// /**
//  * Interaction function to get side bar.
//  */
// function helperGetPageSidebar() {
//     if (!Router.current()) {
//         return;
//     }

//     var strPageName = Router.current().params.strPageName;
//     var objPage     = Pages.findOne({ 'strName': 'sidebar' });

//     if (!objPage || !objPage.arrVersions || objPage.arrVersions.length <= 0) {
//         return;
//     }

//     // create the full page object to be used in template
//     var objPageReturn = {
//         _id          : objPage._id,
//         _idCreatedBy : objPage._idCreatedBy,
//         dateCreatedAt: objPage.dateCreatedAt,
//         strName      : objPage.strName,
//         _idChangedBy : objPage.arrVersions[0]._idChangedBy,
//         dateChangedAt: objPage.arrVersions[0].dateChangedAt,
//         strTitle     : objPage.arrVersions[0].strTitle,
//         strContent   : objPage.arrVersions[0].strContent,
//         strParser    : objPage.arrVersions[0].strParser,
//         isPublished  : objPage.isPublished,
//         isPrivate    : objPage.isPrivate,
//     };

//     // replace markdown content
//     objPageReturn.strContent = preprocessMarkdown(objPageReturn.strContent);
//     objPageReturn.strContent = preprocessMarkdownSidebar(objPageReturn.strContent, strPageName);

//     return objPageReturn;
// }

// // *****************************************************************************

// /**
//  * Helper function to test whether the app is processing.
//  */
// function helperIsProcessing() {
//     return Session.get('isProcessing');
// }

// // *****************************************************************************

// /**
//  * Helper function to get the string class "closed".
//  */
// function helperStrClassClosed() {
//     return Session.get('strClassClosed');
// }

// // *****************************************************************************

// /**
//  * Helper function to test whether a string is a route.
//  * 
//  * @param  {String} _strRoute  string of route
//  */
// function helperIsRoute(_strRoute) {
//     var strRoute = _strRoute;

//     return function() {
//         if (Router.current() && Router.current().route && Router.current().route.path) {
//             return Router.current().route.path(this) === strRoute;
//         }
//         return false;
//     };
// }

// // *****************************************************************************
// // Event function definitions
// // *****************************************************************************

// /**
//  * Event function to sign out including all consequences.
//  */
// function eventSignOut() {
//     Session.set('isProcessing', true);
//     setTimeout(function() {
//         Meteor.logout(function() {
//             Session.set('isProcessing', false);
//         });
//     }, 300);
// }

// // *****************************************************************************

// /**
//  * Event function to toggle menus.
//  */
// function eventToggleMenuSystem() {
//     Session.set('strClassClosed', 'closed' === Session.get('strClassClosed') ? '' : 'closed');
// }

// // *****************************************************************************

// })();