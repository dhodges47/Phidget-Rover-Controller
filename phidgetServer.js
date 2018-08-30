const phidget22 = require('phidget22');
const pubsub = require('pubsub-js');
const global = require('./constants');
const ch1 = new phidget22.DCMotor();
const ch2 = new phidget22.DCMotor();
const ch3 = new phidget22.DCMotor();
const ch4 = new phidget22.DCMotor();
exports.phidgetServer = function () {
    var conn = new phidget22.Connection(5661, 'raspberrypi.local');
    //
    // respond to connection commands
    //
    pubsub.subscribe(global.roverconnection_command, function (msg, data) {
        console.log(data)
        if (data == "connect") {
            conn.connect().then(function () {
                console.log('Phidget Server Connected');
                pubsub.publish(global.roverconnection_status, "connected");
                startMotors();
            }).catch(function (err) {
                console.log('failed to connect to server:' + err);
            });
        }
        else if (data == "disconnect") {
            conn.close()
            console.log('Phidget Server Disconnected');
            pubsub.publish(global.roverconnection_status, "disconnected");
        }
    });
    conn.onDisconnect(function () {
        pubsub.publish(global.roverconnection_status, "disconnected");
    });
    //
    // Respond to commands to the motors
    //
    pubsub.subscribe(global.rovervelocity_command, function (msg, data) {
        console.log(data);
        var newVelocity = data;
        if (ch1.getAttached() && ch2.getAttached() && ch3.getAttached() && ch4.getAttached()) {
            ch1.setTargetVelocity(newVelocity / 100);
            ch2.setTargetVelocity(newVelocity / 100);
            ch3.setTargetVelocity(newVelocity / 100);
            ch4.setTargetVelocity(newVelocity / 100);
            velocity = round(newVelocity / 100), 2;
        }
    });


    var startMotors = function () {
        // left side motors
        ch1.isRemote = true;
        ch1.setDeviceSerialNumber(485515);
        ch1.setChannel(0);
        ch1.onAttach = function () {
            console.log("Motor 0 attached");
        }
        ch1.onDetach = function () {
            console.log("Motor 0 detached");
        }

        ch2.isRemote = true;
        ch2.setDeviceSerialNumber(485515);
        ch2.setChannel(1);
        ch2.onAttach = function () {
            console.log("Motor 1 attached");
        }
        ch2.onDetach = function () {
            console.log("Motor 1 detached");

        }
        ch3.isRemote = true;
        ch3.setDeviceSerialNumber(486536);
        ch3.setChannel(0);
        ch3.onAttach = function () {
            console.log("Motor 2 attached");
        }
        ch3.onDetach = function () {
            console.log("Motor 2 detached");

        }
        ch4.isRemote = true;
        ch4.setDeviceSerialNumber(486536);
        ch4.setChannel(1);
        ch4.onAttach = function () {
            console.log("Motor 3 attached");
        }
        ch4.onDetach = function () {
            console.log("Motor 3 detached");

        }
        ch1.open().then(function (ch1) {
            console.log('channel 1 open');

            //var i = ch1.getMaxAcceleration();
            //console.log('Max Acceleration is ' + i);
            //var j = ch1.getMaxVelocity();
            //console.log('Max Velocity is ' + j);
            //ch1.setAcceleration(10);
            //ch1.setTargetVelocity(1);

        }).catch(function (err) {
            console.log('failed to open the channel:' + err);
        });
        //var ix1 = ch1.getAttached();
        //var ix2 = ch1.getAttached();
        //if (ix1) {
        //ch1.close();
        //console.log('channel 0 closed')
        //}
        // if (ix2) {
        //ch2.close();
        //console.log('channel 1 closed');
        // }
        ch2.open().then(function (ch2) {
            console.log('channel 2 open');
            //var i = ch2.getMaxAcceleration();
            // console.log('Max Acceleration is ' + i);
            // var j = ch2.getMaxVelocity();
            // console.log('Max Velocity is ' + j);
            // ch2.setAcceleration(10);
            // ch2.setTargetVelocity(1);

        }).catch(function (err) {
            console.log('failed to open the channel:' + err);
        });
        ch3.open().then(function (ch3) {
            console.log('channel 3 open');

        }).catch(function (err) {
            console.log('failed to open the channel:' + err);
        });
        ch4.open().then(function (ch4) {
            console.log('channel 4 open');

        }).catch(function (err) {
            console.log('failed to open the channel:' + err);
        });


    }
    function round(value, precision) {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }
}
