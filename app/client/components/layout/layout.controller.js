/**
 * @name        AmwLayoutCtrl
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
    .controller('AmwLayoutCtrl', Controller);

// *****************************************************************************
// Controller definition function
// *****************************************************************************

function Controller($rootScope, $timeout) {
    var vm = this;

    // *****************************************************************************
    // Public variables and reactive helpers
    // *****************************************************************************

    vm.flags = {};

    if (C_CONFIG_COMMON.system.tansitionTime > 0) {
        vm.flags.isProcessing = true;
    }

    $rootScope.flags = vm.flags;

    // *****************************************************************************
    // Controller function linking
    // *****************************************************************************

    // *****************************************************************************
    // Controller function definition
    // *****************************************************************************

    // *****************************************************************************
    // Controller helper definitions
    // *****************************************************************************

    // *****************************************************************************

    /**
     * Helper function to initialize controller. 
     * This function is invoked immediately.
     */
    function _init() {
        vm.flags.isProcessing = false;
    } _init();

    // *****************************************************************************
    // Events
    // *****************************************************************************

    // Event to active spinner, which will be deactivated automatically a bit later
    $rootScope.$on('$stateChangeSuccess', function(
            objEvent, objToState, objToParams, objFromState, objFromParams) {

        if (C_CONFIG_COMMON.system.tansitionTime > 0) {
            vm.flags.isProcessing = true;

            $timeout(function() {
                vm.flags.isProcessing = false;
            }, C_CONFIG_COMMON.system.tansitionTime);
        }

    });

    // *****************************************************************************
}

// *****************************************************************************

})();
