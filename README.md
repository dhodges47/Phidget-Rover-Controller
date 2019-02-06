# Phidget-Rover-Controller
A controller system that uses NodeJS to control a 4-wheel rover robot with Raspberry Pi and Phidget DC Motor Controllers.
This controller system is written entirely in javascript using Nodejs. It allows you to remote control a 4 wheeled rover using a web page or a game controller.
It communicates with the rover using wi-fi.

![Stalker Rover](/www/Stalker.jpg)

**Hardware**

Raspberry Pi Model 3 Model B+

Nomad from ServoCity: https://www.servocity.com/nomad This is the rover's chassis. It includes 4 DC Motors.

 2 Phidget DC Motor Controllers ("PhidgetMotorControlerDC): https://www.phidgets.com/?tier=3&catid=18&pcid=15&prodid=1046
 
 Each controller handles 2 motors. These controllers monitor power surges and overheating, and connect to the Raspberry PI with a USB cable.
 
11.5 V LiPo Battery Pack https://www.amazon.com/Gens-ace-Battery-2200mAh-Airplane/dp/B00WJN4LG0

Power Distribution Block (PCB): https://www.amazon.com/gp/product/B01E5AXGV0/ref=ppx_yo_dt_b_asin_title_o01__o00_s00?ie=UTF8&psc=1

Various wires and cable ties.

Optional PS4-compatible game controller

Connections:

    Connect the ii.5 V LiPo battery to the PCB. From the PCB, connect the 11.5v pads to the two Phidget motor controllers.
    
    Connect the 5v pad to the Raspberry Pi, OR power the Pi using a separate 5v battery back.
    
    Connect the Phidget Motor Controllers to the Pi using USB cables. I like these because they retract and don't have to be tied down:
    
        https://www.amazon.com/gp/product/B002IUKPMS/ref=ppx_yo_dt_b_asin_title_o00__o00_s00?ie=UTF8&psc=1

**Software**

Raspberry Pi:

    Apache Web Server: https://www.raspberrypi.org/documentation/remote-access/web-server/apache.md
    
    Phidget Network Server: https://www.phidgets.com/docs/OS_-_Linux#Phidget_Network_Server
    
    The Phidget Software page has instructions on installing software
    
Laptop or Desktop Computer:

    I use Visual Studio Code for developing. Install the necessary extensions for NodeJS development.
    
    Socket.io
    
    pubsub.js
    
    If you aren't familiar with Phidget programming, this is a good place to start: https://www.phidgets.com/docs/Software_Overview
    
    You can run the controller software right from Visual Studio Code. It will start a web server, which you can connect to
    using the address VS Code gives you.
    
    The web page has controls to start and stop the rover, as well as controlling velocity and steering.
    
    In this repository, the bulk of the interesting code is in app.js and PhidgetServer.js.


**Project Notes**

I use express for the web server but very bare-bones. I didn't use the express generator.

I use socket.io for two-way communication with the webpage.

I use pubsub.js for messaging within the node app.

The phidgets documentation includes instructions on connecting to the Phidget Network Server on the Pi using wi-fi.


**Running the app**

You can run it with VS Code's debugger, or type

node ./app.js

on the command line.

Then open a browser to http://localhost:3000 to see the controller page.




**Components:**

1. Raspberry Pi interfaces with the Phidgets on the device

2. Host Server communicates with Rasp Pi vi Rasp Piâ€™s built-in web server.

3. Host server is a NodeJS application with the following functions:

    - Hosts a web page that has controls for the robot and readouts of the robotâ€™s telemetry
    
    - Handles events from the Motor Controllers via the jsPhidget22 interface library
    
     - Handles communication with the web page via the sockets.io library

---

**Web Page Has**

  Connect button
  
  Stop button

  Connection Status
  
  Slider for acceleration
  
  Slider for steering
    
  Velocity on each motor
    
  Voltage on each motor
  
  The web page will also detect the presence of a PS4-compatible game controller and will allow you to use the left stick for steering and the right stick for velocity.
