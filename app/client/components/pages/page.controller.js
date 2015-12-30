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

    vm.strPageName   = '';
    vm.objPage       = {};
    vm.objPageView   = {};
    vm.objPageEdit   = {};
    vm.isEditable    = false;
    vm.isFirstEdit   = false;
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
        vm.strPageName = $state.params.page  || 'index';
        vm.isFirstEdit = $state.params.first || false;

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
            return cancelPage();
        }
        
        vm.isEditable  = !isEditableCanceled;
        vm.isFirstEdit = false;
        
        _readPage();
    }

    // *****************************************************************************

    function cancelPage() {
        $state.go('page', { page: vm.strPageName, edit: null, first: null }, { reload: true });
    }

    // *****************************************************************************
    // Controller helper definitions
    // *****************************************************************************

    function _readPage() {
        var strTitle, strContent;
        vm.objPage = Pages.findOne({ name: vm.strPageName });

        if (!!$state.params.edit && Meteor.userId()) {
            strTitle = vm.objPage &&
                    vm.objPage.versions &&
                    vm.objPage.versions[0].title ||
                    _.parseTitle(vm.strPageName);
            strContent = vm.objPage &&
                    vm.objPage.versions &&
                    vm.objPage.versions[0].content || '';

            vm.isEditable  = true;
            vm.objPageEdit = {
                title  : strTitle,
                content: strContent,
            };
        }

        else if (!vm.objPage && Meteor.userId()) {
            $state.go('page', { page: vm.strPageName, edit: true, first: true });
        }

        else if (vm.objPage && vm.objPage.versions) {
            vm.objPageView = {
                title  : vm.objPage.versions[0].title,
                content: $window.marked(vm.objPage.versions[0].content),
            };
        }
        else {
            vm.isEditable = false;
            $state.go('page', { page: vm.strPageName }, { notify: false });
        }
    }

    // *****************************************************************************
}

// *****************************************************************************

})();
