'use strict';

TABS.staticTab = {};
TABS.staticTab.initialize = function (staticTabName, callback) {
    var self = this;

    if (GUI.active_tab != staticTabName) {
        GUI.active_tab = staticTabName;
    }
    var tabFile = "./tabs/" + staticTabName + ".html";
    if (staticTabName == 'changelog') { tabFile = './changelog.html'; }

    $('#content').html('<div id="tab-static"></div>');
    $('#tab-static').load(tabFile, function () {
        // translate to user-selected language
        i18n.localizePage();

        GUI.content_ready(callback);
    });

};

// Unused, all the real tabs have one declared.
TABS.staticTab.cleanup = function (callback) {
    if (callback) callback();
};
