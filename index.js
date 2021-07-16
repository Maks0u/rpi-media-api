// imports
const { Server } = require('./scripts/Server');
const { Static } = require('./views/Static');

// properties
const server = new Server();
const serverPort = 3000;
const static = new Static();
const staticPort = 80;

// run
server.listen(serverPort);
static.listen(staticPort);