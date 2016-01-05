/**
 * @name        AmwPageHistoryCtrl
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
    .controller('AmwPageHistoryCtrl', Controller);

// *****************************************************************************
// Controller definition function
// *****************************************************************************

function Controller($scope, $state, $sce, $reactive, PageService) {
    var vm = this;

    // make view model reactive
    $reactive(this).attach($scope);

    // *****************************************************************************
    // Public variables and reactive helpers
    // *****************************************************************************

    vm.helpers({
        objPage: _readPage, // produces "vm.arrPages"
    });

    // subscribe to pages collection
    vm.subscribe('pages');

    // *****************************************************************************
    // Controller function linking
    // *****************************************************************************

    vm.pageVersionReset  = pageVersionReset;
    vm.pageVersionDelete = pageVersionDelete;
    vm.pageExpandAll     = pageExpandAll;
    vm.pageCollapseAll   = pageCollapseAll;
    vm.pageBack          = pageBack;
    vm.markdownContent   = markdownContent;

    // *****************************************************************************
    // Controller function definition
    // *****************************************************************************

    /**
     * Controller function to reset page to a version.
     * 
     * @param  {Object} objEvent  object of DOM event
     * @param  {Number} numIndex  number of index to be reset
     */
    function pageVersionReset(objEvent, numIndex) {
        _.preventDefaultAndStopPropagation(objEvent);
        return PageService.pageHistoryReset(numIndex);
    }
    
    // *****************************************************************************

    /**
     * Controller function to delete a page version.
     * 
     * @param  {Object} objEvent  object of DOM event
     * @param  {Number} numIndex  number of index to be deleted
     */
    function pageVersionDelete(objEvent, numIndex) {
        _.preventDefaultAndStopPropagation(objEvent);
        return PageService.pageHistoryDelete(numIndex);
    }

    // *****************************************************************************

    /**
     * Controller function to expand all page versions.
     */
    function pageExpandAll() {
        for (var i = 0; i < vm.objPage.versions.length; i += 1) {
            vm.objPage.versions[i].open = true;
        }
    }

    // *****************************************************************************

    /**
     * Controller function to collapse all page versions.
     */
    function pageCollapseAll() {
        for (var i = 0; i < vm.objPage.versions.length; i += 1) {
            vm.objPage.versions[i].open = false;
        }
    }

    // *****************************************************************************

    /**
     * Controller function to go back to the page.
     */
    function pageBack() {
        PageService.pageBack();
    }

    // *****************************************************************************

    /**
     * Controller function to markdown the content.
     * 
     * @param  {String} strContent  string to be marked
     * @return {String}             string marked
     */
    function markdownContent(strContent) {
        return marked(strContent);
    }

    // *****************************************************************************
    // Controller helper definitions
    // *****************************************************************************

    /**
     * Helper function to read all pages.
     *
     * @return {Array}  array of the found pages
     */
    function _readPage() {
        return Pages.findOne({ name: $state.params.page });
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
