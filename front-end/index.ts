import { Client } from  './src/Client';
import { GameController} from './src/GameController';

const url = process.env.SOCKET_URL;

const client: Client = new Client(url);
const controller: GameController = new GameController(client);