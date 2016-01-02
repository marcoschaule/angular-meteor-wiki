/**
 * @name        PageService
 * @author      Marco Schaule <marco.schaule@net-designer.net>
 * @file        This file is an AngularJS service.
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

function Service($rootScope, $state, $timeout) {
    var service = {};

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    service.strPageName  = $state.params.page || 'index';
    service.objPage      = null;
    service.objPageView  = null;
    service.objPageEdit  = null;
    service.isEditActive = !!$state.params.edit;
    service.isEditFirst  = false;
    service.isInit       = false;

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
     */
    function pageRead(argStrPageName, callback) {
        var strPageName = argStrPageName || $state.params.copyOf || service.strPageName;
        var strTitle, strContent;

        // load the page even if it doesn't exist
        service.objPage = Pages.findOne({ name: strPageName });

        // flags to determine what happens next
        var isEditActive   = !!service.isEditActive;
        var isPageExisting = !!service.objPage;
        var isUserSignedIn = !!Meteor.userId();
        var isPageCopy     = !!$state.params.copyOf;

        // console.log(">>> Debug ====================; isEditActive:", isEditActive);
        // console.log(">>> Debug ====================; isPageExisting:", isPageExisting);
        // console.log(">>> Debug ====================; isUserSignedIn:", isUserSignedIn);
        // console.log(">>> Debug ====================; isPageCopy:", isPageCopy);

        // If user is singed in and page is copied,
        // use the page to be copied and as a new page.
        // Or:
        // If user is singed in and page is edited,
        // use the existing page for editing and updating.
        if ((isUserSignedIn && isPageCopy) || 
                (isUserSignedIn && isEditActive)) {

            strTitle = !isPageCopy && 
                    service.objPage &&
                    service.objPage.versions &&
                    service.objPage.versions[0].title || 
                    _.parseTitle($state.params.page);
            strContent = service.objPage &&
                    service.objPage.versions &&
                    service.objPage.versions[0].content ||
                    '';

            service.objPageEdit = {
                title  : strTitle,
                content: strContent,
                name   : strPageName,
            };

            service.strPageName  = strPageName;
            service.isEditFirst  = isPageCopy;
            service.isEditActive = true;
        }

        // If user is singed in and requested page (copy or edit)
        // does not exist, create a new page to be created.
        else if (isUserSignedIn && !isPageExisting) {
            $state.go('page', { page: strPageName, edit: true }, { notify: false });
            service.objPageEdit  = {
                name   : strPageName,
                title  : _.parseTitle(strPageName),
                content: '',
            };
            service.isEditFirst  = true;
            service.isEditActive = true;
        }

        // Otherwise just load the page.
        else {
            $state.go('page', { page: strPageName }, { notify: false });
            service.objPageView  = {
                name   : service.objPage.name,
                title  : service.objPage &&
                    service.objPage.versions &&
                    service.objPage.versions[0].title,
                content: service.objPage &&
                    service.objPage.versions &&
                    service.objPage.versions[0].content,
            };
            service.isEditActive = false;
        }

        return ('function' === typeof callback && callback());
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
            if (service.isInit) {
                return fun.apply(fun, arguments);
            }
            return Meteor.subscribe('pages', function() {
                service.isInit = true;
                return fun.apply(fun, arguments);
            });
        };
    }

    // *****************************************************************************

    return service;

    // *****************************************************************************
}

// *****************************************************************************

})();
