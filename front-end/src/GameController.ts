import Phaser, { Game, Scene } from 'phaser';
import { Client, EventsListener}  from './Client';
import { SuccessfullLogin, Login, Turn, Position,  CommandType, GameInfo, CreateGame, GameCreated, JoinGame, GameJoined, Command, TurnStarted, Player, PlayerMoved, PlayerDied, PlayerJoined, MovePlayer } from 'tr-common';
import { LoginScreen } from './gui/scene/LoginScreen';
import { ListGames } from './gui/scene/ListGames';
import { GameScene } from './gui/scene/GameScene';
import { Game as GameState } from 'tr-common';
import { PlayerHit } from 'tr-common/events';

enum Scenes {
    LOGIN_SCREEN = "Login Screen",
    LIST_GAMES = "List games",
    GAME = "Game"
}

export class GameController implements EventsListener
{
    config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600, 
        parent: 'game',
        dom: {
            createContainer: true,
        },
        scene: null
    }

    wsClient: Client;
    game: Phaser.Game;

    state: {
        userId: string;
        games: GameInfo[];
        game: GameState,
        currentPlayer: Player
        currentSetpPoints: number;
    }

    constructor(wsClient: Client)
    {
        this.wsClient = wsClient;
        this.wsClient.setEventListener(this);
        this.game = new Phaser.Game(this.config);

        this.state = {
            userId: undefined,
            games: [],
            game: null,
            currentPlayer: null,
            currentSetpPoints: 0
        }

        this.game.scene.add(Scenes.LOGIN_SCREEN, LoginScreen, true, this);
        this.game.scene.add(Scenes.LIST_GAMES, ListGames, false, this);
        this.game.scene.add(Scenes.GAME, GameScene, false, this);
    }

    login(userName: string) {
        const command: Login = {
            type: CommandType.LOGIN,
            userName
        }
        this.wsClient.send(command);
    }
    
    addGame(gameName: string) {
        const command: CreateGame = {
            type: CommandType.CREATE_GAME,
            gameName
        }
        this.wsClient.send(command);
    }

    join(gameId: string) {
        const command: JoinGame = {
            type: CommandType.JOIN_GAME,
            gameId
        }
        this.wsClient.send(command);
    }

    startGame() {
        const command: Command = {
            type: CommandType.START_GAME
        }
        this.wsClient.send(command);
    }

    movePlayer(path: Position[]) {
        const command: MovePlayer = {
            type: CommandType.MOVE,
            path,
        }
        this.wsClient.send(command);
    }

    onLoginSuccess(event: SuccessfullLogin): void {
        this.game.scene.stop(Scenes.LOGIN_SCREEN);
        this.game.scene.start(Scenes.LIST_GAMES);
        this.state.games = event.games;
        this.state.userId = event.userId;
    }

    onGameCreated(event: GameCreated): void {
        console.log(event);
        this.state.games.push({
            id: event.gameId,
            name: event.gameName
        })
    }

    onGameJoined(event: GameJoined): void {
        this.game.scene.stop(Scenes.LIST_GAMES);
        this.game.scene.start(Scenes.GAME);
        this.state.game = event.currentState;
        const turn : Turn = <Turn>this.state.game.currentTurn;
        
        if (!turn.currentlyPlaying) {
            return
        }

        this.state.currentPlayer = this.findPlayerById(turn.currentlyPlaying);
        this.state.currentSetpPoints = turn.stepPoints;
    }

    onNextTurn(event: TurnStarted): void {
        this.state.currentPlayer = this.findPlayerById(event.turn.currentlyPlaying);
        this.state.currentSetpPoints = event.turn.stepPoints;

        const s = <GameScene>(this.game.scene.getScene(Scenes.GAME));
            
        if (this.state.currentPlayer.userId === this.state.userId) {
            s.enableMoves();
        } else {
            s.disableMoves();
        }
    }

    onPlayerMoved(event: PlayerMoved) {
        this.findPlayerById(event.userId).position = event.pathUsed[event.pathUsed.length -1];
    }

    onPlayerHit(event: PlayerHit) {
        this.findPlayerById(event.userId).hp = event.currentHp;
    }

    onPlayerDied(event: PlayerDied) {
        const player = this.findPlayerById(event.userId);
        player.hp = event.hp;
        player.position = event.movedTo;
    }

    onGameFinished(event: import("tr-common").PlayerDied) {
        alert('Gra skończona!');
    }

    onPlayerJoined(event: PlayerJoined): void {
        this.state.game.players.push(event.player);
    }

    private findPlayerById(playerId): Player {
        return this.state.game.players.filter(player => {
            return player.userId === playerId
        })[0];
    }
}