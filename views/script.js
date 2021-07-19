// const config = require('../config.json');
// const baseURI = `http://${config.serverHost}:${config.serverPort}`;
// http://localhost:3000

function play(type) {
    const url = document.getElementById('url').value;
    fetch(`http://192.168.43.79:3000/media/${type}=${encodeURIComponent(url)}`)
        .then((response) => {
            console.log(response);
        }, (error) => {
            console.error(error);
        })
}

function toggle(action) {
    fetch(`http://192.168.43.79:3000/action/toggle=${action}`)
        .then((response) => {
            console.log(response);
        }, (error) => {
            console.error(error);
        });
}

function shutdown() {
    fetch(`http://192.168.43.79:3000/shutdown`);
}