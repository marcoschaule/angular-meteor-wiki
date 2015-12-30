(function() { 'use strict';

// *****************************************************************************
// Routing setup
// *****************************************************************************

angular
    .module("amw")
    .config(function($urlRouterProvider, $stateProvider, $locationProvider) {
        $locationProvider.html5Mode(true);

        $stateProvider
            // .state('home',                    getStateObjectHome())
            .state('help',                    getStateObjectHelp())
            .state('profile',                 getStateObjectProfile())
            .state('sign-in',                 getStateObjectSignIn())
            .state('sign-up',                 getStateObjectSignUp())
            .state('sign-out',                getStateObjectSignOut())
            .state('forgot-password',         getStateObjectResetPassword('forgot'))
            .state('reset-password',          getStateObjectResetPassword('reset'))
            .state('reset-password-complete', getStateObjectResetPassword('complete'))
            .state('page',                    getStateObjectPage())
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
function getStateObjectHome() {
    return _extendWithStaticViews({
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
function getStateObjectHelp() {
    return _extendWithStaticViews({
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
function getStateObjectProfile() {
    return _extendWithStaticViewsSecure({
        url  : '/profile',
        views: {
            content: {
                templateUrl  : 'profile.template.html',
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
function getStateObjectPage() {
    var objState = {
        url  : '/:page?edit&copyOf',
        views: {
            header: {
                templateUrl: 'client/components/pages/page-toolbar.template.html',
                controller : 'AmwPageToolbarCtrl as vm',
            },
            sidebar: {
                templateUrl: 'client/components/pages/page-sidebar.template.html',
                controller : 'AmwPageSidebarCtrl as vm',
            },
            content: {
                templateUrl: 'page.template.html',
                controller : 'AmwPageCtrl as vm',
            },
        },
    };
    return objState;
}

// *****************************************************************************

/**
 * Function to get the route object for "home".
 * 
 * @return {Object}  object for route
 */
function getStateObjectWikiPageList() {
    var objState = {
        url  : '/wiki/page-list',
        views: {
            header: {
                templateUrl: 'client/components/pages/page-list-toolbar.template.html',
                controller : 'AmwPageListToolbarCtrl as vm',
            },
            sidebar: {
                templateUrl: 'client/components/pages/page-sidebar.template.html',
                controller : 'AmwPageSidebarCtrl as vm',
            },
            content: {
                templateUrl: 'page-list.template.html',
                controller : 'AmwPageListCtrl as vm',
            },
        },
    };
    return objState;
}

// *****************************************************************************
// Routing object definitions - Authentication
// *****************************************************************************

/**
 * Function to get the route object for "sign-in".
 * 
 * @return {Object}  object for route
 */
function getStateObjectSignIn() {
    return _extendWithStaticViews({
        url  : '/sign-in',
        views: {
            content: {
                templateUrl: 'sign-in.template.html',
                controller : 'AmwSignInCtrl as vm',
            },
        },
    });
}

// *****************************************************************************

/**
 * Function to get the route object for "sign-up".
 * 
 * @return {Object}  object for route
 */
function getStateObjectSignUp() {
    return _extendWithStaticViews({
        url  : '/sign-up',
        views: {
            content: {
                templateUrl: 'client/components/authentication/sign-up.template.html',
                controller   : 'AmwSignUpCtrl as vm',
            },
        },
    });
}

// *****************************************************************************

/**
 * Function to get the route object for "sign-out".
 * 
 * @return {Object}  object for route
 */
function getStateObjectSignOut() {
    return {
        url: 'sign-out',
        views: {
            content: {
                controller: 'AmwSignOutCtrl as vm',
            },
        },
    };
}

// *****************************************************************************

/**
 * Function to get the route object for "reset-password" with the steps
 * "forgot", "reset" and "complete".
 * 
 * @return {Object}  object for route
 */
function getStateObjectResetPassword(strStep) {
    var objState = _extendWithStaticViews({
        views: {
            content: {
                templateUrl : 'client/components/authentication/reset-password.template.html',
                controller  : 'AmwResetPasswordCtrl as vm',
            },
        },
        data: {
            strStep: strStep,
        },
    });
    if ('forgot' === strStep) {
        objState.url = '/forgot-password';
    }
    else if ('reset' === strStep) {
        objState.url = '/reset-password/:strToken';
    }
    else if ('complete' === strStep) {
        objState.url = '/reset-password-complete';
    }
    return objState;
}

// *****************************************************************************
// Routing object definitions - Pages
// *****************************************************************************

// *****************************************************************************
// Helpers
// *****************************************************************************

function _extendWithStaticViews(objState) {
    if (!objState.views) {
        objState.views = {};
    }
    objState.views.header = {
        templateUrl: 'client/components/header/header-static.template.html',
    };
    objState.views.sidebar = {
        templateUrl: 'client/components/sidebar/sidebar-content.template.html',
        controller : 'AmwSidebarContentCtrl as vm',
    };
    return objState;
}

// *****************************************************************************

function _extendWithStaticViewsSecure(objState) {
    objState.resolve = objState.resolve || {};
    objState.resolve.currentUser = function($q) {
        if (!Meteor.userId()) {
            return $q.reject('AUTH_REQUIRED');
        }
        return $q.resolve();
    };
    return _extendWithStaticViews(objState);
}

// *****************************************************************************

})();




