(function() { 'use strict';

// ********************************************************************************
// Methods linking
// ********************************************************************************

Meteor.methods({
    usersReadUsernames      : usersReadUsernames,
    usersAddEmail           : usersAddEmail,
    usersSetPrimaryEmail    : usersSetPrimaryEmail,
    usersIsUsernameAvailable: usersIsUsernameAvailable,
    usersIsEmailAvailable   : usersIsEmailAvailable,
});

// *****************************************************************************
// Methods definition
// *****************************************************************************

/**
 * Method to get all user names (not natural names)
 * based on an array of user ids.
 * 
 * @param  {Array} arrUserIds  array of user ids
 * @return {Array}             array of user names
 */
function usersReadUsernames(arrUserIds) {
    return Meteor.users.find({ _id: { $in: arrUserIds } }, 
            { _id: 1, username: 1 }).fetch();
}

// ********************************************************************************

/**
 * Method to add an email to a user.
 * 
 * @param  {String}   strEmail  string of email to be added
 * @param  {Function} callback  function for callback
 */
function usersAddEmail(strEmail, callback) {
    if (Meteor.isServer) {
        return Accounts.addEmail(Meteor.userId(), strEmail);
    }
}

// ********************************************************************************

/**
 * Method to set primary user email.
 * 
 * @param {String}   strEmail  string of email to be set to primary
 * @param {Function} callback  function for callback
 */
function usersSetPrimaryEmail(strEmail, callback) {
    return Meteor.users.update({ _id: Meteor.userId() },
            { $set: { 'profile.primaryEmail': strEmail } },
            ('function' === typeof callback && callback));
}

// ********************************************************************************

/**
 * Method to test if a username is available.
 * 
 * @param {String}   strUsername  string of username
 * @param {Function} callback     function for callback
 */
function usersIsUsernameAvailable(strUsername, callback) {
    var isUsernameAvailable = Meteor.users.find({ username: strUsername }).fetch().length <= 0;
    return ('function' === typeof callback && callback(null, isUsernameAvailable));
}

// ********************************************************************************

/**
 * Method to test if a email is available.
 * 
 * @param {String}   strEmail  string of email
 * @param {Function} callback  function for callback
 */
function usersIsEmailAvailable(strEmail, callback) {
    var arrEmails = Meteor.users.find({ emails: { $elemMatch: { address: strEmail } } }).fetch();
    var isEmailAvailable = arrEmails.length;
    return isEmailAvailable;
}

// ********************************************************************************

})();
