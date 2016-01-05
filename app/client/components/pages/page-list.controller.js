/**
 * @name        AmwPageListCtrl
 * @author      Marco Schaule <marco.schaule@net-designer.net>
 * @file        This file is an AngularJS controller.
 * 
 * @copyright   (c) 2015  net-designer.net, Marco Schaule <marco.schaule@net-designer.net>
 * @license     https://github.com/OnceMac/net-designer.net/blob/master/LICENSE
 */
(function() { 'use strict';

// *****************************************************************************
// Controller module
// *****************************************************************************

angular
    .module('amw-controllers')
    .controller('AmwPageListCtrl', Controller);

// *****************************************************************************
// Controller definition function
// *****************************************************************************

function Controller($scope, $state, $sce, $reactive, PageService) {
    var vm = this;

    // make view model reactive
    $reactive(this).attach($scope);

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    vm.arrPages = [];

    // *****************************************************************************
    // Controller function linking
    // *****************************************************************************

    vm.pageOpen   = pageOpen;
    vm.pageEdit   = pageEdit;
    vm.pageCopy   = pageCopy;
    vm.pageDelete = pageDelete;

    vm.subscribe('users');
    vm.helpers({
        pages: function() { return Pages.find({}); }
    });

    // *****************************************************************************
    // Controller function definition
    // *****************************************************************************

    /**
     * Controller function to open a page.
     * 
     * @param {Object} objEvent     object of the event
     * @param {String} strPageName  string of the page name
     */
    function pageOpen(objEvent, strPageName) {
        return PageService.pageOpen(strPageName);
    }

    // *****************************************************************************

    /**
     * Controller function to edit a page.
     * 
     * @param {Object} objEvent     object of the event
     * @param {String} strPageName  string of the page name
     */
    function pageEdit(objEvent, strPageName) {
        _.preventDefaultAndStopPropagation(objEvent);
        return PageService.pageEditOpen(strPageName);
    }

    // *****************************************************************************

    /**
     * Controller function to copy a page.
     * 
     * @param {Object} objEvent     object of the event
     * @param {String} strPageName  string of the page name
     */
    function pageCopy(objEvent, strPageName) {
        _.preventDefaultAndStopPropagation(objEvent);
        return PageService.pageCopy(strPageName);
    }

    // *****************************************************************************

    /**
     * Controller function to delete a page.
     * 
     * @param {Object} objEvent     object of the event
     * @param {String} strPageName  string of the page name
     */
    function pageDelete(objEvent, strPageName) {
        _.preventDefaultAndStopPropagation(objEvent);
        return PageService.pageDelete(strPageName, true, function() {
            _readPages();
        });
    }

    // *****************************************************************************
    // Controller helper definitions
    // *****************************************************************************

    /**
     * Helper function to read all pages.
     */
    function _readPages() {
        var arrUserIds = [];
        var i, objPage, arrUsernamesAndIds, objUsernamesAndIds;

        PageService.pageReadAll(function(objErr, arrPages) {
            vm.arrPages = arrPages;
        });
    }

    // *****************************************************************************

    /**
     * Helper function to initialize controller. 
     * This function is invoked immediately.
     */
    function _init() {
        _readPages();
    } _init();

    // *****************************************************************************
}

// *****************************************************************************

})();
