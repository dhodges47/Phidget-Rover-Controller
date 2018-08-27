const express = require('express')
const app = express()
var debug = require('debug')('stalker:server');
const url = require('url');


const fs = require('fs');
const path = require('path');
const port = 3000

app.use(express.static(__dirname + '/www'));
var http = require('http');



app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', function () {
  console.log('Listening to ', port);
});

const socketServer = function () {
  io.on('connection', function (socket) {
    console.log('user connected');
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
      console.log(data);
    });
    socket.on('chat message', function (data) {
      console.log(data);
    });
    socket.on('connectStalker', function (data) {
      if (data == 'true') {
        console.log("connection request received")
        socket.emit('connectionStatus', 'Stalker is connected');
      }
      else {
        console.log("disconnect request received")
        socket.emit('connectionStatus', 'Stalker is not connected');
      }
    });
  });

}
const setConnectionStatus = function(status) {
  if (status == "on") {
    io.on('connection', function (socket) {
      {
        socket.emit('connectionStatus', 'Stalker is connected');
      }
    });
  }
}
var io = require('socket.io').listen(server);
socketServer();
// for test:
setConnectionStatus("on");
  /**
   * Normalize a port into a number, string, or false.
   */

  function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
      // named pipe
      return val;
    }

    if (port >= 0) {
      // port number
      return port;
    }

    return false;
  }

  /**
   * Event listener for HTTP server "error" event.
   */

  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }



