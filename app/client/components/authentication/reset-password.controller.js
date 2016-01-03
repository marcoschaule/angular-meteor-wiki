/**
 * @name        AmwResetPasswordCtrl
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
    .controller('AmwResetPasswordCtrl', Controller);

// *****************************************************************************
// Controller definition function
// *****************************************************************************

function Controller($rootScope, $state, AuthService) {
    var vm = this;

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    vm.strStep        = 'forgot';
    vm.strEmail       = '';
    vm.strPasswordNew = '';
    vm.objData        = {};
    vm.objErrs        = {};

    // *****************************************************************************
    // Controller function linking
    // *****************************************************************************

    vm.init           = init;
    vm.forgotPassword = forgotPassword;
    vm.resetPassword  = resetPassword;
    vm.isInvalid      = isInvalid;

    // *****************************************************************************
    // Controller function definition
    // *****************************************************************************

    /**
     * Service method to initialize controller. Is called immediately or can
     * be called from within controller.
     */
    function init() {
        if ('reset-password' === $state.current.name && $state.params.strToken) {
            vm.strStep = 'reset';
        }
        else if ('reset-password-complete' === $state.current.name) {
            vm.strStep = 'completed';
        }
        else {
            vm.strStep = 'forgot';
        }
    } init();

    // *****************************************************************************

    /**
     * Controller function to start a "forgot password" attempt.
     */
    function forgotPassword() {
        $rootScope.isProcessing = true;

        return AuthService.forgotPassword(vm.strEmail, function(objErrs) {
            $rootScope.isProcessing = false;
            if (objErrs) {
                return (vm.objErrs = objErrs);
            }
            vm.strEmail = '';
            return $state.go('resetPassword');
        });
    }

    // *****************************************************************************

    /**
     * Controller method to exchange the password with the new entered.
     */
    function resetPassword() {
        vm.objData.strToken = $state.params.strToken;
        $rootScope.isProcessing = true;

        return AuthService.resetPassword(vm.objData, function(objErrs) {
            $rootScope.isProcessing = false;
            if (objErrs) {
                return (vm.objErrs = objErrs);
            }
            vm.objData = {};
            return $state.go('resetPasswordComplete');
        });
    }

    // *****************************************************************************

    /**
     * Controller method to delegate the test for valid "resetPassword"
     * password and password confirmation.
     * 
     * @param  {String}  strFieldName  string of the field's name
     * @return {Boolean}               true if form is valid
     */
    function isInvalid(strFieldName) {
        var objErrs = AuthService.getErrs(vm.objData[strFieldName],
                strFieldName, 'resetPassword');
        
        if (!objErrs && vm.objErrs[strFieldName]) {
            delete vm.objErrs[strFieldName];
            return false;
        }

        _.extend(vm.objErrs, objErrs);
        return true;
    }

    // *****************************************************************************
    // Controller helper definitions
    // *****************************************************************************

    // *****************************************************************************
}

// *****************************************************************************

})();
