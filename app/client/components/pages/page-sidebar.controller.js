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

function Controller($state, $sce) {
    var vm = this;

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    vm.strPageName    = '';
    vm.objPageSidebar = {};

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
        vm.strPageName = $state.params.page || '/';

        Meteor.subscribe('pages', function() {
            var objPageSidebar = Pages.findOne({ name: 'sidebar' });

            if (objPageSidebar) {
                vm.objPageSidebar = {
                    title  : objPageSidebar.versions[0].title,
                    content: _setCurrentLinkActive(marked(objPageSidebar.versions[0].content)),
                };
            }
        });
    } init();

    // *****************************************************************************
    // Controller helper definitions
    // *****************************************************************************

    function _setCurrentLinkActive(strContent) {
        var objContent    = $('<div>' + strContent + '</div>');
        var regexLinkView = new RegExp(vm.strPageName + '$');
        var regexLinkEdit = new RegExp(vm.strPageName + '\\?edit=true$');
        var isEditable    = !!$state.params.edit;

        var arrLinkView   = $('a', objContent).filter(function() { return regexLinkView.test(this.href); });
        var arrLinkEdit   = $('a', objContent).filter(function() { return regexLinkEdit.test(this.href); });

        if (arrLinkEdit.length > 0 && isEditable) {
            arrLinkEdit.addClass('active');
        }
        else if (arrLinkView.length > 0) {
            arrLinkView.addClass('active');
        }

        return objContent.html();
    }

    // *****************************************************************************
}

// *****************************************************************************

})();
