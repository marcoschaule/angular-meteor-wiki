/**
 * @name        AuthService
 * @author      Marco Schaule <marco.schaule@net-designer.net>
 * @file        This file is an AngularJS service.
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
// Local variables
// *****************************************************************************

var service = {};

// *****************************************************************************
// Service object
// *****************************************************************************

function Service($rootScope, $state) {

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    var objFieldsKeysAndMessages = {
        
        // fields, keys and messages for sign in
        'signIn': [{
            'message': 'User not found',
            'key'    : 'userOrPasswordIncorrect',
            'field'  : 'general',
        }, {
            'message': 'Incorrect password',
            'key'    : 'userOrPasswordIncorrect',
            'field'  : 'general',
        }],

        // fields, keys and messages for sign up
        'signUp': [{
            'message': 'Username already exists',
            'key'    : 'alreadyExists',
            'field'  : 'strUsername',
        }, {
            'message': 'Email already exists',
            'key'    : 'alreadyExists',
            'field'  : 'strEmail',
        }],

        // fields, keys and messages for forgotten password
        'forgotPassword': [],

        // fields, keys and messages for password reset
        'resetPassword': [],
    };

    // *****************************************************************************
    // Service function linking
    // *****************************************************************************

    service.signIn         = signIn;
    service.signUp         = signUp;
    service.signOut        = signOut;
    service.forgotPassword = forgotPassword;
    service.resetPassword  = resetPassword;
    service.isSignedIn     = isSignedIn;
    service.getErrs        = getErrs;

    // *****************************************************************************
    // Service function definition
    // *****************************************************************************

    /**
     * Service function to sign in a user.
     *
     * @param  {Object}   objUser           object of user data like user name
     *                                      or email and password
     * @param  {Function} callback          function for callback
     * @param  {Function} callback.objErrs  object of error send to callback
     */
    function signIn(objUser, callback) {
        var objErrs = getErrs(objUser, 'all', 'signIn');
        if (objErrs) {
            return ('function' === typeof callback && callback(objErrs));
        }

        return Meteor.loginWithPassword(objUser.strUsername, objUser.strPassword,
                function(objErr) {

            // handle errors
            objErrs = objErr && objErr.reason && getErrs(objErr.reason,
                    'server', 'signUp');
            return ('function' === typeof callback && callback(objErrs));
        });
    }

    // *****************************************************************************

    /**
     * Service function to sign up a user.
     * 
     * @param  {Object}   objUserNew        object of the new user (flat)
     * @param  {Function} callback          function for callback
     * @param  {Function} callback.objErrs  object of error send to callback
     */
    function signUp(objUserNew, callback) {
        var objOptions = _getOptions(objUserNew, 'signUp');
        var objErrs    = getErrs(objUserNew, 'all', 'signUp');
        if (objErrs) {
            return ('function' === typeof callback && callback(objErrs));
        }

        // send email verification mail to given email

        return Accounts.createUser(objOptions, function(objErr) {

            // handle errors
            objErrs = objErr && objErr.reason && getErrs(objErr.reason,
                    'server', 'signUp');
            return ('function' === typeof callback && callback(objErrs));
        });
    }

    // *****************************************************************************

    /**
     * Service function to simply sign out.
     *
     * @param {Function} callback  function for callback if necessary
     */
    function signOut(callback) {
        Meteor.logout(function(err) {
            $state.go('home');
            return ('function' === typeof callback && callback());
        });
    }

    // *****************************************************************************

    /**
     * Service function to inform server about forgotten password and to generate
     * a token to reset the password in the next step.
     * 
     * @param  {String}   strEmail  string of email the new password should be send to
     * @param  {Function} callback  function for callback
     */
    function forgotPassword(strEmail, callback) {
        var objData    = { strEmail: strEmail };
        var objErrs    = getErrs(objData, 'all', 'forgotPassword');
        if (objErrs) {
            return ('function' === typeof callback && callback(objErrs));
        }

        // send a "reset password" email to user
        return Accounts.forgotPassword({ email: strEmail }, function(objErrs) {
            return ('function' === typeof callback && callback(objErrs));
        });
    }

    // *****************************************************************************

    /**
     * Service function to reset a password.
     * 
     * @param  {Object}   objData   object of data including password and token
     * @param  {Function} callback  function for callback
     */
    function resetPassword(objData, callback) {
        var objErrs = getErrs(objData, 'all', 'resetPassword');
        if (objErrs) {
            return ('function' === typeof callback && callback(objErrs));
        }

        // send a "reset password" email to user
        return Accounts.resetPassword(
                objData.strToken, 
                objData.strPassword,
                function(objErr) {

            // handle errors
            objErrs = objErr && objErr.reason && getErrs(objErr.reason,
                    'server', 'resetPassword');
            return ('function' === typeof callback && callback(objErrs));
        });
    }

    // *****************************************************************************

    /**
     * Service function to test whether a user is signed in or not.
     */
    function isSignedIn() {
        return !!Meteor.userId();
    }

    // *****************************************************************************

    /**
     * Service function to get the errors of submitted data.
     * 
     * Either an object is submitted with no field name or "all" as field name,
     * then the whole schema is used to validate the data. Or only one field is
     * submitted as a string to be tested. Also, an generated Meteor error is
     * handled in case of an response from server.
     *
     * In any case, the response is an object of errors, with keys as the field
     * names.
     *
     * @param  {Mixed}  mixUserFieldValues      object of the fields to be validated / 
     *                                          string of the name of the field to be validated
     * @param  {String} [strFieldName]          string of field name (optional) /
     *                                          string "all" for all fields
     * @param  {String} [strWhich]              string of which case the errors are to
     *                                          be taked care of ("signIn", "signOut",
     *                                          "forgotPassword" or "resetPassword") (optional)
     * @return {Boolean}                        true if sign up is valid
     */
    function getErrs(mixUserFieldValues, strFieldName, strWhich) {
        var objContext             = SchemaUser[strWhich].newContext();
        var isInvalid              = false;
        var objTemp                = {};
        var objErrs                = {};
        var arrErrs                = [];
        var arrFieldsMessageAndKey = [];
        var i;

        if (objFieldsKeysAndMessages[strWhich]) {
            arrFieldsMessageAndKey = objFieldsKeysAndMessages[strWhich];
        }

        // If a field is tested, that needs to be confirmed by another field,
        // validate this one field (like "strEmailConfirmation") and send the
        // source field to be compared (like "strEmail") along as extended
        // custom context.
        if (_.isObject(mixUserFieldValues) && 'confirmation' === strFieldName) {
            var objTempCustomContext = {};

            // Define the field to be compared (like "strEmail") for the
            // extended custom context. This field is just send for the matter
            // of comparison.
            objTempCustomContext[mixUserFieldValues.strKey] = 
                    mixUserFieldValues.strField;

            // Define the field to be tested (like "strEmailComfirmation") for
            // the extended custom context. Since it needs to be confirmed be
            // the source field, it is send wich that along.
            objTemp[mixUserFieldValues.strKeyConfirmation] = 
                    mixUserFieldValues.strFieldConfirmation;

            // Validate one field. Also, the extended custom context is added
            // as third parameter.
            isInvalid = !objContext.validateOne(
                    objTemp,
                    mixUserFieldValues.strKeyConfirmation,
                    { extendedCustomContext: objTempCustomContext });
                    
        }

        // test all fields of given object
        else if (_.isObject(mixUserFieldValues) &&
                (!strFieldName || 'all' === strFieldName)) {
            isInvalid = !objContext.validate(mixUserFieldValues);
        } 

        // respond to Meteor error
        else if (_.isString(mixUserFieldValues) && 'server' === strFieldName) {
            for (i = 0; i < arrFieldsMessageAndKey.length; i += 1) {
                if (mixUserFieldValues.indexOf(arrFieldsMessageAndKey[i].message) >= 0) {
                    objErrs[arrFieldsMessageAndKey[i].field] = arrFieldsMessageAndKey[i].key;
                    isInvalid = 'true';
                    break;
                }
            }
        }

        // test one field given as a string
        else if (strFieldName) {
            objTemp[strFieldName] = mixUserFieldValues;
            isInvalid = !objContext.validateOne(objTemp, strFieldName);
        }

        // if field was tested, and no server response handled
        if (true === isInvalid) {
            arrErrs = objContext.invalidKeys();
            for (i = 0; i < arrErrs.length; i += 1) {
                objErrs[arrErrs[i].name] = arrErrs[i].type;
            }
        }

        // if any error occurred
        if (isInvalid) {
            return objErrs;
        }

        // if no error occurred
        return false;
    }

    // *****************************************************************************
    // Service helper definitions
    // *****************************************************************************

    /**
     * Helper function to get the user object as options needed by Meteor's
     * sign up function.
     *
     * @param  {Object} objUserNew  object of the new user to be created
     * @return {Object}             object of options for Meteor's sign up
     */
    function _getOptions(objUserNew) {
        var objOptions = {
            username : objUserNew.strUsername,
            email    : objUserNew.strEmail,
            emailConfirmation    : objUserNew.strEmailConfirmation,
            password : objUserNew.strPassword,
            passwordConfirmation : objUserNew.strPasswordConfirmation,
            profile  : {
                gender    : objUserNew.strGender,
                firstName : objUserNew.strFirstName,
                lastName  : objUserNew.strLastName,
            },
        };

        return objOptions;
    }

    // *****************************************************************************

    // *****************************************************************************

    return service;

    // *****************************************************************************
}

// *****************************************************************************

})();
