(function() { 'use strict';

 var fs = Npm.require('fs');
 var path = Npm.require('path');

 var _strDirTemplatesEmail    = '../resources/templates/email/';
 var _regexTemplateFileEnding = /\.template\.[a-z]{2}\-[A-Z]{2}\.html/;

// ********************************************************************************
// Startup functions
// ********************************************************************************

/**
 * Function to startup server.
 */
function startupServer() {
    Meteor.startup(function(){

        // setup app wide email URI
        process.env.MAIL_URL = C_CONFIG_EMAIL.smtp.uri;

        // setup email templates
        _setupEmailTemplates();

        // setup automatic sending service
        Accounts.config({
            sendVerificationEmail: true
        });
    });

} startupServer();

// ********************************************************************************
// Helper functions
// ********************************************************************************

/**
 * Helper function to setup email templates.
 */
function _setupEmailTemplates() {

    // global email template settings
    Accounts.emailTemplates.siteName = C_CONFIG_EMAIL.template.common.siteName;
    Accounts.emailTemplates.from     = C_CONFIG_EMAIL.template.common.from;
    
    // email urls
    Accounts.urls.verifyEmail = function(strToken) {
        return Meteor.absoluteUrl('verify-email/' + strToken);
    };
    Accounts.urls.resetPassword = function(strToken) {
        return Meteor.absoluteUrl('reset-password/' + strToken);
    };

    // email subjects
    Accounts.emailTemplates.verifyEmail.subject = function(objUser) {
        return C_CONFIG_EMAIL.template.verifyEmail.subject
            .replace('#{strUserName}', objUser.username);
    };
    Accounts.emailTemplates.resetPassword.subject = function(objUser) {
        return C_CONFIG_EMAIL.template.forgotPassword.subject
            .replace('#{strUserName}', objUser.username);
    };

    // email texts    
    Accounts.emailTemplates.verifyEmail.text = function(objUser, strUrl) {
        var strToken = objUser.services.password.reset.token;
        return C_CONFIG_EMAIL.template.forgotPassword.text
            .replace('#{strUrlForgotPassword}', strUrl);
    };
    Accounts.emailTemplates.resetPassword.text = function(objUser, strUrl) {
        return C_CONFIG_EMAIL.template.forgotPassword.text
            .replace('#{strUrlVerifyEmail}', strUrl);
    };
}

// *****************************************************************************
// Security
// *****************************************************************************

Meteor.users.deny({
    update: function() {
        return true;
    }
});

// ********************************************************************************

})();
