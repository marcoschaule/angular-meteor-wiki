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

function Service($rootScope, $state, $q, $location) {
    var service = {};

    // *****************************************************************************
    // Private variables
    // *****************************************************************************

    var _deferred = null;

    // *****************************************************************************
    // Service variables
    // *****************************************************************************

    service.flags              = {};
    service.flags.isInit       = false;
    service.flags.isEditActive = false;
    service.flags.isEditFirst  = false;

    // *****************************************************************************
    // Service function linking
    // *****************************************************************************

    service.pageReadAll   = _wrapInit(pageReadAll);
    service.pageRead      = _wrapInit(pageRead);
    service.pageUpdate    = _wrapInit(pageUpdate);
    service.pageDelete    = _wrapInit(pageDelete);
    service.pageReset     = pageReset;
    service.pageCopy      = pageCopy;
    service.pageEditOpen  = pageEditOpen;
    service.pageEditClose = pageEditClose;

    // *****************************************************************************
    // Service function definition
    // *****************************************************************************

    /**
     * Service function to read all pages at once.
     *
     * @param  {Function} [callback]  (optional) function for callback
     * @return {Array}                array of all pages
     */
    function pageReadAll(callback) {
        arrPages = Pages.find();

        if (_.isFunction(callback)) {
            return callback(arrPages);
        }

        return arrPages;        
    }

    // *****************************************************************************

    /**
     * Service function to read a page depending on whether it is a new page,
     * a copied page, an edited page or just a viewed page.
     *
     *
     * @param  {String}   [strPageName]  (optional) string of the current page name
     * @param  {Boolean}  [strPageName]  (optional) true if page is used in edit mode
     * @param  {Function} [callback]     (optional) function for callback
     * @return {Object}                  object of result
     */
    function pageRead() {
        var callback     = arguments[arguments.length - 1] || null;
        var strPageName  = arguments[arguments.length - 2] || $state.params.copyOf || $state.params.page || 'index';
        var isEditActive = !!$state.params.edit || false;
        var strTitle, strContent, objPage, objPageEdit, objPageView, objResult;

        // load the page even if it doesn't exist
        objPage = Pages.findOne({ name: strPageName });

        // flags to determine what happens next
        var isPageCopy     = !!$state.params.copyOf;
        var isUserSignedIn = !!Meteor.userId();
        var isPageExisting = !!objPage;
        var isEditFirst    = false;

        if ('sidebar' === arguments[arguments.length - 2]) {
            isEditActive = false;
            isEditFirst  = false;
            isPageCopy   = false;
        }

        // if ('sidebar' !== strPageName) {
        //     console.log(">>> Debug ====================; isEditActive:", isEditActive);
        //     console.log(">>> Debug ====================; isPageCopy:", isPageCopy);
        //     console.log(">>> Debug ====================; isUserSignedIn:", isUserSignedIn);
        //     console.log(">>> Debug ====================; isPageExisting:", isPageExisting);
        //     console.log(">>> Debug ====================; isEditFirst:", isEditFirst);
        // }

        // If user is singed in and page is copied,
        // use the page to be copied and as a new page.
        // Or:
        // If user is singed in and page is edited,
        // use the existing page for editing and updating.
        if ((isUserSignedIn && isPageCopy) || 
                (isUserSignedIn && isEditActive && isPageExisting)) {

            strTitle = !isPageCopy && 
                    objPage &&
                    objPage.versions &&
                    objPage.versions[0].title || 
                    _.parseTitle($state.params.page);
            strContent = objPage &&
                    objPage.versions &&
                    objPage.versions[0].content ||
                    '';

            objPageEdit = {
                title  : strTitle,
                content: strContent,
                name   : strPageName,
            };

            strPageName  = strPageName;
            isEditActive = true;
            isEditFirst  = isPageCopy;
        }

        // If user is singed in and requested page (copy or edit)
        // does not exist, create a new page to be created.
        else if (isUserSignedIn && !isPageExisting) {
            
            objPageEdit = {
                name   : strPageName,
                title  : _.parseTitle(strPageName),
                content: '',
            };
            isEditActive = true;
            isEditFirst  = true;
        }

        // Otherwise just load the page.
        else {
            
            objPageView = {
                name   : objPage.name,
                title  : objPage &&
                    objPage.versions &&
                    objPage.versions[0].title,
                content: objPage &&
                    objPage.versions &&
                    objPage.versions[0].content,
            };
            isEditActive = false;
        }

        service.flags.isEditActive = isEditActive;
        service.flags.isEditFirst  = isEditFirst;

        // result to be returned
        objResult = {
            objPageView : objPageView,
            objPageEdit : objPageEdit,
            isEditActive: isEditActive,
            isEditFirst : isEditFirst,
        };

        return (_.isFunction(callback) && callback(null, objResult));
    }

    // *****************************************************************************

    /**
     * Service function to update a page.
     * 
     * @param {Boolean} isEditDisabled  true if after updating the "edit" mode is deactivated
     */
    function pageUpdate(objUpdate, isEditDisabled) {
        var strPageName = objUpdate.name || $state.params.page;
        
        if (!objUpdate.name) {
            objUpdate.name = $state.params.page;
        }

        // call defined create or update function
        Meteor.call('pagesCreateOrUpdateOne', { name: strPageName }, objUpdate);

        // change flags
        service.flags.isEditActive = !isEditDisabled;
        service.flags.isEditFirst  = false;

        // broadcast if "sidebar" was updated
        if ('sidebar' === $state.params.page) {
            $rootScope.$emit('amwBroadcastSidebarChanged');
        }

        // if it is another page now, redirect
        if (strPageName !== $state.params.page) {
            $state.go('page', { page: strPageName, edit: !isEditDisabled });
        }
        
        // If "edit" state needs to be canceled, cancel page editing. 
        if (isEditDisabled) {
            return pageEditClose(strPageName);
        }
    }

    // *****************************************************************************

    /**
     * Service function to delete a page (including all versions).
     */
    function pageDelete() {

        // call defined delete method
        Meteor.call('pagesDeleteOne', { name: $state.params.page }, function() {
            $state.go(
                    // state name to go to
                    'page',
                    // query params
                    { page: $state.params.page, edit: true },
                    // options
                    { reload: true });
        });
    }

    // *****************************************************************************

    /**
     * Service function to reset a changed page.
     */
    function pageReset() {
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
     */
    function pageCopy() {
        $state.go(
                // state name to go to
                'page',
                // query params
                { page: $state.params.page + '-copy', copyOf: $state.params.page, edit: true },
                // options
                {});
    }

    // *****************************************************************************
    
    /**
     * Service function to open the page edit mode.
     */
    function pageEditOpen() {
        $state.go(
                // state name to go to
                'page',
                // query params
                { page: $state.params.page, edit: true }, 
                // options
                {});
    }

    // *****************************************************************************
    
    /**
     * Service function to cancel or close page editing. Forces page to reload.
     *
     * @param {String} [strPageName]  (optional) string of page to go to after closing
     */
    function pageEditClose(strPageName) {
        $state.go(
                // state name to go to
                'page',
                // query params
                { page: strPageName || $state.params.page, edit: null, first: null },
                // options
                { reload: true });
    }

    // *****************************************************************************
    // Service helper definitions
    // *****************************************************************************

    /**
     * Helper function to subscribe to the "pages" collection.
     * It returns a promise that can have three states:
     * 
     * 1. new promise just created
     * 2. old promise created at previous call
     * 3. resolved promise with also ends in "isInit" to be true
     * 
     * @return {Promise}  promise to be resolved after subscription
     */
    function _subscribe() {
        if (_deferred && _deferred.promise) {
            return _deferred.promise;
        }
        _deferred = $q.defer();

        Meteor.subscribe('pages', function() {
            service.flags.isInit = true;
            return _deferred.resolve();
        });

        return _deferred.promise;
    }

    /**
     * Helper function to wrap any function accessing the "pages" collection
     * with the subscription to that collection, which will be done only the
     * first time. Every second time any function is called, the service is
     * already initialized and doesn't need a subscription any more. If the
     * same function is called at the same time, so that the subscription
     * could be started multiple times, each function receives the same promise
     * and is finally invoked when the promise is resolved.
     * 
     * @param  {Function} fun  function to actually be called
     * @return {Function}      function that replaces the function actually be called;
     *                         has a callback as argument
     */
    function _wrapInit(fun) {
        return function() {
            var _arguments = arguments;

            // If service is already initialized,
            // call given function immediately.
            if (service.flags.isInit) {
                return fun.apply(fun, _arguments);
            }

            // If service has not been initialized,
            // yet, or if the initialization
            // process is still in progress, call
            // given function after resolving.
            return _subscribe().then(function() {
                return fun.apply(fun, _arguments);
            });
        };
    }

    // *****************************************************************************

    return service;

    // *****************************************************************************
}

// *****************************************************************************

})();
