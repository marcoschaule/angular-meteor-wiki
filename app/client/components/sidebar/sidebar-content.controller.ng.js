/**
 * @name        AmwSidenavContentCtrl
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
    .controller('AmwSidebarContentCtrl', Controller);

// *****************************************************************************
// Controller definition function
// *****************************************************************************

function Controller(AuthService) {
    var vm = this;

    // *****************************************************************************
    // Function linking
    // *****************************************************************************

    vm.isSignedIn = AuthService.isSignedIn;
    vm.signOut    = signOut;

    // *****************************************************************************
    // Function definitions
    // *****************************************************************************

    function signOut() {
        AuthService.signOut();
    }

    // *****************************************************************************
}

// *****************************************************************************

})();
