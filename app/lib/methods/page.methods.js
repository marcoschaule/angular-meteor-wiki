Meteor.methods({

// ********************************************************************************
// Page methods
// ********************************************************************************

/**
 * Method to read one page by find object.
 * 
 * @param  {Object} objFind  object to find page, like "{ _id: id }" etc.
 * @return {Object}          object of result
 */
pagesReadOne: function(objFind) {
    var objPage = Pages.findOne(objFind);
    return objPage;
},

// ********************************************************************************

/**
 * Method to create or update a given page.
 * 
 * @param  {Object} objFind    object to find a page
 * @param  {Object} objUpdate  object to the found page
 * @return {Object}            object of write result like "{ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 }"
 */
pagesCreateOrUpdateOne: function(objFind, objUpdate) {
    var currentDate = new Date();
    var currentUser = { _id: Meteor.userId(), username: Meteor.user().username };

    if (!Meteor.userId()) {
        return _.isFunction(callback) && callback('User not singed in!');
    }

    var objUpdateElement = {
        updatedBy    : currentUser,
        updatedAt    : currentDate,
        title        : objUpdate.title,
        content      : objUpdate.content,
        parser       : objUpdate.parser || 'markdown',
    };
    var objUpdateFull = {
        $setOnInsert: {
            createdBy  : currentUser,
            createdAt  : currentDate,
        },
        $set: {
            name       : objUpdate.name,
            isPrivate  : !!objUpdate.isPrivate,
            isPublished: !!objUpdate.isPublished,
        },
        $push: {
            versions: {
                $each    : [ objUpdateElement ],
                $position: 0,
            },
        },
    };
    return Pages.update(objFind, objUpdateFull, { upsert: true });
},

// ********************************************************************************

/**
 * Method to create one page by create object.
 * 
 * @param  {Object} objCreate  object to create a page
 * @return {Object}            object of write result like "{ "nInserted" : 1 }"
 */
pagesCreateOne: function(objCreate) {
    if (!Meteor.userId()) {
        return _.isFunction(callback) && callback('User not singed in!');
    }
    
    if (objCreate._id) {
        delete objCreate._id;
    }

    var objCreateFull = {
        createdBy : Meteor.userId(),
        createdAt : new Date(),
        name      : objCreate.name,
        versions  : [{
            changedBy : Meteor.userId(),
            changedAt : new Date(),
            title     : objCreate.title,
            content   : objCreate.content,
            parser    : objCreate.parser || 'markdown',
        }],
        isPublished      : !!objCreate.isPublished,
        isPrivate        : !!objCreate.isPrivate,
    };
    return Pages.insert(objCreateFull);
},

// ********************************************************************************

/**
 * Method to update one page by find and update object.
 * 
 * @param  {Object} objFind    object to find a page
 * @param  {Object} objUpdate  object to the found page
 * @return {Object}            object of write result like "{ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 }"
 */
pagesUpdateOne: function(objFind, objUpdate) {
    if (!Meteor.userId()) {
        return _.isFunction(callback) && callback('User not singed in!');
    }
    
    var objUpdateElement = {
        changedBy    : Meteor.userId(),
        changedAt    : new Date(),
        title        : objUpdate.title,
        content      : objUpdate.content,
        parser       : objUpdate.parser || 'markdown',
    };
    var objUpdateFull = {
        $set: {
            isPrivate  : !!objUpdate.isPrivate,
            isPublished: !!objUpdate.isPublished,
        },
        $push: {
            versions: {
                $each    : [ objUpdateElement ],
                $position: 0,
            },
        },
    };
    return Pages.update(objFind, objUpdateFull);
},

// ********************************************************************************

/**
 * Method to delete one page by find object. Since there should only be one
 * page per name, it deletes all pages with the same name.
 * 
 * @param  {Object} objFind  object to find a page
 * @return {Object}          object of write result like "{ nRemoved: 4 }"
 */
pagesDeleteOne: function(objFind, callback) {
    if (!Meteor.userId()) {
        return _.isFunction(callback) && callback('User not singed in!');
    }

    return Pages.remove(objFind, callback);
},

// ********************************************************************************

/**
 * [pagesTogglePrivateOne description]
 */
/**
 * Method to delete one page by find object.
 * 
 * @param  {Object}  objFind    object to find a page
 * @param  {Boolean} isPrivate  boolean of private state; true if private
 * @return {Object}             object of write result like "{ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 }"
 */
pagesTogglePrivateOne: function(objFind, isPrivate) {
    if (!Meteor.userId()) {
        return _.isFunction(callback) && callback('User not singed in!');
    }

    return Pages.update(objFind, { $set: { isPrivate: !!isPrivate } });
},

// ********************************************************************************

/**
 * Method to reset one page version.
 * 
 * @param  {Object} objFind   object to find a page
 * @param  {Object} numIndex  number of which version to reset
 * @return {Object}           object of write result like "{ nRemoved: 4 }"
 */
pagesResetOneVersion: function(objFind, numIndex, callback) {
    if (!Meteor.userId()) {
        return _.isFunction(callback) && callback('User not singed in!');
    }

    var objPage         = Pages.findOne(objFind);
    var objVersionReset = objPage.versions[numIndex];

    objVersionReset.updatedBy = { _id: Meteor.userId(), username: Meteor.user().username };
    objVersionReset.updatedAt = new Date();

    Pages.update(objFind, { $push: { versions: { $each: [ objVersionReset ], $position: 0 } } });

    return (_.isFunction(callback) && callback(null));
},

// ********************************************************************************

/**
 * Method to delete one page version.
 * 
 * @param  {Object} objFind   object to find a page
 * @param  {Object} numIndex  number of which version to reset
 * @return {Object}           object of write result like "{ nRemoved: 4 }"
 */
pagesDeleteOneVersion: function(objFind, numIndex, callback) {
    if (!Meteor.userId()) {
        return _.isFunction(callback) && callback('User not singed in!');
    }

    var objPage        = Pages.findOne(objFind);
    var arrVersionsNew = objPage.versions;
    arrVersionsNew.splice(numIndex, 1);

    Pages.update(objFind, { $set: { versions: arrVersionsNew } });

    return (_.isFunction(callback) && callback(null));
}

// ********************************************************************************

});