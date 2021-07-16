const express = require('express');
const cors = require('cors');
const exec = require('child_process').exec;

const { getMedia } = require('./functions');
const config = require('../config.json');
const corsOptions = config.corsOption;
const omxplayerOptions = config.omxplayerOptions;

class Server {
    constructor(host, port) {
        // app init
        this.app = express();
        this.host = host;
        this.port = port;

        // app config
        this.app.use(express.json());
        this.app.use(cors(corsOptions));

        // requests
        this.app.get('/', this.test.bind(this));
        this.app.get('/open=:url', this.open.bind(this));
        this.app.get('/toggle=:action', this.toggle.bind(this));
    };

    run() {
        this.app.listen(this.port, this.host, () => console.log(`Server running on port ${port}`));
    }

    test(req, res) {

        console.log(`TEST`);

        res.status(200)
            .json('Hello world!')
            .end();
    };

    async open(req, res) {

        console.log('OPEN');

        const url = req.params.url;
        const media = await this.play(url);
        if (media) {
            res.status(200).json();
        } else {
            res.status(500).end();
        }
    }

    async play(url) {

        if (url) {
            try {
                const media = await getMedia(url);
                exec(`lxterminal --geometry=140x34 -e omxplayer ${omxplayerOptions.join(' ')} "${media.url}"`, (error, stdout, stderr) => console.error(error));
                return media;

            } catch (error) {
                console.error(error);
                return null;
            }

        } else {
            return null;
        }
    }

    toggle(req, res) {

        const action = req.params.action;
        console.log(`toggle ${action}`);

        let key = null;
        switch (action) {
            case 'playpause':
                key = 'space';
                break;
            case 'backward':
                key = 'Left';
                break;
            case 'forward':
                key = 'Right';
                break;
            case 'volumedown':
                key = 'Down';
                break
            case 'volumeup':
                key = 'Up';
                break;

            default:
                break;
        }

        if (key) {
            exec(`xdotool key ${key}`);
            res.status(200).end();
        } else {
            res.status(500).end();
        }
    }

};

module.exports = { Server }