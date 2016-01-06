(function() { 'use strict';

// *****************************************************************************
// Meteor subscriptions
// *****************************************************************************

Meteor.subscribe("userData");

// ********************************************************************************
// Module definitions and organization
// ********************************************************************************

angular.module('amw-packages',    ['angular-meteor', 'ngSanitize', 'ui.router', 'ui.bootstrap', 'ui.codemirror', 'pascalprecht.translate']);
angular.module('amw-filters',     []);
angular.module('amw-directives',  []);
angular.module('amw-services',    []);
angular.module('amw-controllers', []);
angular.module('amw',             ['amw-packages', 'amw-filters', 'amw-directives', 'amw-services', 'amw-controllers']);

// ********************************************************************************
// Settings
// ********************************************************************************

// setup translation service
angular
    .module('amw')
    .config(function($translateProvider) {
        $translateProvider.useStaticFilesLoader({
            prefix: 'languages/',
            suffix: '.locale.json'
        });
        $translateProvider.useSanitizeValueStrategy('sanitize');
        $translateProvider.preferredLanguage(C_CONFIG_COMMON.language.default);
    });

// ********************************************************************************

angular
    .module('amw')
    .run(function ($rootScope, $state) {
        $rootScope.$on('$stateChangeError', function(objEvent,
                objToState, objToParams, objFromState, objFromParams, objError) {
            if (objError === 'AUTH_REQUIRED') {
                $state.go('sign-in');
            }
        });
    });

// ********************************************************************************

})();
