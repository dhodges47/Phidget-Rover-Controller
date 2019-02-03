
// pubsub topics
exports.roverconnection_command = "rcc" // send connect/disconnect commands from web page via sockets to phidget controller
exports.roverconnection_status = "rcs"  // send phidget connection status back to sockets controller to send to web page
exports.rovervelocity_command = "rvc"   // send velecity commands from web page via sockets to phidget controller
exports.roversteering_command = "rss"   // send steering command from web page via sockets to phidgets controller
exports.rovervelocity_statusrequest = "rvsreq"    // request motor velocity
exports.rovervelocity_statusreport = "rvrpt"    // report motor velocity
exports.errorreport = "errorrpt"    // report an error from the phidget controller to send to web page