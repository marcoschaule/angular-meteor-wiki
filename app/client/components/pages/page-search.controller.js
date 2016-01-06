/**
 * @name        AmwPageSearchCtrl
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
    .controller('AmwPageSearchCtrl', Controller);

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
    vm.subscribe('pages');

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    vm.strQuery = $state.params.query;
    vm.helpers({
        arrPages: _readPages,
    });

    // *****************************************************************************
    // Controller function linking
    // *****************************************************************************

    vm.pageOpen = pageOpen;

    // *****************************************************************************
    // Controller function definition
    // *****************************************************************************

    /**
     * Controller function to open a page.
     * 
     * @param {Object} objEvent     object of the event
     * @param {String} strPageName  string of the page name
     */
    function pageOpen(objEvent, strPageName) {
        return PageService.pageOpen(strPageName);
    }

    // *****************************************************************************
    // Controller helper definitions
    // *****************************************************************************

    /**
     * Helper function to read pages by search query.
     * 
     * @return {Array}  array of found pages
     */
    function _readPages() {
        var regexQuery = new RegExp(vm.strQuery, 'gi');

        return Pages.find({ $or: [
            { versions: { $elemMatch: { title  : regexQuery } } },
            { versions: { $elemMatch: { content: regexQuery } } },
         ]});
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
    });

    // *****************************************************************************
}

// *****************************************************************************

})();
