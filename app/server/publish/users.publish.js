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
        return Meteor.users.find({ _id: this.userId }, { fields: { 'role': 1 } });
    }

    return this.ready();
}

// ********************************************************************************

})();
