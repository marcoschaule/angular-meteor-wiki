/**
 * @name        AmwPageSidebarCtrl
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
    .controller('AmwSidebarCtrl', Controller);

// *****************************************************************************
// Controller definition function
// *****************************************************************************

function Controller($state, $sce, AuthService, PageService) {
    var vm = this;

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    vm.objPageSidebar = null;

    // *****************************************************************************
    // Controller function linking
    // *****************************************************************************

    vm.signOut    = signOut;
    vm.isSignedIn = isSignedIn;

    // *****************************************************************************
    // Controller function definition
    // *****************************************************************************

    /**
     * Controller function to sign out.
     */
    function signOut() {
        AuthService.signOut();
    }

    // *****************************************************************************

    /**
     * Controller function to test whether user is singed in or not.
     * 
     * @return {Boolean}  true if user is signed in
     */
    function isSignedIn() {
        return !!Meteor.userId();
    }

    // *****************************************************************************
    // Controller helper definitions
    // *****************************************************************************

    /**
     * Helper function to set active the current
     * link in the sidebar page content.
     * 
     * @param {String} strContent  string of content including active link
     */
    function _setCurrentLinkActive(strContent) {
        var strPageName    = $state.params.page || 'index';
        var isIndexPage    = !$state.params.page || 'index' === $state.params.page;
        var strPageUrl     = isIndexPage ? '/' : strPageName;
        var objContent     = $('<div>' + strContent + '</div>');
        var regexLinkView  = new RegExp(strPageUrl + '$');
        var regexLinkEdit  = new RegExp(strPageUrl + '\\?edit=true$');
        var isEditable     = !!$state.params.edit;
        
        var arrLinkView    = $('a', objContent).filter(function() { return regexLinkView.test(this.href); });
        var arrLinkEdit    = $('a', objContent).filter(function() { return regexLinkEdit.test(this.href); });

        if (vm.isIndexPage && arrLinkView.length) {
            arrLinkView.addClass('active');
        }
        else if (arrLinkEdit.length > 0 && isEditable) {
            arrLinkEdit.addClass('active');
        }
        else if (arrLinkView.length > 0) {
            arrLinkView.addClass('active');
        }

        return objContent.html();
    }

    // *****************************************************************************

    /**
     * Helper function to initialize controller. Is called immediately or can
     * be called from within controller.
     */
    function _init() {
        return PageService.pageRead('sidebar', function callback(objErr, objResult) {
            if (objResult && objResult.objPageView) {
                vm.objPageSidebar = {
                    title  : objResult.objPageView.title,
                    content: _setCurrentLinkActive(marked(objResult.objPageView.content)),
                };
            }
        });
    } _init();

    // *****************************************************************************
}

// *****************************************************************************

})();
