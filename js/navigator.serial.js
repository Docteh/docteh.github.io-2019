/* Idea here is to implement serial with navigator.serial instead of chrome.serial */
'use strict';

//serial_backend.js
var mspHelper;
var connectionTimestamp;
//end of backend

let textEncoder = new TextEncoder();

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

    connectButton: async function () {
      // async seems to be a bad idea
      GUI.log('bonk');
      let readLoop = () => {
        serial.reader.read().then(value => {
          let textDecoder = new TextDecoder();
          if (!CONFIGURATOR.cliActive) {
            MSP.read({data: value.value.buffer});
          } else if (CONFIGURATOR.cliActive) {
            TABS.cli.read({data: value.value.buffer});
          }
          readLoop();
        }, error => {console.log(error);});
      };
      try {
        var port;
        port = await navigator.serial.requestPort({});
        console.log(port);
        // help command requires more than 3000 bytes 4096 8192
        await port.open({baudrate: 115200, buffersize: 8192 });
        serial.portObject = port; // Might not work
        console.log(port);
        serial.writer = port.writable.getWriter();
        serial.reader = port.readable.getReader();
        serial.connected=true;
/*
        FC.resetState();
        MSP.listen(update_packet_error);
        mspHelper = new MspHelper();
        MSP.listen(mspHelper.process_data.bind(mspHelper));
*/
        readLoop();
        onOpen(true);
        //console.log(port);
      } catch (error) {
          console.error(error);
      }

    },
    send: function (data, callback) {
      //console.log('serial.send()',data,callback);
      serial.writer.write(data);
    },
    onReceive: {
      addListener: function() {
        //do nothing
      }
    },
    lastWord: 'just for my own laziness'
}

//function initializeSerialBackend() {
initializeSerialBackend = function() {
    if (navigator.serial) {
        GUI.log('we have navigator.serial');
        // Enabled just after analytics usually
        $('.connect_b a.connect').removeClass('disabled');

    } else {
        GUI.log('navigator.serial not available, requires chrome 77+ and a flag');
    }
    $('div.connect_controls a.connect').click(serial.connectButton);
}

function closeCleanGUI () {
    // from finishClose in serial_backend.js
    MSP.disconnect_cleanup();

    GUI.connected_to = false;
    GUI.allowedTabs = GUI.defaultAllowedTabsWhenDisconnected.slice();
    // Reset various UI elements
    $('span.i2c-error').text(0);
    $('span.cycle-time').text(0);
    if (semver.gte(CONFIG.apiVersion, "1.20.0"))
        $('span.cpu-load').text('');
    // reset connect / disconnect button
    $('div.connect_controls a.connect').removeClass('active');
    $('div.connect_controls a.connect_state').text(i18n.getMessage('connect'));

    // reset active sensor indicators
    sensor_status(0);
    $('#tabs .tab_landing a').click();
}
