(function() { 'use strict';

// ********************************************************************************
// Methods linking
// ********************************************************************************

Meteor.methods({
    usersReadUsernames: usersReadUsernames,
});

// *****************************************************************************
// Methods definition
// *****************************************************************************

/**
 * Function to get all user names (not natural names)
 * based on an array of user ids.
 * 
 * @param  {Array} arrUserIds  array of user ids
 * @return {Array}             array of user names
 */
function usersReadUsernames(arrUserIds) {
    return Meteor.users.find({ _id: { $in: arrUserIds } }, { _id: 1, username: 1 }).fetch();
}

// ********************************************************************************

})();
