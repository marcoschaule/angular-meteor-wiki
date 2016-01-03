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
    vm.isEditActive  = null;
    vm.isEditFirst   = null;
    vm.editorOptions = {
        lineNumbers : true,
        mode        : 'markdown',
        theme       : 'monokai',
    };

    // *****************************************************************************
    // Controller function linking
    // *****************************************************************************

    vm.init       = init;
    vm.updatePage = updatePage;
    vm.cancelPage = cancelPage;

    // *****************************************************************************
    // Controller function definition
    // *****************************************************************************

    /**
     * Service method to initialize controller. Is called immediately or can
     * be called from within controller.
     */
    function init() {
        return PageService.pageRead(function callback(objErr, objResult) {
            if (objResult.objPageView) {
                vm.objPageView = {
                    title  : objResult.objPageView.title,
                    content: marked(objResult.objPageView.content),
                };
            }
            if (objResult.objPageEdit) {
                vm.objPageEdit = objResult.objPageEdit;
            }

            vm.isEditActive = objResult.isEditActive;
            vm.isEditFirst  = objResult.isEditFirst;
        });
    } init();

    // *****************************************************************************

    function updatePage(isEditableCanceled) {
        
        // If page document does not exist in database, yet, create it.
        if (!vm.objPage || !vm.objPage.name) {
            Meteor.call('pagesCreateOne', vm.objPageEdit);
        } 

        // If page document exists, update it (by adding another entry to "versions"). 
        else {
            Meteor.call('pagesUpdateOne', { name: vm.objPage.name }, vm.objPageEdit);
        }

        // If "edit" state needs to be canceled, cancel page editing. 
        if (isEditableCanceled) {
            return cancelPage();
        }
        
        vm.isEditable  = !isEditableCanceled;
        vm.isFirstEdit = false;
        
        _readPage();
    }

    // *****************************************************************************

    /**
     * Controller function to cancel page editing.
     */
    function cancelPage() {
        $state.go('page', { page: vm.strPageName, edit: null, first: null }, { reload: true });
    }

    // *****************************************************************************
    // Controller helper definitions
    // *****************************************************************************

    

    // *****************************************************************************
}

// *****************************************************************************

})();
