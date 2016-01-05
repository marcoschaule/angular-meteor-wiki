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

function Controller($scope, $state, $reactive, PageService) {
    var vm = this;

    // make view model reactive
    $reactive(this).attach($scope);

    // *****************************************************************************
    // Subscriptions
    // *****************************************************************************

    // subscribe to pages collection
    vm.subscribe('pages');

    // *****************************************************************************
    // Public variables and reactive helpers
    // *****************************************************************************

    vm.helpers({
        arrPages: _readPages, // produces "vm.arrPages"
    });

    // *****************************************************************************
    // Controller function linking
    // *****************************************************************************

    vm.pageOpen   = pageOpen;
    vm.pageEdit   = pageEdit;
    vm.pageCopy   = pageCopy;
    vm.pageDelete = pageDelete;
    
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
     *
     * @return {Array}  array of the found pages
     */
    function _readPages() {
        return Pages.find({});
    }

    // *****************************************************************************

    /**
     * Helper function to initialize controller. 
     * This function is invoked immediately.
     */
    function _init() {
    } _init();

    // *****************************************************************************
}

// *****************************************************************************

})();
