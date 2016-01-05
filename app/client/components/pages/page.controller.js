/**
 * @name        AmwPageCtrl
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
    .controller('AmwPageCtrl', Controller);

// *****************************************************************************
// Controller definition function
// *****************************************************************************

function Controller($rootScope, $scope, $state, $sce, $timeout, $reactive, PageService) {
    var vm = this;

    // make view model reactive
    $reactive(this).attach($scope);

    // *****************************************************************************
    // Public variables and reactive helpers
    // *****************************************************************************

    $rootScope.flags.isProcessing = true;

    vm.objPageEdit        = null;
    vm.promiseTimeoutInit = null;

    vm.flags              = PageService.flags;
    vm.flags.isEditOpened = false;
    vm.flags.isEditFirst  = false;
    vm.flags.isEditActive = !!$state.params.edit;
    vm.flags.isEditCopy   = !!$state.params.copyOf;

    vm.editorOptions      = {
        lineNumbers : true,
        mode        : 'markdown',
        theme       : 'ttcn',
    };

    vm.helpers({
        objPage: _readPage, // produces "vm.objPage"
    });

    // *****************************************************************************
    // Subscriptions
    // *****************************************************************************

    // subscribe to pages collection
    vm.subscribe('pages');

    // *****************************************************************************
    // Controller function linking
    // *****************************************************************************

    vm.pageUpdate    = pageUpdate;
    vm.pageReset     = pageReset;
    vm.pageEditClose = pageEditClose;

    // *****************************************************************************
    // Controller function definition
    // *****************************************************************************

    /**
     * Controller function to update a edited page.
     * 
     * @param  {Boolean} isEditDisabled  true if after editing edit mode should be deactivated
     */
    function pageUpdate(isEditDisabled) {
        PageService.pageUpdate(vm.objPageEdit, isEditDisabled);
        return vm.formPageEdit.$setPristine();
    }

    // *****************************************************************************

    /**
     * Controller function to reset the dirty form.
     */
    function pageReset() {
        if (vm.formPageEdit.$dirty) {
            PageService.pageReset();
        }
    }

    // *****************************************************************************

    /**
     * Controller function to close page's edit mode.
     */
    function pageEditClose() {
        return PageService.pageEditClose();
    }

    // *****************************************************************************
    // Controller helper definitions
    // *****************************************************************************

    /**
     * Helper function to read a page by page name.
     * 
     * @return {Object}  object of the found page
     */
    function _readPage() {
        var strPageName = $state.params.copyOf || $state.params.page || 'index';
        var objPage     = Pages.findOne({ name: strPageName });

        // set "first edit" flag
        vm.flags.isEditFirst = 
            !!(vm.flags.isEditActive && !objPage) ||
            !!(vm.flags.isEditCopy && !Pages.findOne({ name: $state.params.page }));

        if (!objPage) {
            vm.flags.isEditActive = true;
            vm.flags.isEditFirst  = true;
        } else {
            vm.flags.isEditActive = !!$state.params.edit;
            vm.flags.isEditFirst  = false;
        }

        $timeout.cancel(vm.promiseTimeoutInit);
        vm.promiseTimeoutInit = $timeout(function() {
            $rootScope.flags.isProcessing = false;
        }, C_CONFIG_COMMON.system.tansitionTime);

        return _extendPage(objPage);
    }

    // *****************************************************************************

    /**
     * Helper function to extend the page.
     * 
     * @param  {Object} objPage  object of page to be extended
     * @return {Object}          object of page extended
     */
    function _extendPage(objPage) {
        if (!objPage) {
            objPage = {};
        }

        objPage.createdAt = objPage &&
                objPage.createdAt;
        objPage.createdBy = objPage &&
                objPage.createdBy;
        objPage.updatedAt = objPage &&
                objPage.versions &&
                objPage.versions[0].updatedAt;
        objPage.updatedBy = objPage &&
                objPage.versions &&
                objPage.versions[0].updatedBy;
        objPage.title     = objPage &&
                objPage.versions &&
                objPage.versions[0].title;
        objPage.content   = objPage &&
                objPage.versions &&
                objPage.versions[0].content;

        if (vm.flags.isEditCopy || !objPage.name || !objPage.title) {
            objPage.name  = $state.params.page;
            objPage.title = _.parseTitle($state.params.page);
        }
        if (!vm.flags.isEditActive && objPage.content) {
            objPage.content = marked(objPage.content);
            vm.flags.isEditOpened = false;
        }
        if (vm.flags.isEditActive && !vm.flags.isEditOpened) {
            vm.objPageEdit        = objPage;
            vm.flags.isEditOpened = true;
        }
        
        return objPage;
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
