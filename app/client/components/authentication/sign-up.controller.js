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

function Controller($rootScope) {
    var vm = this;

    // *****************************************************************************
    // Private variables
    // *****************************************************************************

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    vm.objUserNew = {};
    vm.objErrs    = {};

    // *****************************************************************************
    // Controller function linking
    // *****************************************************************************

    vm.signUp          = signUp;
    vm.isInvalidSignUp = isInvalidSignUp;

    // *****************************************************************************
    // Controller function definition
    // *****************************************************************************

    function signUp() {
        $rootScope.isProcessing = true;

        if (isInvalidSignUp(false)) {
            $rootScope.isProcessing = false;
            return false;
        }

        // options including profile
        var objOptions = {
            username : vm.objUserNew.strUsername,
            email    : vm.objUserNew.strEmail,
            password : vm.objUserNew.strPassword,
            profile  : {
                gender    : vm.objUserNew.strGender,
                firstName : vm.objUserNew.strFirstName,
                lastName  : vm.objUserNew.strLastName,
            },
        };

        // Create user with user name, email and password.
        return Accounts.createUser(objOptions, function(err) {
            $rootScope.isProcessing = false;

            // handle errors
            if (err && err.reason.indexOf('Username already exists') >= 0) {
                vm.objErrs.strGeneral = 'authentication.error.UsernameAlreadyExists';
                return false;
            }
            if (err && err.reason.indexOf('Email already exists') >= 0) {
                vm.objErrs.strGeneral = 'authentication.error.EmailAlreadyExists';
                return false;
            }

            // reset and redirect
            _resetUser();

            return false;
        });
    }

    // *****************************************************************************

    function isInvalidSignUp(strFieldValue) {

        [ // field validation
            'Username',
            'Email',
            'EmailConfirmation',
            'Password',
            'PasswordConfirmation',
        ].forEach(function(strFieldName) {
            _validateField(strFieldName, strFieldValue);
        });

        [ // field confirmation
            'Email',
            'Password',
        ].forEach(function(strFieldName) {
            _confirmField(strFieldName, strFieldValue);
        });

        console.log(">>> Debug ====================; vm.objErrs:", vm.objErrs, '\n\n');
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
        vm.objUser = {};

        // vm.objUser.strGender               = '';
        // vm.objUser.strFirstName            = '';
        // vm.objUser.strLastName             = '';
        // vm.objUser.strUsername             = '';
        // vm.objUser.strEmail                = '';
        // vm.objUser.strEmailConfirmation    = '';
        // vm.objUser.strPassword             = '';
        // vm.objUser.strPasswordConfirmation = '';
    }

    // *****************************************************************************

    /**
     * Helper function to validate the form fields.
     * 
     * @param {Object} strFieldName   string of the name of the field
     * @param {Object} strFieldValue  string of the value of the field
     */
    function _validateField(strFieldName, strFieldValue) {
        var strFieldNameFirst  = 'str' + strFieldName;
        var strSignUpFieldName = 'signUp' + strFieldName;
        var strTranslation     = 'authentication.error.' + strFieldName + 'Missing';

        if (undefined === strFieldValue || (!vm.objUserNew[strFieldNameFirst] &&
                strSignUpFieldName === strFieldValue)) {
            vm.objErrs[strFieldNameFirst] = strTranslation;
        } else if (vm.objUserNew[strFieldNameFirst] &&
                vm.objErrs[strFieldNameFirst] &&
                strSignUpFieldName === strFieldValue) {
            delete vm.objErrs[strFieldNameFirst];
        }
    }

    // *****************************************************************************

    /**
     * Helper function to confirm the form fields.
     * 
     * @param {Object} strFieldName   string of the name of the field
     * @param {Object} strFieldValue  string of the value of the field
     */
    function _confirmField(strFieldName, strFieldValue) {
        var strFieldNameFirst              = 'str' + strFieldName;
        var strFieldNameConfirmation       = 'str' + strFieldName + 'Confirmation';
        var strSignUpFieldName             = 'signUp' + strFieldName;
        var strSignUpFieldNameConfirmation = 'signUp' + strFieldName + 'Confirmation';
        var strIsFieldNameNotConfirmed     = 'is' + strFieldName + 'NotConfirmed';

        var isFieldSetFirst                = !!vm.objUserNew[strFieldNameFirst];
        var isFieldSetConfirmation         = !!vm.objUserNew[strFieldNameConfirmation];
        var isFieldsEqual                  = vm.objUserNew[strFieldNameFirst] === vm.objUserNew[strFieldNameConfirmation];
        var isFieldsNotEqual               = !isFieldsEqual;
        var isFieldCurrentFirst            = strSignUpFieldName === strFieldValue;
        var isFieldCurrentConfirmed        = strSignUpFieldNameConfirmation === strFieldValue;

        if (!isFieldSetFirst || !isFieldSetConfirmation) {
            return;
        }

        if (isFieldsNotEqual && (
                    isFieldCurrentFirst ||
                    isFieldCurrentConfirmed)) {
            vm.objErrs[strIsFieldNameNotConfirmed] = true;
        } else if (isFieldsEqual && (
                    isFieldCurrentFirst ||
                    isFieldCurrentConfirmed)) {
            vm.objErrs[strIsFieldNameNotConfirmed] = false;
        }
    }

    // *****************************************************************************
}

// *****************************************************************************

})();
