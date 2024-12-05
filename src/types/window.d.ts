import {Caption} from '../common/caption';
import {Player} from '../web/player';
import {PlayerArgs} from '../common/player-args';

declare global {
    interface Window {
        captions: Caption[];
        ready: Promise<void>;
        playerArgs: PlayerArgs;
        Player: Player;
    }
}