(function() { 'use strict';

// *****************************************************************************
// Routing setup
// *****************************************************************************

angular
    .module("amw")
    .config(function($urlRouterProvider, $stateProvider, $locationProvider) {
        $locationProvider.html5Mode(true);

        $stateProvider
            .state('home',    getRouteObjectHome())
            .state('help',    getRouteObjectHelp())
            .state('profile', getRouteObjectProfile())
            .state('sign-in', getRouteObjectSignIn())
            .state('sign-up', getRouteObjectSignUp())
            ;

        $urlRouterProvider.otherwise('/');
    });

// *****************************************************************************
// Routing object definitions - Common
// *****************************************************************************

/**
 * Function to get the route object for "home".
 * 
 * @return {Object}  object for route
 */
function getRouteObjectHome() {
    return _extendWithStaticHeader({
        url  : '/',
        views: {
            content: {
                templateUrl  : 'home.template.html',
                controller   : 'AmwHomeCtrl as vm',
            },
        },
    });
}

// *****************************************************************************

/**
 * Function to get the route object for "home".
 * 
 * @return {Object}  object for route
 */
function getRouteObjectHelp() {
    return _extendWithStaticHeader({
        url  : '/help',
        views: {
            content: {
                templateUrl  : 'help.template.html',
            },
        },
    });
}

// *****************************************************************************

/**
 * Function to get the route object for "home".
 * 
 * @return {Object}  object for route
 */
function getRouteObjectProfile() {
    return _extendWithStaticHeader({
        url  : '/profile',
        views: {
            content: {
                templateUrl  : 'profile.template.html',
            },
        },
    });
}

// *****************************************************************************
// Routing object definitions - Authentication
// *****************************************************************************

/**
 * Function to get the route object for "sign-in".
 * 
 * @return {Object}  object for route
 */
function getRouteObjectSignIn() {
    return _extendWithStaticHeader({
        url  : '/sign-in',
        views: {
            content: {
                templateUrl: 'sign-in.template.html',
                controller   : 'AmwSignInCtrl as vm',
            },
        },
    });
}

// // *****************************************************************************

/**
 * Function to get the route object for "sign-up".
 * 
 * @return {Object}  object for route
 */
function getRouteObjectSignUp() {
    return _extendWithStaticHeader({
        url  : '/sign-up',
        views: {
            content: {
                templateUrl: 'client/components/authentication/sign-up.template.html',
                controller   : 'AmwSignUpCtrl as vm',
            },
        },
    });
}

// // *****************************************************************************

// /**
//  * Function to get the route object for "forgot-password".
//  * 
//  * @return {Object}  object for route
//  */
// function getRouteObjectForgotPassword() {
//     return {
//         url        : '/forgot-password',
//         templateUrl: 'client/components/authentication/forgot-password.template.html',
//     };
// }

// // *****************************************************************************

// /**
//  * Function to get the route object for "reset-password".
//  * 
//  * @return {Object}  object for route
//  */
// function getRouteObjectResetPassword() {
//     return {
//         url        : '/reset-password/:strToken',
//         templateUrl: 'client/components/authentication/reset-password.template.html',
//     };
// }

// *****************************************************************************
// Routing object definitions - Pages
// *****************************************************************************

// *****************************************************************************
// Helpers
// *****************************************************************************

function _extendWithStaticHeader(objRoute) {
    objRoute.views.header = {
        templateUrl  : 'client/components/header/header-static.template.html',
    };
    return objRoute;
}

// *****************************************************************************

})();




