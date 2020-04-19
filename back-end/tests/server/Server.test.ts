import 'mocha';
import assert from 'assert';
import { GameServiceSpy } from './spy/GameServiceSpy';
import { ChannelManagerSpy } from './spy/ChannelManagerSpy';
import { Server } from '../../src/server';
import { UserConnectionSpy } from './spy/UserConnectionSpy';
import { CreateGame, JoinGame, CommandType, EventType, GameJoined, Login, MovePlayer, Command }  from 'tr-common';

describe('Server', () => {
    let gameServiceSpy: GameServiceSpy;
    let channelManagerSpy: ChannelManagerSpy;
    let server: Server;

    beforeEach((done) => {
        gameServiceSpy = new GameServiceSpy;
        channelManagerSpy = new ChannelManagerSpy;
        server = Server.configure(
            gameServiceSpy,
            channelManagerSpy
        )
        done();
    })

    describe('handleMessaga with LOGIN', () => {
        it ('sets username for UserConnection', () => {
            const user = new UserConnectionSpy();
            const message: Login = {
                type: CommandType.LOGIN,
                userName: "some-username"
            }

            server.handleMesage(user, message); 

            assert.deepEqual(user.userName, message.userName);
        })

        it ('send the game list to the user', () => {
            const user = new UserConnectionSpy();
            const message: Login = {
                type: CommandType.LOGIN,
                userName: "some-user-name"
            }

            server.handleMesage(user, message);

            const receivedMessage = user.receivedMessages[0];
            assert.deepEqual(receivedMessage, {
                isError: false,
                origin: undefined,
                type: EventType.LOGIN_SUCCESS, 
                games: gameServiceSpy.gameListExample,
                userId: user.id
            })
        })

        it ('adds caller to the lobby channel', () => {
            const user = new UserConnectionSpy();
            const message: Login = {
                type: CommandType.LOGIN,
                userName: "Some user name"
            }

            server.handleMesage(user, message);

            const channelCall = channelManagerSpy.usersInChannels[0];

            assert.equal(channelCall.channelName, "lobby");
            assert.equal(channelCall.user, user);
        })

    })

    describe('handleMessage with CREATE GAME', () => {
        it ('creates channel for new game', () => {
            const user = new UserConnectionSpy();
            const message: CreateGame = {
                type: CommandType.CREATE_GAME,
                gameName: "some game name"
            }
    
            server.handleMesage(user, message); 
    
            const createdChannelName = channelManagerSpy.createdChannels[0];
            assert.equal(createdChannelName, gameServiceSpy.newGameId)
        })
    
        it ('calls game service to create game', () => {
            const user = new UserConnectionSpy();
            const message: CreateGame = {
                type: CommandType.CREATE_GAME,
                gameName: "some game name"
            }
            
            server.handleMesage(user, message); 
    
            const gameServiceCall = gameServiceSpy.createdGames[0];
            assert.deepEqual(message, gameServiceCall);
        })
    })
    
    describe('handleMessage with JOIN_GAME message', () => {
        it ('calls game service to add player', () => {
            const user = new UserConnectionSpy();
            user.userName = "some-user-name";
            user.id = "some-user-id"
            const message: JoinGame = {
                type: CommandType.JOIN_GAME,
                gameId: "some-game-id",
            }

            server.handleMesage(user, message);

            const gameServiceCall = gameServiceSpy.addedPlayers[0];
            assert.deepEqual(gameServiceCall, {
                gameId: "some-game-id",
                userId: user.id,
                userName: user.userName
            })
        })

        it ('sends game state that the player has joined', () => {
            const user = new UserConnectionSpy();
            user.userName = "some-user-name";
            user.id = "some-user-id"
            const message: JoinGame = {
                type: CommandType.JOIN_GAME,
                gameId: "some-game-id",
            }
            const expectedEvent: GameJoined = {
                type: EventType.GAME_JOINED,
                isError: false,
                currentState: gameServiceSpy.gameStateExample,
                origin: "some-game-id"
            }

            server.handleMesage(user, message);

            const receivedMessage = user.receivedMessages[0];
            assert.deepEqual(receivedMessage, expectedEvent);
        })

        it ('adds user to the joined game channel', () => {
            const user = new UserConnectionSpy();
            user.userName = "some-user-name";
            user.id = "some-user-id";
            const message: JoinGame = {
                type: CommandType.JOIN_GAME,
                gameId: "some-game-id"
            }

            server.handleMesage(user, message);

            const managerCall = channelManagerSpy.usersInChannels[0];
            
            assert.equal(managerCall.channelName, "some-game-id");
            assert.equal(managerCall.user, user);
        })

        it ('assigns gameId to the user', () => {
            const user = new UserConnectionSpy();
            user.userName = 'some-user-name';
            user.id = "some-user-id";

            const message: JoinGame = {
                type: CommandType.JOIN_GAME,
                gameId: "some-game-id"
            }

            server.handleMesage(user, message);

            assert.equal(user.gameId, "some-game-id");
        })
    })

    describe('handle message with REQUEST START', () => {
        it ('calls game service to process request', () => {
            const user = new UserConnectionSpy();
            user.userName = "some-user-name",
            user.id = "some-user-id";
            user.gameId = "some-game-id";
            const message: Command = {
                type: CommandType.START_GAME,
            }

            server.handleMesage(user, message);

            const serviceCall = gameServiceSpy.startRequests[0];

            assert.equal(serviceCall.gameId, user.gameId);
            assert.equal(serviceCall.userId, user.id);
        })
    })

    describe('hanelMessage with MOVEMENT', () => {
        it ('calls game service to process request', () => {
            const user = new UserConnectionSpy();
            user.gameId = "some-game-id";
            user.id = "some-user-id";
            const message: MovePlayer = {
                type: CommandType.MOVE,
                path: []
            }

            server.handleMesage(user, message);

            const serviceCall = gameServiceSpy.movedPlayers[0];

            assert.equal(serviceCall.gameId, user.gameId);
            assert.equal(serviceCall.userId, user.id);
            assert.deepEqual(serviceCall.path, []);
        })
    })

    describe('Connection lost', () => {
        it ('calls the game service to remove the player', () => {
            const user = new UserConnectionSpy();
            user.id = "some-user-id";
            user.gameId = "some-game-id";
            user.userName = "some-user-name";
            
            server.connectionLost(user);
            
            const serviceCall = gameServiceSpy.removedPlayers[0];

            assert.equal(serviceCall.userId, user.id);
            assert.equal(serviceCall.gameId, user.gameId);
            assert.equal(serviceCall.userName, user.userName);
        }),

        it ('removes user connection from game channel', () => {
            const user = new UserConnectionSpy();
            user.id = "some-user-id";
            user.gameId = "some-game-id";
            user.userName = "some-user-name";


            server.connectionLost(user);
            
            const serviceCall = channelManagerSpy.removedUsers[0];
            
            assert.equal(serviceCall.channelName, "some-game-id");
            assert.equal(serviceCall.userId, user.id);
        })

        it ('removes user connection from lobby channel', () => {
            const user = new UserConnectionSpy();
            user.id = "some-user-id";
            user.gameId = "some-game-id";
            user.userName = "some-user-name";

            server.connectionLost(user);

            const serviceCall = channelManagerSpy.removedUsers[1];

            assert.equal(serviceCall.channelName, "lobby");
            assert.equal(serviceCall.userId, user.id);
        })

        it ('does not remove user from game channel when not in game', () => {
            const user = new UserConnectionSpy();
            user.id = "some-user-id";
            user.userName = "some-user-name";

            server.connectionLost(user);

            const calls = channelManagerSpy.removedUsers;

            assert.equal(calls.length, 1);
            assert.equal(calls[0].channelName, "lobby");
        })

        it ('does not remove user form lobby channel when not logged in', () => {
            const user = new UserConnectionSpy();

            server.connectionLost(user);

            const calls = channelManagerSpy.removedUsers;

            assert.equal(calls.length, 0);
        })
    })    
})