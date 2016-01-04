/**
 * @name        AmwPageToolbarCtrl
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

function Controller($state, $modal, $timeout, PageService) {
    var vm = this;

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    vm.flags                = PageService.flags;
    vm.flags.isUserSignedIn = !!Meteor.userId();

    // *****************************************************************************
    // Controller function linking
    // *****************************************************************************

    vm.signOut      = signOut;
    vm.isSignedIn   = isSignedIn;
    vm.pageEditOpen = pageEditOpen;
    vm.pageCopy     = pageCopy;
    vm.pageDelete   = pageDelete;
    vm.isPageState  = isPageState;

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
     * Controller method to delete a page (including all versions).
     */
    function pageDelete() {
        PageService.pageDelete();
    }

    // *****************************************************************************

    /**
     * Controller function to test whether state is "page".
     * 
     * @return {Boolean}  true if is "page" state
     */
    function isPageState() {
        return ('page' === $state.current.name);
    }

    // *****************************************************************************
    // Controller helper definitions
    // *****************************************************************************

    // *****************************************************************************
}

// *****************************************************************************

})();
