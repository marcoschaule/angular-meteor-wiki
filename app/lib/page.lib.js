(function(global) { 'use strict';

// ********************************************************************************
// Register functions
// ********************************************************************************

global.preprocessMarkdown        = preprocessMarkdown;
global.preprocessMarkdownSidebar = preprocessMarkdownSidebar;

// ********************************************************************************
// Page functions
// ********************************************************************************

/**
 * Page function to preprocess markdown.
 *
 * @param  {String} strMarkdown  string of source markdown
 * @return {String}              string of processed markdown
 */
function preprocessMarkdown(strMarkdown) {

    // Regular expression to turn "[Link name]<pageName>"
    // into markdown link "[Link name](/page/pageName)".
    var regexLinks = new RegExp('\\[(.*)\\]<(.*)>', 'gi');

    // replace links
    strMarkdown = strMarkdown.replace(regexLinks, '[$1](/page/$2)');
    strMarkdown = strMarkdown.replace(/\/{2,}/gi, '/');

    return strMarkdown;
}

// ********************************************************************************

/**
 * Page function to preprocess markdown for the sidebar.
 *
 * @param  {String} strMarkdown  string of source markdown
 * @param  {String} strPageName  string of the current page name
 * @return {String}              string of processed markdown
 */
function preprocessMarkdownSidebar(strMarkdown, strPageName) {

    // Regular expression to add the "**" to the current active link.
    var regexLink = new RegExp('(\[(.*)\]\(welcome.*\))', 'gi');

    strMarkdown = strMarkdown
        .replace(regexLink, '<a href="' + strPageName + '" class="active">$1</a>')
    ;

    return strMarkdown;
}

// ********************************************************************************

})(this);