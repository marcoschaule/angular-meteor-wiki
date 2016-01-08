(function() { 'use strict';
/*jshint validthis:true */

// ********************************************************************************
// Publish function linking
// ********************************************************************************

// Publish function linking
Meteor.publish('userData', publishUserData);

// ********************************************************************************
// Publish function definitions
// ********************************************************************************

/**
 * Publish function to publish special user data.
 * 
 * @return {Object}  object object of user data
 */
function publishUserData() {
    if (this.userId) {
        return Meteor.users.find({ _id: this.userId }, { fields: {
            _id: 1, role: 1, profile: 1, emails: 1, username: 1,
        } });
    }

    return this.ready();
}

// ********************************************************************************

})();
