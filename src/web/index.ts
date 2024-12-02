import {createApp} from 'vue';
import {Player} from './player';
import PlayerComponent from './components/player.component.vue';

window.ready = new Promise((resolve, reject) => {
    window.onload = () => {
        const videoElem = document.getElementById('video');
        window.Player = new Player(videoElem!, window.captions);

        createApp({})
            .component('player', PlayerComponent)
            .mount('#player-controller');

        resolve();
    };
});
