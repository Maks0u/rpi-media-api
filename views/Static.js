const express = require('express');
const cors = require('cors');

const config = require('../config.json');

const corsOptions = config.corsOption;
const host = config.host;

class Static {
    constructor() {
        // app init
        this.app = express();

        // app config
        this.app.use(express.static(__dirname, ['html']));
        this.app.use(cors(corsOptions));

        // requests
        this.app.get('/', this.homepage.bind(this));
    };

    listen(port) {
        this.app.listen(port, host, () => console.log(`Static running on port ${port}`));
    }

    homepage(req, res) {
        res.status(200)
            .sendFile('./views/index.html')
            .end();
    };
};

module.exports = { Static }