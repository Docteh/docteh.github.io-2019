/* Idea here is to implement serial with navigator.serial instead of chrome.serial */
'use strict';

var serial = {
    connected:       false,
    connectionId:    false,
    openRequested:   false,
    openCanceled:    false,
    bitrate:         0,
    bytesReceived:   0,
    bytesSent:       0,
    failed:          0,
    connectionType:  'serial', // 'serial' or 'tcp'
    connectionIP:    '127.0.0.1',
    connectionPort:  2323,

    transmitting:   false,
    outputBuffer:  [],

    logHead: 'SERIAL: ',

    lastWord: 'just for my own laziness'
}

function initializeSerialBackend() {
    if (navigator.serial) {
        GUI.log('we have navigator.serial');
        // Enabled just after analytics usually
        $('.connect_b a.connect').removeClass('disabled');

    }
    $('div.connect_controls a.connect').click(function () {
        GUI.log('bonk');
    });
}
