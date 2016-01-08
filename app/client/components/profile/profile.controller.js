/**
 * @name        AmwProfileCtrl
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
    .controller('AmwProfileCtrl', Controller);

// *****************************************************************************
// Controller definition function
// *****************************************************************************

function Controller($rootScope, $scope, $timeout, $reactive, AuthService, PageService) {
    var vm = this;

    $reactive(vm).attach($scope);

    vm.subscribe('users');

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    vm.objUser        = {};
    vm.objEmailNew    = {};
    vm.objPasswordNew = {};

    // *****************************************************************************
    // Controller function linking
    // *****************************************************************************

    // *****************************************************************************
    // Controller function definition
    // *****************************************************************************

    // *****************************************************************************
    // Controller helper definitions
    // *****************************************************************************

    // *****************************************************************************

    /**
     * Helper function to initialize the controller.
     * This method is immediately invoked.
     */
    function _init() {
        var isDone = false;
        Tracker.autorun(function() {
            if (!isDone && Meteor.user()) {
                vm.objUser = Meteor.user();
                isDone = true;
            }
        });
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
