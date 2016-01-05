/**
 * @name        PageService
 * @author      Marco Schaule <marco.schaule@net-designer.net>
 * @file        This file is an AngularJS 
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
    .factory('PageService', Service);

// *****************************************************************************
// Local variables
// *****************************************************************************

// *****************************************************************************
// Service object
// *****************************************************************************

function Service($rootScope, $state, $timeout, $modal, $q, $location) {
    var service = {};

    // *****************************************************************************
    // Service variables
    // *****************************************************************************

    service.flags = {
        isEditOpened : false,
        isEditFirst  : false,
        isEditActive : false,
        isEditCopy   : false,
    };

    // *****************************************************************************
    // Service function linking
    // *****************************************************************************

    service.pageOpen      = pageOpen;
    service.pageUpdate    = pageUpdate;
    service.pageDelete    = pageDelete;
    service.pageReset     = pageReset;
    service.pageCopy      = pageCopy;
    service.pageEditOpen  = pageEditOpen;
    service.pageEditClose = pageEditClose;

    // *****************************************************************************
    // Service function definition
    // *****************************************************************************

    /**
     * Function to open a specific page.
     * 
     * @param {String} strPageName  string of the page name to be opened
     */
    function pageOpen(strPageName) {
        var strPageNameFinal = strPageName || $state.params.page || 'index';

        $state.go('page', { page: strPageNameFinal }, { reload: true });
    }
    
    // *****************************************************************************

    /**
     * Service function to read all pages at once.
     *
     * @param  {Function} [callback]  (optional) function for callback
     * @return {Array}                array of all pages
     */
    function pageReadAll(callback) {
        var arrPages = Pages.find().fetch();
        return (_.isFunction(callback) && callback(null, arrPages));
    }

    // *****************************************************************************

    /**
     * Service function to update a page.
     * 
     * @param {Object}  objUpdate       object of the page to be updated
     * @param {Boolean} isEditDisabled  true if after updating the "edit" mode is deactivated
     */
    function pageUpdate(objUpdate, isEditDisabled) {
        var strPageName = objUpdate.name || $state.params.page;
        
        if (!objUpdate.name) {
            objUpdate.name = $state.params.page;
        }

        // call defined create or update function
        Meteor.call('pagesCreateOrUpdateOne', { name: strPageName }, objUpdate);

        // after update the page does exist and is not edited for the first time anymore
        service.flags.isEditFirst = false;

        // broadcast if "sidebar" was updated
        if ('sidebar' === $state.params.page) {
            $rootScope.$emit('amwBroadcastSidebarChanged');
        }

        // if it is another page now, redirect
        if (strPageName !== $state.params.page || !!$state.params.copyOf) {
            $state.go('page', { page: strPageName, edit: !isEditDisabled, copyOf: null }, { reload: true });
        }

        // If "edit" state needs to be canceled, cancel page editing. 
        if (isEditDisabled) {
            return pageEditClose(strPageName);
        }
    }

    // *****************************************************************************

    /**
     * Service function to delete a page (including all versions).
     * 
     * @param {String}   [strPageName]  (optional) string of the name of the page to be deleted
     * @param {Boolean}  [isStateKept]  (optional) true if state is not changed
     * @param {Function} [callback]     (optional) function for callback
     */
    function pageDelete(strPageName, isStateKept, callback) {
        var strPageNameFinal = strPageName || $state.params.page;

        // confirm and call defined delete method
        _confirmDeletePage(function() {
            Meteor.call('pagesDeleteOne', { name: strPageNameFinal }, function() {
                if (!isStateKept) {
                    $state.go(
                            // state name to go to
                            'page',
                            // query params
                            { page: strPageNameFinal, edit: true },
                            // options
                            { reload: true });
                }

                return (_.isFunction(callback) && callback(null));
            });
        });
    }

    // *****************************************************************************

    /**
     * Service function to reset a changed page.
     * 
     * @param {String} strPageName  string of the name of the page to be reset
     */
    function pageReset(strPageName) {
        var strPageNameFinal = strPageName || $state.params.page;
        
        $state.go(
                // state name to go to
                'page',
                // query params
                { page: $state.params.page, edit: $state.params.page },
                // options
                { reload: true });
    }

    // *****************************************************************************

    /**
     * Service function to copy a page to a new page.
     *
     * @param {String} strPageName  string of the name of the page to be copied
     */
    function pageCopy(strPageName) {
        var strCopyPostfix   = '-copy';
        var strPageNameFinal = strPageName || $state.params.page;
        var strPageNameCopy  = strPageNameFinal + strCopyPostfix;
        var isEditCopy       = !!$state.params.copyOf;
        var strRegex, regexCopyPostFix, arrMatches, numCopy;

        if (isEditCopy && strPageNameFinal.indexOf(strCopyPostfix) >= 0) {
            strRegex         = strCopyPostfix + '-([0-9]*)$';
            regexCopyPostFix = new RegExp(strRegex, 'g');
            arrMatches       = regexCopyPostFix.exec(strPageNameFinal);
            numCopy          = arrMatches && parseInt(arrMatches[1]) || 1;
            strPageNameCopy  = $state.params.copyOf + strCopyPostfix + '-' + (numCopy += 1);
            strPageNameFinal = $state.params.copyOf;
        }

        $state.go(
                // state name to go to
                'page',
                // query params
                { page: strPageNameCopy, copyOf: strPageNameFinal, edit: true },
                // options
                { reload: true });
    }

    // *****************************************************************************
    
    /**
     * Service function to open the page edit mode.
     * 
     * @param {String} strPageName  string of the name of the page to be edited
     */
    function pageEditOpen(strPageName) {
        var strPageNameFinal       = strPageName || $state.params.page;
        service.flags.isEditActive = true;
        service.flags.isEditOpened = true;

        $state.go(
                // state name to go to
                'page',
                // query params
                { page: strPageNameFinal, edit: true }, 
                // options
                { reload: true });
    }

    // *****************************************************************************
    
    /**
     * Service function to cancel or close page editing. Forces page to reload.
     *
     * @param {String} [strPageName]  (optional) string of page to go to after closing
     */
    function pageEditClose(strPageName) {
        var strPageNameFinal = strPageName || $state.params.copyOf || $state.params.page;
        $state.go(
                // state name to go to
                'page',
                // query params
                { page: strPageNameFinal, edit: null, copyOf: null },
                // options
                { reload: true });
    }

    // *****************************************************************************
    // Service helper definitions
    // *****************************************************************************

    /**
     * Helper function to confirm deletion by modal.
     * 
     * @param {Function} callback  function for callback
     */
    function _confirmDeletePage(callback) {
        var objModalInst = $modal.open({
            animation  : true,
            templateUrl: 'page-modal-delete.template.html',
            controller : 'AmwPageModalDeleteCtrl as vm',
        });

        return objModalInst.result.then(function() {
            return callback();
        }, function() {
            return;
        });
    }

    // *****************************************************************************

    /**
     * Helper function to initialize this service.
     * This function is immediately invoked.
     */
    function _init() {
    } _init();

    // *****************************************************************************

    return service;

    // *****************************************************************************
}

// *****************************************************************************

})();
