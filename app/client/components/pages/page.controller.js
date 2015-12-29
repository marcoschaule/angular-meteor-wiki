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

function Controller($scope, $state, $reactive, $timeout, $sce, $window) {
    var vm = this;

    // make "this" reactively and attach scope to it
    // $reactive(vm).attach($scope);

    // subscribe to "pages" collection
    // vm.subscribe('pages', function() { init(); });

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    vm.objPage       = {};
    vm.objPageView   = {};
    vm.objPageEdit   = {};
    vm.isEditable    = false;
    vm.isFirstEdit   = false;
    vm.editorOptions = {
        lineWrapping: false,
        lineNumbers : true,
        readOnly    : false,
        mode        : 'markdown',
    };

    // *****************************************************************************
    // Controller function linking
    // *****************************************************************************

    vm.init       = init;
    vm.updatePage = updatePage;
    vm.closePage  = closePage;

    // *****************************************************************************
    // Controller function definition
    // *****************************************************************************

    /**
     * Service method to initialize controller. Is called immediately or can
     * be called from within controller.
     */
    function init() {
        Meteor.subscribe('pages', function() {
            $timeout(function() {
                _readPage();
            });
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
            return closePage();
        }
        
        vm.isEditable  = !isEditableCanceled;
        vm.isFirstEdit = false;
        
        _readPage();
    }

    // *****************************************************************************

    function closePage() {
        $state.go('page', { page: $state.params.page, edit: null }, { reload: true });
    }

    // *****************************************************************************
    // Controller helper definitions
    // *****************************************************************************

    function _readPage() {
        vm.objPage      = Pages.findOne({ name: $state.params.page });
        vm.isEditable   = !!$state.params.edit;

        if (!vm.objPage) {
            vm.isEditable  = true;
            vm.isFirstEdit = true;
            vm.objPageEdit = {
                name   : $state.params.page,
                title  : _.parseTitle($state.params.page),
                content: '',
            };
        }

        else if (vm.isEditable) {
            vm.objPageEdit = {
                title  : vm.objPage.versions[0].title,
                content: vm.objPage.versions[0].content,
            };
        }

        else {
            vm.objPageView = {
                title  : vm.objPage.versions[0].title,
                content: $window.marked(vm.objPage.versions[0].content),
            };
        }
    }

    // *****************************************************************************
}

// *****************************************************************************

})();
