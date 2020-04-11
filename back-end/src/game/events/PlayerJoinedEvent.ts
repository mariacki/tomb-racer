import * as contract from '../contract'
import { Game, Player} from './../model';

export default class PlayerJoinedEvent extends contract.events.Event
{
    constructor(player: Player, gameId: string) {
        super(
            contract.events.EventType.PLAYER_JOINED,
            {
                gameId,
                player: {
                    userId: player.userId,
                    userName: player.userName,
                    hp: 100, 
                    inventory: []
                } 
            }
        )
    }
}