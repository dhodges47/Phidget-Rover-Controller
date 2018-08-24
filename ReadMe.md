# Stalker Control Program using Socket.io

**Project Notes**

I use express for the web server but very bare-bones. I didn't use the express generator.


**Running the app**

You can run it with VS Code's debugger, or type
node ./app.js
on the command line.
Then open a browser to http://localhost:3000 to see the test page.

**To Do**
8/24/2018
I want to add the Phidget interface and get it talking to the Phidget controller via my Raspberry Pi.

Then I want to use socket.io to allow control of the Phidgets via the web page.

After that, I want to be able to use my game controller via the web page.

---


**Components:**

1. Raspberry Pi interfaces with the Phidgets on the device
2. Host Server communicates with Rasp Pi vi Rasp Pi’s built-in web server.
3. Host server is a NodeJS application with the following functions:
    1. Hosts a web page that has controls for the robot and readouts of the robot’s telemetry
    2. Handles events from the Motor Controllers via the jsPhidget22 interface library
    3. Handles communication with the web page via the sockets.io library 

---

**Web Page Has**

*Start button to make sure rover is online

*Sliders for acceleration and velocity
*Some kind of way to indicate steering

*Displays:

    *Status of each
    *Velocity on each motor
    *acceleration on each motor
    *voltage on each motor