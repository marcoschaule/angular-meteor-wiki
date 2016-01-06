/**
 * @name        AmwHeaderCtrl
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
    .controller('AmwHeaderCtrl', Controller);

// *****************************************************************************
// Controller definition function
// *****************************************************************************

function Controller($state, $timeout, PageService) {
    var vm = this;

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    vm.flags    = PageService.flags;
    vm.strQuery = '';

    // *****************************************************************************
    // Controller function linking
    // *****************************************************************************

    vm.signOut         = signOut;
    vm.pageEditOpen    = pageEditOpen;
    vm.pageCopy        = pageCopy;
    vm.pageDelete      = pageDelete;
    vm.pageHistoryOpen = pageHistoryOpen;
    vm.pageBack        = pageBack;
    vm.isSignedIn      = isSignedIn;
    vm.isState         = isState;
    vm.isEditCopy      = isEditCopy;
    vm.search          = search;

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
     * Controller function to open the page's edit mode.
     */
    function pageEditOpen() {
        PageService.pageEditOpen();
    }

    // *****************************************************************************

    /**
     * Controller function to copy a page.
     */
    function pageCopy() {
        PageService.pageCopy();
    }

    // *****************************************************************************

    /**
     * Controller function to delete a page (including all versions).
     */
    function pageDelete() {
        PageService.pageDelete();
    }

    // *****************************************************************************

    /**
     * Controller function to open the current page's history.
     */
    function pageHistoryOpen() {
        PageService.pageHistoryOpen();
    }

    // *****************************************************************************

    /**
     * Controller function to go back to the page.
     */
    function pageBack() {
        PageService.pageBack();
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

    /**
     * Controller function to test whether state is "page".
     *
     * @param  {String}  strState  string of the state to be compared
     * @return {Boolean}           true if is "page" state
     */
    function isState(strState) {
        return (strState === $state.current.name);
    }

    // *****************************************************************************

    /**
     * Controller function to test whether the current page is a copy.
     * 
     * @return {Boolean}  true if current page is a copy
     */
    function isEditCopy() {
        return !!state.params.copyOf;
    }

    // *****************************************************************************

    /**
     * Controller function to search pages for a query.
     */
    function search() {
        $state.go('pageSearch', { query: vm.strQuery });
    }

    // *****************************************************************************
    // Controller helper definitions
    // *****************************************************************************

    /**
     * Helper function to initialize the controller.
     * This method is immediately invoked.
     */
    function _init() {
        $timeout(function() {
            vm.flags.isEditCopy = !!$state.params.copyOf;
            vm.strQuery         = $state.params.query;
        });
    } _init();

    // *****************************************************************************
}

// *****************************************************************************

})();
