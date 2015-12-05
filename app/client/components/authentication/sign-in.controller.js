/**
 * @name        AmwSignInCtrl
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
    .controller('AmwSignInCtrl', Controller);

// *****************************************************************************
// Controller definition function
// *****************************************************************************

function Controller($rootScope) {
    var vm = this;

    // *****************************************************************************
    // Private variables
    // *****************************************************************************

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    vm.objUser = {};
    vm.objErrs = null;

    // *****************************************************************************
    // Controller function linking
    // *****************************************************************************

    vm.signIn          = signIn;
    vm.isInvalidSignIn = isInvalidSignIn;

    // *****************************************************************************
    // Controller function definition
    // *****************************************************************************

    function signIn() {
        $rootScope.isProcessing = true;

        if (isInvalidSignIn()) {
            $rootScope.isProcessing = false;
            return false;
        }

        // Create user with username, email and password.
        return Meteor.loginWithPassword(vm.objUser.strUsername, vm.objUser.strPassword, function(err) {
            $rootScope.isProcessing = false;

            // handle errors
            if (err && (err.reason.indexOf('Incorrect password') >= 0 || err.reason.indexOf('User not found') >= 0)) {
                vm.objErrs.strSignIn = 'authentication.error.UsernameOrPasswordIncorrect';
                return false;
            }

            // reset and redirect
            _resetUser();

            return false;
        });
    }

    // *****************************************************************************

    function isInvalidSignIn() {
        vm.objErrs = {};

        if (!vm.objUser.strUsername) {
            vm.objErrs.strUsername = 'authentication.error.UsernameMissing';
        }
        if (!vm.objUser.strPassword) {
            vm.objErrs.strPassword = 'authentication.error.PasswordMissing';
        }
        if (Object.keys(vm.objErrs).length > 0) {
            return true;
        }

        return false;
    }

    // *****************************************************************************
    // Controller helper definitions
    // *****************************************************************************

    /**
     * Helper function to reset the user object.
     */
    function _resetUser() {
        vm.objUser.strUsername = '';
        vm.objUser.strPassword = '';
    }

    // *****************************************************************************

    /**
     * Support function to validate the form fields.
     * 
     * @param  {Object} objInput  object of form inputs
     * @return {Object}           object of errors that result in check
     */
    function _validateSignIn(objInput) {
        var objErrs = {};

        if (!objInput.strUsername) {
            objErrs.strUsername = 'authentication.error.UsernameMissing';
        }
        if (!objInput.strPassword) {
            objErrs.strPassword = 'authentication.error.PasswordMissing';
        }
        return objErrs;
    }

    // *****************************************************************************
}

// *****************************************************************************

})();
