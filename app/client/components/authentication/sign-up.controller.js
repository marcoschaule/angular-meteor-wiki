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
    .controller('AmwSignUpCtrl', Controller);

// *****************************************************************************
// Controller definition function
// *****************************************************************************

function Controller($rootScope, $state, AuthService) {
    var vm = this;

    // *****************************************************************************
    // Private variables
    // *****************************************************************************

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    vm.objUserNew = AuthService.objUserNew;
    vm.objErrs    = {};

    // *****************************************************************************
    // Controller function linking
    // *****************************************************************************

    vm.signUp        = signUp;
    vm.isSignUpValid = isSignUpValid;

    // *****************************************************************************
    // Controller function definition
    // *****************************************************************************

    /**
     * Controller function to accomplish a sign up supported by the 
     * authentication service.
     */
    function signUp() {
        $rootScope.isProcessing = true;
        return AuthService.signUp(objOptions, function(err) {

            if (err) {
                vm.objErrs.strGeneral = err;
                $rootScope.isProcessing = false;
                return;
            }

            // disable processing, reset user and redirect
            $state.go('profile');
            $rootScope.isProcessing = false;

            return;
        });
    }

    // *****************************************************************************

    /**
     * Controller method to delegate the test for valid sign up form to the
     * authentication service.
     * 
     * @param  {String}  strFieldName   string of the field's name
     * @param  {String}  strFieldValue  string of the field's value
     * @return {Boolean}                true if form is valid
     */
    function isSignUpValid(strFieldName) {
        var strTranslation = 'authentication.error.' + strFieldName + 'Missing';
        return AuthService.isSignUpValid(strFieldName, vm.objUserNew['str' + strFieldName]);
    }

    // *****************************************************************************
    // Controller helper definitions
    // *****************************************************************************

    // *****************************************************************************
}

// *****************************************************************************

})();
