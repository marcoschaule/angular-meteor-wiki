// *****************************************************************************
// Global variables
// *****************************************************************************

SchemaUser = {};

// *****************************************************************************

(function() { 'use strict';

// *****************************************************************************
// Local variables
// *****************************************************************************

var _numMinLengthUsername = 3;
var _numMinLengthPassword = 6;

// *****************************************************************************
// New messages
// *****************************************************************************

SimpleSchema.messages({
    'emailMismatch'           : 'Emails do not match',
    'passwordMismatch'        : 'Passwords do not match',
    'userOrPasswordIncorrect' : 'User or password incorrect',
});

// *****************************************************************************
// Schema definitions
// *****************************************************************************

/**
 * User schema profile definition.
 * 
 * @type {Object}
 */
var schemaUserProfile = {
    'firstName': {
        type          : String,
        optional      : true,
    },
    'lastName': {
        type          : String,
        optional      : true,
    },
    'gender': {
        type          : String,
        allowedValues : ['male', 'female', 'other'],
        optional      : true,
    },
};
SchemaUser.profile = new SimpleSchema(schemaUserProfile);

// *****************************************************************************

/**
 * User schema definition, using user schema profile definition
 * 
 * @type {Object}
 */
var schemaUser = {
    'username': {
        type          : String,
        min           : _numMinLengthUsername,
    },
    'emails': {
        type          : Array,
    },
    'emails.$': {
        type          : Object,
    },
    'emails.$.address': {
        type          : String,
        regEx         : SimpleSchema.RegEx.Email,
    },
    'emails.$.verified': {
        type          : Boolean,
    },
    'createdAt': {
        type          : Date,
    },
    'profile': {
        type          : SchemaUser.profile,
        optional      : true,
    },
    'services': {
        type          : Object,
        optional      : true,
        blackbox      : true,
    },
    'role': {
        type          : String,
        defaultValue  : 'user',
        allowedValues : ['user', 'author', 'admin'],
    }
};
SchemaUser.user = new SimpleSchema(schemaUser);

// *****************************************************************************

var schemaUserSignIn = {
    'strUsername' : schemaUser.username,
    'strPassword' : {
        type      : String,
        min       : _numMinLengthPassword,
    },
};
SchemaUser.signIn = new SimpleSchema(schemaUserSignIn);

// *****************************************************************************

var schemaUserSignUp = {
    'strFirstName'           : schemaUserProfile.firstName,
    'strLastName'            : schemaUserProfile.lastName,
    'strGender'              : schemaUserProfile.gender,
    'strUsername'            : schemaUser.username,
    'strEmail'               : schemaUser['emails.$.address'],
    'strPassword'            : schemaUserSignIn.strPassword,
    'strEmailConfirmation'   : {
        type                 : String,
        custom               : _getMissmatch.call(this, 'strEmail'),
    },
    'strPasswordConfirmation': {
        type                 : String,
        custom               : _getMissmatch.call(this, 'strPassword'),
    },
};
SchemaUser.signUp = new SimpleSchema(schemaUserSignUp);

// *****************************************************************************

var schemaUserResetPassword = {
    'strToken'               : { type: String },
    'strPassword'            : schemaUserSignUp.strPassword,
    'strPasswordConfirmation': schemaUserSignUp.strPasswordConfirmation,
};
SchemaUser.resetPassword = new SimpleSchema(schemaUserResetPassword);

// *****************************************************************************
// Schema attachment
// *****************************************************************************

Meteor.users.attachSchema(SchemaUser.user);

// *****************************************************************************
// Helper functions
// *****************************************************************************

/**
 * Helper function to generate mismatch function.
 *
 * @param  {String}   strFieldName  string of the field name to be compared to
 * @return {function}               function for mismatch for email
 */
function _getMissmatch(strFieldName) {
    return function() {
        if (this.value !== this.field(strFieldName).value) {
            return 'misMatch';
        }
    };
}

// *****************************************************************************

})();
