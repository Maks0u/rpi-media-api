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
        this.app.get('/media/:type=:url/:audioDevice', this.play.bind(this));
        this.app.get('/action/toggle=:action', this.toggle.bind(this));
        this.app.get('/shutdown=:option', this.shutdown.bind(this));
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

        const type = req.params.type;
        const url = req.params.url;
        const audioDevice = req.params.audioDevice;

        console.log(`PLAY type=${type} audio=${audioDevice} url=${url}`);

        const media = await this.media(url, type, audioDevice);

        if (media) {
            res.status(200).json();
        } else {
            res.status(500).end();
        }
    }

    async media(url, type, audioDevice) {

        let audioOutput = 'alsa';
        if (audioDevice == 1) {
            audioOutput = 'hdmi';
        } else if (audioDevice == 0) {
            audioOutput = 'local';
        }

        if (url && type) {
            switch (type) {
                case 'yt':
                    try {
                        const media = await getMedia(url);
                        exec(`lxterminal --geometry=140x34 -e omxplayer ${omxplayerOptions.join(' ')} -o ${audioOutput} "${media.url}"`, (error, stdout, stderr) => console.error(error));
                        return media;

                    } catch (error) {
                        console.error(error);
                        return null;
                    }

                case 'twitch':
                    try {
                        const decodedURI = decodeURI(url);
                        exec(`lxterminal --geometry=140x34 -e omxplayer ${omxplayerOptions.join(' ')} -o ${audioOutput} \`youtube-dl -g ${decodedURI}\``, (error, stdout, stderr) => console.error(error));
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

    shutdown() {
        const option = req.params.option;
        console.log(`shutdown ${option}`);
        switch (option) {
            case 'off':
                exec(`sudo shutdown 0`);
                break;
            case 'reboot':
                exec(`sudo shutdown -r 0`);
                break;

            default:
                break;
        }
    }

};

module.exports = { Server }