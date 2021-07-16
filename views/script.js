// const config = require('../config.json');
// const baseURI = `http://${config.serverHost}:${config.serverPort}`;
// http://localhost:3000

function playurl() {
    const url = document.getElementById('url').value;
    fetch(`http://localhost:3000/open=${encodeURIComponent(url)}`)
        .then((response) => {
            console.log(response);
        }, (error) => {
            console.error(error);
        })
}

function toggle(action) {
    fetch(`http://localhost:3000/toggle=${action}`)
        .then((response) => {
            console.log(response);
        }, (error) => {
            console.error(error);
        });
}