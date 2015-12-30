/**
 * @name        AmwPageToolbarCtrl
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
    .controller('AmwPageToolbarCtrl', Controller);

// *****************************************************************************
// Controller definition function
// *****************************************************************************

function Controller($scope, $state) {
    var vm = this;

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    vm.strPageName = $state.params.page || 'index';
    vm.isEditable  = false;
    vm.isIndexPage = !$state.params.page;

    // *****************************************************************************
    // Controller function linking
    // *****************************************************************************

    vm.init       = init;
    vm.editPage   = editPage;
    vm.copyPage   = copyPage;
    vm.deletePage = deletePage;

    // *****************************************************************************
    // Controller function definition
    // *****************************************************************************

    /**
     * Service method to initialize controller. Is called immediately or can
     * be called from within controller.
     */
    function init() {
    } init();

    // *****************************************************************************

    function editPage() {
        $state.go('page', { page: vm.strPageName, edit: true });
    }

    // *****************************************************************************

    function copyPage() {
        $state.go('page', { page: vm.strPageName + '-copy', copyOf: vm.strPageName, edit: true });
        console.log(">>> Debug ====================; copy page", '\n\n');
    }

    // *****************************************************************************

    function deletePage() {
        console.log(">>> Debug ====================; delete page", '\n\n');
    }

    // *****************************************************************************
    // Controller helper definitions
    // *****************************************************************************

    // *****************************************************************************
}

// *****************************************************************************

})();
