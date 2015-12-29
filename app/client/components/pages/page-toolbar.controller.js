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

    vm.isEditable = false;

    // *****************************************************************************
    // Controller function linking
    // *****************************************************************************

    vm.init     = init;
    vm.editPage = editPage;

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
        $state.go('page', { page: $state.params.page, edit: true });
    }

    // *****************************************************************************
    // Controller helper definitions
    // *****************************************************************************

    // *****************************************************************************
}

// *****************************************************************************

})();
