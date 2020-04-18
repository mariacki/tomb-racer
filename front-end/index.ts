import { Client } from  './src/Client';
import { GameController} from './src/GameController';

const client: Client = new Client("ws://localhost:8080");
const controller: GameController = new GameController(client);