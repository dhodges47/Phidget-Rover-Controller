# Phidget-Rover-Controller
A controller system that uses NodeJS to control a 4-wheel rover robot with Raspberry Pi and Phidget DC Motor Controllers

**Project Notes**

I use express for the web server but very bare-bones. I didn't use the express generator.


**Running the app**

You can run it with VS Code's debugger, or type
node ./app.js
on the command line.
Then open a browser to http://localhost:3000 to see the test page.


**Components:**

1. Raspberry Pi interfaces with the Phidgets on the device
2. Host Server communicates with Rasp Pi vi Rasp Piâ€™s built-in web server.
3. Host server is a NodeJS application with the following functions:
    1. Hosts a web page that has controls for the robot and readouts of the robotâ€™s telemetry
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
