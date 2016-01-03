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

function Service($rootScope, $state, $q, $location, $timeout) {
    var service = {};

    // *****************************************************************************
    // Private variables
    // *****************************************************************************

    var _deferred = null;

    // *****************************************************************************
    // Service variables
    // *****************************************************************************

    service.isInit = false;

    // *****************************************************************************
    // Service function linking
    // *****************************************************************************

    service.pageRead      = _wrapInit(pageRead);
    service.pageUpdate    = _wrapInit(pageUpdate);
    service.pageDelete    = _wrapInit(pageDelete);
    service.pageEditOpen  = _wrapInit(pageEditOpen);
    service.pageEditClose = _wrapInit(pageEditClose);

    // *****************************************************************************
    // Service function definition
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

        if ('sidebar' === arguments[arguments.length - 2]) {
            isEditActive = false;
            isEditFirst  = false;
        }

        // load the page even if it doesn't exist
        objPage = Pages.findOne({ name: strPageName });

        // flags to determine what happens next
        var isPageCopy     = !!$state.params.copyOf;
        var isUserSignedIn = !!Meteor.userId();
        var isPageExisting = !!objPage;
        var isEditFirst    = false;

        // If user is singed in and page is copied,
        // use the page to be copied and as a new page.
        // Or:
        // If user is singed in and page is edited,
        // use the existing page for editing and updating.
        if ((isUserSignedIn && isPageCopy) || 
                (isUserSignedIn && isEditActive)) {

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
            isEditFirst  = isPageCopy;
            isEditActive = true;
        }

        // If user is singed in and requested page (copy or edit)
        // does not exist, create a new page to be created.
        else if (isUserSignedIn && !isPageExisting) {

            // set "edit" query param since it is edit mode
            // $location.path('/' + strPageName).search({ edit: 'true' });

            objPageEdit = {
                name   : strPageName,
                title  : _.parseTitle(strPageName),
                content: '',
            };
            isEditFirst  = true;
            isEditActive = true;
        }

        // Otherwise just load the page.
        else {

            // replace every query param since it is only view mode
            // $location.path('/' + strPageName).search({});

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

        objResult = {
            objPageView : objPageView,
            objPageEdit : objPageEdit,
            isEditActive: isEditActive,
            isEditFirst : isEditFirst,
        };

        return $timeout(function() {
            return ('function' === typeof callback && callback(null, objResult));
        });
    }

    // *****************************************************************************

    function pageUpdate() {}
    function pageDelete() {}
    function pageEditOpen() {}
    function pageEditClose() {}

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
            service.isInit = true;
            return _deferred.resolve();
        });

        return _deferred.promise;
    }

    /**
     * Helper function to wrap any function accessing the "pages" collection
     * with the subscription to that collection, which will be done only the
     * first time. Every second time any function is called, the service is
     * already initialized and doesn't need a subscription any more.
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
            if (service.isInit) {
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
