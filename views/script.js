const config = require('../config.json');
const baseURI = `http://${config.serverHost}:${config.serverPort}`;

function playurl() {
    const url = document.getElementById('url').value;
    fetch(`${baseURI}/open=${encodeURIComponent(url)}`)
        .then((response) => {
            console.log(response);
        }, (error) => {
            console.error(error);
        })
}

function toggle(action) {
    fetch(`${baseURI}/toggle=${action}`)
        .then((response) => {
            console.log(response);
        }, (error) => {
            console.error(error);
        });
}