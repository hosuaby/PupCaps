import {Caption} from '../common/caption';
import {Player} from '../web/player';

declare global {
    interface Window {
        captions: Caption[];
        ready: Promise<void>;
        Player: Player;
    }
}