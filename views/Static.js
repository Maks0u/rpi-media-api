const express = require('express');
const cors = require('cors');

const config = require('../config.json');
const corsOptions = config.corsOption;

class Static {
    constructor(host, port) {
        // app init
        this.app = express();
        this.host = host;
        this.port = port;

        // app config
        this.app.use(express.static(__dirname, ['html']));
        this.app.use(cors(corsOptions));

        // requests
        this.app.get('/', this.homepage.bind(this));
    };

    run() {
        this.app.listen(this.port, this.host, () => console.log(`Static running on port ${port}`));
    }

    homepage(req, res) {
        res.status(200)
            .sendFile('./views/index.html')
            .end();
    };
};

module.exports = { Static }