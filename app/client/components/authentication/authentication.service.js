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
// Service module
// *****************************************************************************

angular
    .module('amw-services')
    .factory('AuthService', Service);

// *****************************************************************************
// Service definition function
// *****************************************************************************

function Service($rootScope) {
    var service = {};

    // *****************************************************************************
    // Private variables
    // *****************************************************************************

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    service.objUser    = {};
    service.objUserNew = {};
    service.objErrs    = {};
    service.isSignedIn = false;

    // *****************************************************************************
    // Service function linking
    // *****************************************************************************

    service.signUp          = signUp;
    service.signUpResetUser = signUpResetUser;
    service.isSignedIn      = isSignedIn;
    service.isSignUpValid   = isSignUpValid;

    // *****************************************************************************
    // Service function definition
    // *****************************************************************************

    /**
     * Service function to sign up a user.
     * 
     * @param  {Function} callback          function for callback
     * @param  {Function} callback.objErrs  object of error send to callback
     */
    function signUp(callback) {
        if (isInvalidSignUp('all')) {
            return ('function' === typeof callback && callback(service.objErrs));
        }

        var objOptions = _signUpGetOptions();

        return Accounts.createUser(objOptions, function(err, objUser) {

            // handle errors
            if (err && err.reason.indexOf('Username already exists') >= 0) {
                service.objErrs.strGeneral = 'authentication.error.UsernameAlreadyExists';
                return ('function' === typeof callback && callback(err));
            }
            if (err && err.reason.indexOf('Email already exists') >= 0) {
                service.objErrs.strGeneral = 'authentication.error.EmailAlreadyExists';
                return ('function' === typeof callback && callback(err));
            }

            // reset user
            _signUpResetUser();

            // set "isSignedIn" to true and set local user
            service.isSignedIn = true;
            service.objUser    = objUser;

            return ('function' === typeof callback && callback(null));
        });
    }

    // *****************************************************************************

    /**
     * Service function to test whether a user is signed in or not.
     */
    function isSignedIn() {
        return !!service.objUser.strUsername;
    }

    // *****************************************************************************

    /**
     * Service function to test whether the sign up form is filled out
     * correctly or not. To do so, you can test either each field separately
     * by it's name or use "all" to test all fields.
     * 
     * @param  {String}  [strFieldName]  (optional) string of either field name or "all"
     * @return {Boolean}                 true if sign up is valid
     */
    function isSignUpValid(strFieldName) {
        var objErrs = {};
        var isFieldNotEmpty;
        var isFieldConfirmed;
        var arrFieldNamesMissing;
        var arrFieldNamesConfirmation;

        // define field(s)
        arrFieldNamesMissing = strFieldName && [strFieldName] || [
            'Username',
            'Email',
            'EmailConfirmation',
            'Password',
            'PasswordConfirmation',
        ];
        arrFieldNamesConfirmation = [
            'Email',
            'Password',
        ];
        arrFieldNamesConfirmation = 'all' !== strFieldName && 
                arrFieldNamesConfirmation.indexOf(strFieldName) >= 0 &&
                [strFieldName] || arrFieldNamesConfirmation;

        // test field(s)
        arrFieldNamesMissing.forEach(function(strFieldName) {
            isFieldNotEmpty = !!service.objUserNew['str' + strFieldName];
            if (!isFieldNotEmpty) {
                objErrs['is' + strFieldName + 'Missing'] = true;
            }
        });
        arrFieldNamesConfirmation.forEach(function(strFieldName) {
            isFieldConfirmed = 
                    !!service.objUserNew['str' + strFieldName] &&
                    !!service.objUserNew['str' + strFieldName + 'Confirmation'] &&
                    service.objUserNew['str' + strFieldName] === 
                    service.objUserNew['str' + strFieldName + 'Confirmation'];
            if (!isFieldConfirmed) {
                objErrs['is' + strFieldName + 'NotConfirmed'] = true;
            }
        });

        if (Object.keys(objErrs).length > 0) {
            return objErrs;
        }
        return false;
    }

    // *****************************************************************************
    // Service helper definitions
    // *****************************************************************************

    /**
     * Helper function to get the user object as options needed by Meteor's
     * sign up function.
     * 
     * @return {Object}  object of options for Meteor's sign up
     */
    function _signUpGetOptions() {
        var objOptions = {
            username : service.objUserNew.strUsername,
            email    : service.objUserNew.strEmail,
            password : service.objUserNew.strPassword,
            profile  : {
                gender    : service.objUserNew.strGender,
                firstName : service.objUserNew.strFirstName,
                lastName  : service.objUserNew.strLastName,
            },
        };

        return objOptions;
    }

    // *****************************************************************************

    /**
     * Helper function to reset the signing up user.
     */
    function _signUpResetUser() {
        service.objUserNew = {};
    }

    // *****************************************************************************

    /**
     * Helper function to validate the form fields.
     * 
     * @param {Object} strFieldName   string of the name of the field
     * @param {Object} strFieldValue  string of the value of the field
     */
    function _signUpIsFieldNotEmpty(strFieldName, strFieldValue) {
        var strFieldNameInModel = 'str' + strFieldName;
        var strSignUpFieldName  = 'signUp' + strFieldName;
        var strTranslation      = 'authentication.error.' + strFieldName + 'Missing';

        return !!service.objUserNew[strFieldNameInModel];
    }

    // *****************************************************************************

    /**
     * Helper function to confirm the form fields.
     * 
     * @param {Object} strFieldName   string of the name of the field
     * @param {Object} strFieldValue  string of the value of the field
     */
    function _signUpIsFieldConfirmed(strFieldName, strFieldValue) {
        var strFieldNameFirst              = 'str' + strFieldName;
        var strFieldNameConfirmation       = 'str' + strFieldName + 'Confirmation';
        var strSignUpFieldName             = 'signUp' + strFieldName;
        var strSignUpFieldNameConfirmation = 'signUp' + strFieldName + 'Confirmation';
        var strIsFieldNameNotConfirmed     = 'is' + strFieldName + 'NotConfirmed';

        var isFieldSetFirst                = !!service.objUserNew[strFieldNameFirst];
        var isFieldSetConfirmation         = !!service.objUserNew[strFieldNameConfirmation];
        var isFieldsEqual                  = service.objUserNew[strFieldNameFirst] === service.objUserNew[strFieldNameConfirmation];
        var isFieldsNotEqual               = !isFieldsEqual;
        var isFieldCurrentFirst            = strSignUpFieldName === strFieldValue;
        var isFieldCurrentConfirmed        = strSignUpFieldNameConfirmation === strFieldValue;



        // if all fields are tested and error is set, delete it
        if (service.objErrs[strIsFieldNameNotConfirmed]) {
            delete service.objErrs[strIsFieldNameNotConfirmed];
        }

        // if neither first field nor confirmation field is set, return
        else if (!isFieldSetFirst || !isFieldSetConfirmation) {
            return;
        }

        // if field is not confirmed, add error
        else if (isFieldsNotEqual && (
                    isFieldCurrentFirst ||
                    isFieldCurrentConfirmed)) {
            service.objErrs[strIsFieldNameNotConfirmed] = true;
        } 

        // if field is confirmed, remove error
        else if (isFieldsEqual && (
                    isFieldCurrentFirst ||
                    isFieldCurrentConfirmed) &&
                    service.objErrs[strIsFieldNameNotConfirmed]) {
            delete service.objErrs[strIsFieldNameNotConfirmed];
        }
    }

    // *****************************************************************************

    return service;

    // *****************************************************************************
}

// *****************************************************************************

})();
