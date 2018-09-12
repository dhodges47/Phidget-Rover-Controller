const phidget22 = require('phidget22');
const pubsub = require('pubsub-js');
const global = require('./constants');
const math = require('mathjs'); // for accurate math in the steering function

const ch1 = new phidget22.DCMotor();
const ch2 = new phidget22.DCMotor();
const ch3 = new phidget22.DCMotor();
const ch4 = new phidget22.DCMotor();

var velocity = 0.00; // current velocity before steering adjustments
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
                velocity = 0.00;
            }).catch(function (err) {
                console.log('failed to connect to server:' + err);
            });
        }
        else if (data == "disconnect") {
            conn.close();
            velocity = 0.00;
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
        if (conn.connected && ch1.getAttached() && ch2.getAttached() && ch3.getAttached() && ch4.getAttached()) {
            var newvelocity = math.round(math.divide(data, 100), 2);// save current velocity in global variable for steering reference point
            if (newvelocity != velocity) {
                velocity = newvelocity;
                ch1.setTargetVelocity(velocity);
                ch2.setTargetVelocity(velocity);
                ch3.setTargetVelocity(velocity);
                ch4.setTargetVelocity(velocity);
                console.log('Velocity change received, new Velocity is ' + velocity);
            }
        }
    });
    pubsub.subscribe(global.rovervelocity_statusrequest, function (msg, data) {
        getVelocity();
    });
    pubsub.subscribe(global.roversteering_command, function (msg, data) {
        console.log(data);
        var newVector = math.number(data);
        if (newVector != 0) {
            newVector = math.round(math.divide(newVector, 50), 2);
        }
        if (conn.connected && ch1.getAttached() && ch2.getAttached() && ch3.getAttached() && ch4.getAttached()) {
            // ch1 and ch2 are the right wheels
            // ch3 and ch4 are the left wheels
            console.log('NewVector: ' + newVector)
            var leftNewVelocity = 0.00;
            var rightNewVelocity = 0.00;

            if (newVector == 0) {
                // go straight at last registered velocity

                ch1.setTargetVelocity(velocity);
                ch2.setTargetVelocity(velocity);
                ch3.setTargetVelocity(velocity);
                ch4.setTargetVelocity(velocity);
                console.log("NewVector is 0, returning");
                return;
            }
            else if (newVector < 0) {
                // turn left
                if (velocity >= 0) {
                    newVector = math.abs(newVector);
                }
                console.log('left turn, vector is ' + newVector);
                rightNewVelocity = math.round(math.add(velocity, newVector), 2);
                rightNewVelocity = rightNewVelocity > 1 ? 1 : rightNewVelocity;
                leftNewVelocity = 0;
                console.log('Turning left, global velocity is ' + velocity);
                console.log('Turning left, new right velocity is ' + rightNewVelocity);
            }
            else {
                // turn right
                if (velocity < 0) {
                    newVector = - newVector;
                }
                console.log('right turn, vector is ' + newVector);
                rightNewVelocity = 0;
                leftNewVelocity = math.round(math.add(velocity, newVector), 2);
                leftNewVelocity = leftNewVelocity > 1 ? 1 : leftNewVelocity;
                console.log('Turning right, global velocity is ' + velocity);
                console.log('Turning right, new left velocity is ' + leftNewVelocity);
            }
            console.log('left velocity: ' + leftNewVelocity)
            console.log('right velocity: ' + rightNewVelocity)

            ch1.setTargetVelocity(rightNewVelocity);
            ch2.setTargetVelocity(rightNewVelocity);
            ch3.setTargetVelocity(leftNewVelocity);
            ch4.setTargetVelocity(leftNewVelocity);
        }
    });
    var startMotors = function () {
        // left side motors
        ch1.isRemote = true;
        ch1.setDeviceSerialNumber(486536);
        ch1.setChannel(0);
        ch1.onAttach = function () {
            console.log("Motor 0 attached");
        }
        ch1.onDetach = function () {
            console.log("Motor 0 detached");
        }

        ch2.isRemote = true;
        ch2.setDeviceSerialNumber(486536);
        ch2.setChannel(1);
        ch2.onAttach = function () {
            console.log("Motor 1 attached");
        }
        ch2.onDetach = function () {
            console.log("Motor 1 detached");

        }
        ch3.isRemote = true;
        ch3.setDeviceSerialNumber(485515);
        ch3.setChannel(0);
        ch3.onAttach = function () {
            console.log("Motor 2 attached");
        }
        ch3.onDetach = function () {
            console.log("Motor 2 detached");

        }
        ch4.isRemote = true;
        ch4.setDeviceSerialNumber(485515);
        ch4.setChannel(1);
        ch4.onAttach = function () {
            console.log("Motor 3 attached");
        }
        ch4.onDetach = function () {
            console.log("Motor 3 detached");

        }
        ch1.open().then(function (ch1) {
            console.log('channel 1 open');

        }).catch(function (err) {
            console.log('failed to open the channel:' + err);
        });
        ch2.open().then(function (ch2) {
            console.log('channel 2 open');
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
    var getVelocity = function () {
        var responseArray = new Array(4);
        if (conn.connected) {
            if (ch1.getAttached()) {
                _velocity = ch1.getTargetVelocity();
                responseArray[0] = _velocity;

            }
            if (ch2.getAttached()) {
                _velocity = ch2.getTargetVelocity();
                responseArray[1] = _velocity;
            }
            if (ch3.getAttached()) {
                _velocity = ch3.getTargetVelocity();
                responseArray[2] = _velocity;
            }
            if (ch4.getAttached()) {
                _velocity = ch4.getTargetVelocity();
                responseArray[3] = _velocity;
            }
        }
        pubsub.publish(global.rovervelocity_statusreport, responseArray);
    }
}
