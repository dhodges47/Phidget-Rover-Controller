const phidget22 = require('phidget22');
const express = require('express')
const pubsub = require('pubsub-js');
const app = express()
var debug = require('debug')('stalker:server');
const url = require('url');


const fs = require('fs');
const path = require('path');
const port = 3000
// pubsub topics
const roverconnection_command = "rcc" // send connect/disconnect commands from web page via sockets to phidget controller
const roverconnection_status = "rcs"  // send phidget connection status back to sockets controller to send to web page

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

    socket.on('connectStalker', function (data) {
      if (data == 'true') {
        console.log("connection request received")
        pubsub.publish(roverconnection_command, "connect");
        pubsub.subscribe(roverconnection_status, function (msg, data) {
          if (data == "connected") {
            socket.emit('connectionStatus', 'Stalker is connected');
          }
        });

      }
      else {
        console.log("disconnect request received")
        pubsub.publish(roverconnection_command, "disconnect");
        pubsub.subscribe(roverconnection_status, function (msg, data) {
          if (data == "disconnected") {
            socket.emit('connectionStatus', 'Stalker is not connected');
          }
        });

      }
    });
  });

}
const setConnectionStatus = function (status) {
  if (status == "on") {
    io.on('connection', function (socket) {
      {
        socket.emit('connectionStatus', 'Stalker is connected');
      }
    });
  }
}
const phidgetServer = function () {
  var conn = new phidget22.Connection(5661, 'raspberrypi.local');
  pubsub.subscribe(roverconnection_command, function (msg, data) {
    console.log(data)
    if (data == "connect") {
      conn.connect().then(function () {
        console.log('Connection connected');
        pubsub.publish(roverconnection_status, "connected");
        //	startMotors();
      }).catch(function (err) {
        console.log('failed to connect to server:' + err);
      });
    }
    else if (data == "disconnect")
    {
      conn.close()
        pubsub.publish(roverconnection_status, "disconnected");
    }
  });
  conn.onDisconnect(function () {
    pubsub.publish(roverconnection_status, "disconnected");
  });

}


//
// start up socket server for communication with web page
//
var io = require('socket.io').listen(server);
socketServer();
// for test:
//setConnectionStatus("on");
//
// startup phidget interface for communication with rover
//
phidgetServer();
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



