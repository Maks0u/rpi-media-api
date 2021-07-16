const express = require('express');
const cors = require('cors');
const exec = require('child_process').exec;

const { getMedia } = require('./functions');
const config = require('./config.json');

const corsOptions = config.corsOption;
const omxplayerOptions = config.omxplayerOptions;
const host = config.host;

class Server {
    constructor() {
        // app init
        this.app = express();

        // app config
        this.app.use(express.json());
        this.app.use(cors(corsOptions));

        // requests
        this.app.get('/', this.test.bind(this));
        this.app.post('/play', this.play.bind(this));
    };

    listen(port) {
        this.app.listen(port, host, () => console.log(`Server running on port ${port}`));
    }

    test(req, res) {
        console.log(`TEST`);
        res.status(200)
            .json('Hello world!')
            .end();
    };

    async play(req, res) {
        console.log(`PLAY`);
        const url = req.body.url;

        if (url) {

            const media = await getMedia(url);
            res.status(200)
                .json(media)
                .end();

            exec(`omxplayer ${omxplayerOptions.join(' ')} "${media.url}"`, (error, stdout, stderr) => console.error(error));

        } else {
            res.status(500).end();
        }
    }
};

module.exports = { Server }