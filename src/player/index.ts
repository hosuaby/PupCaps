import {createApp} from 'vue';
import {Player} from './player';
import PlayerComponent from './components/player.component.vue';
import {CssProcessor} from './css-processor';
import {CaptionRenderer} from './caption-renderer';

window.ready = new Promise((resolve, reject) => {
    window.onload = () => {
        const videoElem = document.getElementById('video');
        const cssProcessor = new CssProcessor();
        const renderer = new CaptionRenderer(cssProcessor);
        window.Player = new Player(videoElem!, window.captions, cssProcessor, renderer);

        if (window.playerArgs.isPreview) {
            createApp({})
                .component('player', PlayerComponent)
                .mount('#player-controller');
        }

        resolve();
    };
});
