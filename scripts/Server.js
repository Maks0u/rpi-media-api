const express = require('express');
const cors = require('cors');
const exec = require('child_process').exec;

const { getMedia } = require('./functions');
const config = require('../config.json');
const corsOptions = config.corsOption;
const omxplayerOptions = config.omxplayerOptions;

// const timer = ms => new Promise(res => setTimeout(res, ms));

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
        this.app.get('/media/:type=:url', this.play.bind(this));
        this.app.get('/action/toggle=:action', this.toggle.bind(this));
    };

    run() {
        this.app.listen(this.port, this.host, () => console.log(`Server running on http://${this.host}:${this.port}`));
    }

    test(req, res) {

        console.log(`TEST`);

        res.status(200)
            .json('Hello world!')
            .end();
    };

    async play(req, res) {

        console.log('OPEN');

        const type = req.params.type;
        const url = req.params.url;
        const media = await this.media(url, type);
        if (media) {
            // this.player(media.url);
            res.status(200).json();
        } else {
            res.status(500).end();
        }
    }

    async media(url, type) {

        if (url && type) {
            switch (type) {
                case 'yt':
                    try {
                        const media = await getMedia(url);
                        exec(`lxterminal --geometry=140x34 -e omxplayer ${omxplayerOptions.join(' ')} "${media.url}"`, (error, stdout, stderr) => console.error(error));
                        return media;

                    } catch (error) {
                        console.error(error);
                        return null;
                    }

                case 'twitch':
                    try {
                        const decodedURI = decodeURI(url);
                        exec(`lxterminal --geometry=140x34 -e omxplayer ${omxplayerOptions.join(' ')} \`youtube-dl -g ${decodedURI}\``, (error, stdout, stderr) => console.error(error));
                        // await timer(15000);
                        return true;

                    } catch (error) {
                        console.error(error);
                        return null;
                    }

                default:
                    return null;
            }

        } else {
            return null;
        }
    }

    // player(streamURL) {
    //     exec(`lxterminal --geometry=140x34 -e omxplayer ${omxplayerOptions.join(' ')} "${streamURL}"`, (error, stdout, stderr) => console.error(error));
    // }

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
                key = 'minus';
                break
            case 'volumeup':
                key = 'plus';
                break;
            case 'stop':
                key = 'q';
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