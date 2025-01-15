import {Caption} from '../common/captions';
import {Player} from '../player/player';
import {PlayerArgs} from '../common/player-args';

declare global {
    interface Window {
        captions: Caption[];
        ready: Promise<void>;
        playerArgs: PlayerArgs;
        Player: Player;
    }
}