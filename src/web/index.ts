import {Player} from './player';

window.ready = new Promise((resolve, reject) => {
    window.onload = () => {
        const videoElem = document.getElementById('video');
        window.Player = new Player(videoElem!, window.captions);
        resolve();
    };
});