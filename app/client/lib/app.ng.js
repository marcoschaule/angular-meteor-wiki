(function() { 'use strict';

// $.material.init();

// ********************************************************************************
// Module definitions and organization
// ********************************************************************************

angular.module('amw-packages',    ['angular-meteor', 'ui.router', 'pascalprecht.translate']);
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
            prefix: 'languages/locale-',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage('en_US');
    });

// ********************************************************************************

// ********************************************************************************

})();
