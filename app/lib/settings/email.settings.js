// ********************************************************************************
// Email configuration object
// ********************************************************************************

/**
 * Email config object.
 * @type {Object}
 */
C_CONFIG_EMAIL = {
    smtp: {},
    info: {},
    template: {
        common: {},
        verifyEmail: {},
        forgotPassword: {}
    }
};

// ********************************************************************************
// Email SMTP server configuration
// ********************************************************************************

/**
 * Email SMTP host.
 * @type {String}
 */
C_CONFIG_EMAIL.smtp.host = 'smtp.udag.de';

// ********************************************************************************

/**
 * Email SMTP port.
 * @type {String}
 */
C_CONFIG_EMAIL.smtp.port = 465; // default ports: 25, 462, 587

// ********************************************************************************

/**
 * Email SMTP user name.
 * @type {String}
 */
C_CONFIG_EMAIL.smtp.username = '';

// ********************************************************************************

/**
 * Email SMTP password.
 * @type {String}
 */
C_CONFIG_EMAIL.smtp.password = '';

// ********************************************************************************

/**
 * Email SMTP URI, build of previous information.
 * @type {String}
 */
C_CONFIG_EMAIL.smtp.uri = [
    'smtp://',
    C_CONFIG_EMAIL.smtp.username,
    ':',
    C_CONFIG_EMAIL.smtp.password,
    '@',
    C_CONFIG_EMAIL.smtp.host,
    ':',
    C_CONFIG_EMAIL.smtp.port
].join('');

// ********************************************************************************
// Email system information
// ********************************************************************************

/**
 * Email sender information.
 * @type {String}
 */
C_CONFIG_EMAIL.info.sender = 'info@net-designer.net';

// ********************************************************************************
// Email template common
// ********************************************************************************

/**
 * Email template common site name.
 * @type {String}
 */
C_CONFIG_EMAIL.template.common.siteName = 'AwesomeSite';

/**
 * Email template common "from" sender.
 * @type {String}
 */
C_CONFIG_EMAIL.template.common.from = 'AwesomeSite system <' + C_CONFIG_EMAIL.info.sender + '>';

// ********************************************************************************
// Email template verify email
// ********************************************************************************

/**
 * Email template verify email subject.
 * @type {String}
 */
C_CONFIG_EMAIL.template.verifyEmail.subject = 'MeteorWiki - verify email';

/**
 * Email template verify email text.
 * @type {String}
 */
C_CONFIG_EMAIL.template.verifyEmail.text = [
    'Dear user "#{strUserName}!"',
    'To verify your email, simply click the link below.',
    '    #{strUrlVerifyEmail}',
    'Thanks.',
].join('\n\n');

// ********************************************************************************
// Email template forgot password
// ********************************************************************************

/**
 * Email template reset password subject.
 * @type {String}
 */
C_CONFIG_EMAIL.template.forgotPassword.subject = 'MeteorWiki - reset password';

/**
 * Email template reset password text.
 * @type {String}
 */
C_CONFIG_EMAIL.template.forgotPassword.text = [
    'Dear user "#{strUserName}!"',
    'To reset your password, simply click the link below.',
    '    #{strUrlForgotPassword}',
    'Thanks.',
].join('\n\n');
