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

function Controller($rootScope, $scope, $state, $sce, $reactive, AuthService, PageService) {
    var vm = this;

    // make view model reactive
    $reactive(this).attach($scope);

    // *****************************************************************************
    // Subscriptions
    // *****************************************************************************

    // subscribe to pages collection
    vm.subscribe('pageSidebar');

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    vm.helpers({
        objPageSidebar: _readPageSidebar, // produces "vm.objPageSource"
    });

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

        var strPageName   = $state.params.page || 'index';
        var isIndexPage   = !$state.params.page || 'index' === $state.params.page;
        var strPageUrl    = isIndexPage ? '/' : strPageName;
        var objContent    = $('<div>' + strContent + '</div>');
        var regexLinkView = new RegExp(strPageUrl + '$');
        var regexLinkEdit = new RegExp(strPageUrl + '\\?edit=true$');
        var isEditable    = !!$state.params.edit;

        // remove all actives
        $('a', objContent).removeClass('active');
        
        var arrLinkView = $('a', objContent).filter(function() { return regexLinkView.test(this.href); });
        var arrLinkEdit = $('a', objContent).filter(function() { return regexLinkEdit.test(this.href); });

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
        if (vm.objPageSidebar && vm.objPageSidebar.content) {
            vm.objPageSidebar.content = _setCurrentLinkActive(marked(vm.objPageSidebar.content));
        }
    }

    // *****************************************************************************

    /**
     * Helper function to read a page "sidebar".
     * 
     * @return {Object}  object of the found page
     */
    function _readPageSidebar() {
        var objPage = Pages.findOne({ name: 'sidebar' });

        if (!objPage) {
            return;
        }

        objPage.title   = objPage &&
                objPage.versions &&
                objPage.versions[0].title;
        objPage.content = objPage &&
                objPage.versions &&
                objPage.versions[0].content;
        objPage.content = _setCurrentLinkActive(marked(objPage.content));

        return objPage;
    }

    // *****************************************************************************

    /**
     * Helper function to initialize the controller.
     * This method is immediately invoked.
     */
    function _init() {
    } _init();

    // *****************************************************************************
    // Events
    // *****************************************************************************

    // Event to change state in sidebar if event changes successfully
    $rootScope.$on('$stateChangeSuccess', function(
            objEvent, objToState, objToParams, objFromState, objFromParams) {
        _changeState();
    });

    // *****************************************************************************
}

// *****************************************************************************

})();
