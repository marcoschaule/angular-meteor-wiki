/**
 * @name        AmwPageSidebarCtrl
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
    .controller('AmwPageSidebarCtrl', Controller);

// *****************************************************************************
// Controller definition function
// *****************************************************************************

function Controller() {
    var vm = this;

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    // *****************************************************************************
    // Controller function linking
    // *****************************************************************************

    vm.init = init;

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
    // Controller helper definitions
    // *****************************************************************************

    // *****************************************************************************
}

// *****************************************************************************

})();
