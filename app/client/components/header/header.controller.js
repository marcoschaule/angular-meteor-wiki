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

function Controller($rootScope, $scope, $state, $timeout, $reactive, PageService) {
    var vm = this;

    // make view model reactive
    $reactive(this).attach($scope);

    // *****************************************************************************
    // Subscriptions
    // *****************************************************************************

    // subscribe to pages collection
    vm.subscribe('pages');

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    vm.flags = {};
    vm.helpers({
        '__isEditFirst': _isEditFirst
    });

    // *****************************************************************************
    // Controller function linking
    // *****************************************************************************

    vm.signOut      = signOut;
    vm.isSignedIn   = isSignedIn;
    vm.pageEditOpen = pageEditOpen;
    vm.pageCopy     = pageCopy;
    vm.pageDelete   = pageDelete;
    vm.isPageState  = isPageState;
    vm.isEditCopy   = isEditCopy;

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
     * Controller method to delete a page (including all versions).
     */
    function pageDelete() {
        PageService.pageDelete();
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
     * @return {Boolean}  true if is "page" state
     */
    function isPageState() {
        return ('page' === $state.current.name);
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
    // Controller helper definitions
    // *****************************************************************************

    /**
     * Helper function to test whether the current page exists or not.
     * 
     * @return {Boolean}  true if page exists
     */
    function _isEditFirst() {
        var objPage = Pages.findOne({ name: $state.params.page });
        vm.flags.isEditFirst = !objPage;
    }

    // *****************************************************************************

    /**
     * Helper function to initialize the controller.
     * This method is immediately invoked.
     */
    function _init() {
        $timeout(function() {
            vm.flags.isEditCopy = !!$state.params.copyOf;
        });
    } _init();

    // *****************************************************************************
    // Events
    // *****************************************************************************

    // Event to change state in sidebar if event changes successfully
    $rootScope.$on('$stateChangeSuccess', function(
            objEvent, objToState, objToParams, objFromState, objFromParams) {
        _isEditFirst();
    });

    // *****************************************************************************
}

// *****************************************************************************

})();
