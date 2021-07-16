const ytdl = require('ytdl-core');

async function getMedia(url) {
    const infos = await ytdl.getInfo(url);
    let format = { width: 0, bitrate: 0 };

    for (f of infos.formats) {
        if (f.videoCodec !== null && f.audioCodec !== null) {
            if (f.width > format.width) {
                format = f;
            }
        }
    }
    return { title: infos.player_response.videoDetails.title, quality: f.qualityLabel, url: format.url };
}

module.exports = {
    getMedia
}