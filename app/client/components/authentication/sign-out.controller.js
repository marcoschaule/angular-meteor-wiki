/**
 * @name        AmwSignOutCtrl
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
    .controller('AmwSignOutCtrl', Controller);

// *****************************************************************************
// Controller definition function
// *****************************************************************************

function Controller(AuthService) {
    var vm = this;

    // *****************************************************************************
    // Controller function definition
    // *****************************************************************************

    /**
     * Controller function to initialize this controller. This method is either
     * immediately called or used in the view in "data-ng-init".
     */
    function init() {
        signOut();
    } init();

    // *****************************************************************************

    /**
     * Controller function to accomplish a sign up supported by the 
     * authentication service.
     */
    function signOut() {
        AuthService.signOut();
    }

    // *****************************************************************************
}

// *****************************************************************************

})();
