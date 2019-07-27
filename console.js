'use strict';

//var serial = navigator.serial;
//reader.read().then(function(fij) { asdf=fij;let textDecoder = new TextDecoder(); t.io.print(textDecoder.decode(fij.value.buffer)); });
hterm.defaultStorage = new lib.Storage.Local();

var port;
var writer;
var reader;

let textEncoder = new TextEncoder();

let t = new hterm.Terminal();
t.onTerminalReady = () => {
console.log('Terminal ready.');
let io = t.io.push();

io.onVTKeystroke = str => {
    if (port.writable !== undefined) {
        writer.write(textEncoder.encode(str));
        //port.send(textEncoder.encode(str)).catch(error => {
        //  t.io.println('Send error: ' + error);
        //});
    }
};

    io.sendString = str => {
      if (port.writable !== undefined) {
        port.writable.write(str);
        //port.send(textEncoder.encode(str)).catch(error => {
        //  t.io.println('Send error: ' + error);
        //});
      }
    };
  };

  document.addEventListener('DOMContentLoaded', event => {
    let connectButton = document.querySelector('#connect');

    t.decorate(document.querySelector('#terminal'));
    t.setWidth(80);
    t.setHeight(24);
    t.installKeyboard();

    function connect() {
      t.io.println('Connecting to ' + port.device_.productName + '...');
      port.open().then(() => {
        console.log(port);
        t.io.println('Connected.');
        connectButton.textContent = 'Disconnect';
        port.onReceive = data => {
          let textDecoder = new TextDecoder();
          t.io.print(textDecoder.decode(data));
        }
        port.onReceiveError = error => {
          t.io.println('Receive error: ' + error);
        };
      }, error => {
        t.io.println('Connection error: ' + error);
      });
    };

    connectButton.addEventListener('click', async function() {
        console.log('hello there');
        let readLoop = () => {
            reader.read().then(value => {
                console.log(value);
                let textDecoder = new TextDecoder();
                t.io.print(textDecoder.decode(value.value.buffer)); 
                readLoop();
                }, error => {console.log(error);});
        };
        try {
            port = await navigator.serial.requestPort({});
            await port.open({baudrate: 115200 })
            writer = port.writable.getWriter();
            reader = port.readable.getReader();
            readLoop();
            console.log(port);
        } catch (error) {
            console.error(error);
        }
        /*
      if (port) {
        port.disconnect();
        connectButton.textContent = 'Connect';
        port = null;
      } else {
        serial.requestPort({baudrate: 115200}).then(selectedPort => {
console.log(selectedPort);
          port = selectedPort;
          connect();
        }).catch(error => {
          t.io.println('Connection error: ' + error);
        });
      }
      */
    });
/*
    serial.getPorts().then(ports => {
      if (ports.length == 0) {
        t.io.println('No devices found.');
      } else {
        port = ports[0];
        connect();
      }
    });
*/
  });

