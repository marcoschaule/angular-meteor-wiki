(function() { 'use strict';

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
    });

} startupServer();

// ********************************************************************************
// Support functions
// ********************************************************************************

/**
 * Support function to setup email templates.
 */
function _setupEmailTemplates() {

    // global email template settings
    Accounts.emailTemplates.siteName = C_CONFIG_EMAIL.template.common.siteName;
    Accounts.emailTemplates.from     = C_CONFIG_EMAIL.template.common.from;

    Accounts.urls.resetPassword = function(strToken) {
        return Meteor.absoluteUrl('reset-password/' + strToken);
    };

    Accounts.emailTemplates.resetPassword.subject = function(objUser) {
        return C_CONFIG_EMAIL.template.forgotPassword.subject
            .replace('#{strUserName}', objUser.username);
    };
    
    Accounts.emailTemplates.resetPassword.text = function(objUser, strUrl) {
        var strToken = objUser.services.password.reset.token;
        return C_CONFIG_EMAIL.template.forgotPassword.text
            .replace('#{strUrlForgotPassword}', strUrl);
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
