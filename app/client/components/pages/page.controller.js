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

function Controller($scope, $state, $sce, PageService) {
    var vm = this;

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    vm.objPageView   = null;
    vm.objPageEdit   = null;
    vm.flags         = PageService.flags;
    vm.editorOptions = {
        lineNumbers : true,
        mode        : 'markdown',
        theme       : 'ttcn',
    };

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
        return PageService.pageUpdate(vm.objPageEdit, isEditDisabled);
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
     * Helper function to initialize controller. 
     * This function is invoked immediately.
     */
    function _init() {
        return PageService.pageRead(function callback(objErr, objResult) {
            if (objResult.objPageView) {
                vm.objPageView = {
                    name   : objResult.objPageView.name,
                    title  : objResult.objPageView.title,
                    content: marked(objResult.objPageView.content),
                };
            }
            if (objResult.objPageEdit) {
                vm.objPageEdit = objResult.objPageEdit;
            }
        });
    } _init();

    // *****************************************************************************
}

// *****************************************************************************

})();
