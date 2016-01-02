/**
 * @name        AmwPageModalDeleteCtrl
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
    .controller('AmwPageModalDeleteCtrl', Controller);

// *****************************************************************************
// Controller definition function
// *****************************************************************************

function Controller($modalInstance) {
    var vm = this;

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    // *****************************************************************************
    // Controller function linking
    // *****************************************************************************

    vm.init    = init;
    vm.proceed = proceed;

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

    /**
     * Controller function to proceed with model either confirming or
     * canceling the deletion of the current page.
     * 
     * @param  {Boolean} isConfirmed  true if deletion is confirmed, false otherwise
     */
    function proceed(isConfirmed) {
        if (isConfirmed) {
            return $modalInstance.close('confirmed');
        } else {
            return $modalInstance.dismiss('cancel');
        }
    }

    // *****************************************************************************
    // Controller helper definitions
    // *****************************************************************************

    // *****************************************************************************
}

// *****************************************************************************

})();
