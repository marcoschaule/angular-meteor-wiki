(function() { 'use strict';

// ********************************************************************************
// Methods linking
// ********************************************************************************

Meteor.methods({
    usersReadUsernames : usersReadUsernames,
    isUsernameAvailable: isUsernameAvailable,
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
    return Meteor.users.find({ _id: { $in: arrUserIds } }, { _id: 1, username: 1 }).fetch();
}

// ********************************************************************************

/**
 * Method to set primary user email.
 * 
 * @param {String}   strEmail  string of email to be set to primary
 * @param {Function} callback  function for callback
 */
function usersSetPrimaryEmail(strEmail, callback) {
    return Meteor.users.udpate({ _id: Meteor.userId() }, { $set: { 'profile.primaryEmail': strEmail } }, callback);
}

// ********************************************************************************

/**
 * Method to test if a username is available.
 * 
 * @param  {String}   strUsername  string of username
 * @param  {Function} callback     function for callback
 */
function isUsernameAvailable(strUsername, callback) {
    var _isUsernameAvailable = !!Meteor.users.find({ username: strUsername });

    return _.isFunction(callback) && callback(null, _isUsernameAvailable);
}

// ********************************************************************************

})();
