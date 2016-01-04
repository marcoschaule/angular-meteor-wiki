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

function Controller($rootScope, $state, $sce, AuthService, PageService) {
    var vm = this;

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    vm.objPageView   = null;
    vm.objPageSource = null;

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
        if ('page' !== $state.current.name) {
            return strContent;
        }

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
     * Helper function to change the state in the sidebar by highlighting
     * the current link by setting it to active.
     */
    function _changeState() {
        if (vm.objPageSource && vm.objPageSource.title && vm.objPageSource.content) {
            vm.objPageView = {
                title  : vm.objPageSource.title,
                content: _setCurrentLinkActive(marked(vm.objPageSource.content)),
            };
        }
    }

    // *****************************************************************************

    /**
     * Helper function to load sidebar from database.
     */
    function _loadSidebar() {
        return PageService.pageRead('sidebar', function callback(objErr, objResult) {
            if (objResult && objResult.objPageView) {
                vm.objPageSource = objResult.objPageView;
                _changeState();
            }
        });
    }

    // *****************************************************************************

    /**
     * Helper function to initialize the controller.
     * This method is immediately invoked.
     */
    function _init() {
        _loadSidebar();
    } _init();

    // *****************************************************************************

    // Event to change state in sidebar if event changes successfully
    $rootScope.$on('$stateChangeSuccess', function(
            objEvent, objToState, objToParams, objFromState, objFromParams) {
        _changeState();
    });

    // Event to change state in sidebar was updated
    $rootScope.$on('amwBroadcastSidebarChanged', function(
            objTo, objFrom) {
        _loadSidebar();
    });

    // *****************************************************************************
}

// *****************************************************************************

})();
