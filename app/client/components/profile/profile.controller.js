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


    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    vm.strEmailNew = null;
    vm.objErrs     = {};

    // reactive helpers
    vm.helpers({
        objUser: _getUser
    });

    // *****************************************************************************
    // Controller function linking
    // *****************************************************************************

    vm.addEmail        = addEmail;
    vm.setPrimaryEmail = setPrimaryEmail;

    // *****************************************************************************
    // Controller function definition
    // *****************************************************************************

    function addEmail() {
        return AuthService.addEmail(vm.strEmailNew, function(objErrs) {
            if (objErrs) {
                $timeout(function() {
                    vm.objErrs = objErrs;
                });
                return;
            }
            _resetEmail();
            _resetErrors();
        });
    }

    // *****************************************************************************

    /**
     * Controller function to set primary email address.
     * 
     * @param {String} strEmail  string of email to be set to primary
     */
    function setPrimaryEmail(strEmail) {
        return AuthService.setPrimaryEmail(strEmail);
    }

    // *****************************************************************************
    // Controller helper definitions
    // *****************************************************************************

    function _getUser() {
        return Meteor.users.findOne({ _id: Meteor.userId() });
    }

    // *****************************************************************************

    function _resetEmail() {
        vm.strEmailNew = null;
    }

    // *****************************************************************************

    function _resetErrors() {
        vm.objErrs = {};
    }

    // *****************************************************************************

    /**
     * Helper function to initialize the controller.
     * This method is immediately invoked.
     */
    function _init() {
        vm.subscribe('userData');
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
