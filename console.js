'use strict';

hterm.defaultStorage = new lib.Storage.Local();

var port;
var writer;
var reader;

let textEncoder = new TextEncoder();

let t = new hterm.Terminal();
t.onTerminalReady = () => {
  console.log('Terminal ready.');
  t.io.println('This currently requires a fairly recent build of chrome with a particular flag enabled');
  t.io.println('Try Chrome 77+ Canary, possibly Dev channel');
  t.io.println('For a betaflight flight controller, click connect, follow through and then type #');
  //t.io.println('chrome://flags/#enable-experimental-web-platform-features');
  let io = t.io.push();

  io.onVTKeystroke = str => {
    if (port && port.writable !== undefined) {
        writer.write(textEncoder.encode(str));
        //port.send(textEncoder.encode(str)).catch(error => {
        //  t.io.println('Send error: ' + error);
        //});
    }
  };

  io.sendString = str => {
    if (port.writable !== undefined) {
      writer.write(textEncoder.encode(str));
      //port.send(textEncoder.encode(str)).catch(error => {
      //  t.io.println('Send error: ' + error);
      //});
    }
  };
};

document.addEventListener('DOMContentLoaded', event => {
  let connectButton = document.querySelector('#connect');

  t.decorate(document.querySelector('#terminal'));
  t.setWidth(100);
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
      //console.log('hello there');
      // Will this loop cause a stack overflow?
      let readLoop = () => {
        reader.read().then(value => {
          //console.log(value);
          let textDecoder = new TextDecoder();
          t.io.print(textDecoder.decode(value.value.buffer)); 
          readLoop();
        }, error => {console.log(error);});
      };
      try {
          port = await navigator.serial.requestPort({});
          // help command requires more than 3000 bytes 4096 8192
          await port.open({baudrate: 115200, buffersize: 8192 })
          writer = port.writable.getWriter();
          reader = port.readable.getReader();
          readLoop();
          //console.log(port);
      } catch (error) {
          console.error(error);
      }
  });
});

