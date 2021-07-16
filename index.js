// imports
const { Server } = require('./scripts/Server');
const { Static } = require('./views/Static');
const config = require('./config.json');

// properties
const server = new Server(config.serverHost, config.serverPort);
const static = new Static(config.staticHost, config.staticPort);

// run
server.run();
static.run();