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
    pubsub.subscribe(global.rovervelocity_statusrequest, function (msg, data)
    {
            getVelocity();
    });
    pubsub.subscribe(global.roversteering_command, function (msg, data) {
        console.log(data);
        var newVector = data;
        if (newVector != 0) {
            newVector = newVector / 100;
        }
        if (ch1.getAttached() && ch2.getAttached() && ch3.getAttached() && ch4.getAttached()) {
            // ch1 and ch2 are the left wheels
            // ch3 and ch4 are the right wheels
            console.log('NewVector:' + newVector)
            var leftNewVelocity = 0;
            var rightNewVelocity = 0;

            var ch1Velocity = ch1.getTargetVelocity(); //get left side velocity
            var ch3Velocity = ch3.getTargetVelocity(); // get right side velocity
            var velocity = ((ch1Velocity > ch3Velocity) ? ch1Velocity : ch3Velocity); // save current velocity 
            if (newVector == 0) {
                // go straight
                ch1.setTargetVelocity(velocity);
                ch2.setTargetVelocity(velocity);
                ch3.setTargetVelocity(velocity);
                ch4.setTargetVelocity(velocity);
                return;
            }
            if (newVector > 0) {
                // turn right
                leftNewVelocity = (ch1Velocity + newVector) > 1 ? 1 : ch1Velocity + newVector;
                //ch2NewVelocity = (ch2Velocity - newVector) < -1 ? -1 : ch2Velocity - newVector;
                rightNewVelocity = velocity;
            }
            else {
                // turn left, newVector is negative
                //leftNewVelocity = (ch1Velocity + newVector) < -1 ? -1 : ch1Velocity + newVector;
                leftNewVelocity = velocity;
                rightNewVelocity = (ch3Velocity - newVector) > 1 ? 1 : ch3Velocity - newVector;
            }
            leftNewVelocity = round(leftNewVelocity, 1);
            rightNewVelocity = round(rightNewVelocity, 1);
            console.log('left velocity: ' + leftNewVelocity)
            console.log('right velocity: ' + rightNewVelocity)

            ch1.setTargetVelocity(leftNewVelocity);
            ch2.setTargetVelocity(leftNewVelocity);
            ch3.setTargetVelocity(rightNewVelocity);
            ch4.setTargetVelocity(rightNewVelocity);


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
    var getVelocity = function () {
        var responseArray = new Array(4);
        if (ch1.getAttached()) {
            velocity = ch1.getTargetVelocity();
            responseArray[0] = velocity;
           
        }
        if (ch2.getAttached()) {
            velocity = ch2.getTargetVelocity();
            responseArray[1] = velocity;
        } 
        if (ch3.getAttached()) {
            velocity = ch3.getTargetVelocity();
            responseArray[2] = velocity;
        } 
        if (ch4.getAttached()) {
            velocity = ch4.getTargetVelocity();
           responseArray[3] = velocity;
        }
        pubsub.publish(global.rovervelocity_statusreport, responseArray);
    }
    function round(value, precision) {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }
}
