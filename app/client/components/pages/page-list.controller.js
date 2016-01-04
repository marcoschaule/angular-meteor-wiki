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

function Controller($scope, $state, $sce, PageService) {
    var vm = this;

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    vm.arrPages = [];

    // *****************************************************************************
    // Controller function linking
    // *****************************************************************************

    // *****************************************************************************
    // Controller function definition
    // *****************************************************************************

    // *****************************************************************************
    // Controller helper definitions
    // *****************************************************************************

    /**
     * Helper function to read all pages.
     */
    function _readPages() {
        vm.arrPages = PageService.pageReadAll();
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
