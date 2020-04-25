"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const assert_1 = __importDefault(require("assert"));
const GameServiceSpy_1 = require("./spy/GameServiceSpy");
const ChannelManagerSpy_1 = require("./spy/ChannelManagerSpy");
const server_1 = require("../../src/server");
const UserConnectionSpy_1 = require("./spy/UserConnectionSpy");
const common_1 = require("../../../common");
describe('Server', () => {
    let gameServiceSpy;
    let channelManagerSpy;
    let server;
    beforeEach((done) => {
        gameServiceSpy = new GameServiceSpy_1.GameServiceSpy;
        channelManagerSpy = new ChannelManagerSpy_1.ChannelManagerSpy;
        server = server_1.Server.configure(gameServiceSpy, channelManagerSpy);
        done();
    });
    describe('handleMessaga with LOGIN', () => {
        it('sets username for UserConnection', () => {
            const user = new UserConnectionSpy_1.UserConnectionSpy();
            const message = {
                type: common_1.CommandType.LOGIN,
                userName: "some-username"
            };
            server.handleMesage(user, message);
            assert_1.default.deepEqual(user.userName, message.userName);
        });
        it('send the game list to the user', () => {
            const user = new UserConnectionSpy_1.UserConnectionSpy();
            const message = {
                type: common_1.CommandType.LOGIN,
                userName: "some-user-name"
            };
            server.handleMesage(user, message);
            const receivedMessage = user.receivedMessages[0];
            assert_1.default.deepEqual(receivedMessage, {
                isError: false,
                origin: undefined,
                type: common_1.EventType.LOGIN_SUCCESS,
                games: gameServiceSpy.gameListExample,
                userId: user.id
            });
        });
        it('adds caller to the lobby channel', () => {
            const user = new UserConnectionSpy_1.UserConnectionSpy();
            const message = {
                type: common_1.CommandType.LOGIN,
                userName: "Some user name"
            };
            server.handleMesage(user, message);
            const channelCall = channelManagerSpy.usersInChannels[0];
            assert_1.default.equal(channelCall.channelName, "lobby");
            assert_1.default.equal(channelCall.user, user);
        });
    });
    describe('handleMessage with CREATE GAME', () => {
        it('creates channel for new game', () => {
            const user = new UserConnectionSpy_1.UserConnectionSpy();
            const message = {
                type: common_1.CommandType.CREATE_GAME,
                gameName: "some game name"
            };
            server.handleMesage(user, message);
            const createdChannelName = channelManagerSpy.createdChannels[0];
            assert_1.default.equal(createdChannelName, gameServiceSpy.newGameId);
        });
        it('calls game service to create game', () => {
            const user = new UserConnectionSpy_1.UserConnectionSpy();
            const message = {
                type: common_1.CommandType.CREATE_GAME,
                gameName: "some game name"
            };
            server.handleMesage(user, message);
            const gameServiceCall = gameServiceSpy.createdGames[0];
            assert_1.default.deepEqual(message, gameServiceCall);
        });
    });
    describe('handleMessage with JOIN_GAME message', () => {
        it('calls game service to add player', () => {
            const user = new UserConnectionSpy_1.UserConnectionSpy();
            user.userName = "some-user-name";
            user.id = "some-user-id";
            const message = {
                type: common_1.CommandType.JOIN_GAME,
                gameId: "some-game-id",
            };
            server.handleMesage(user, message);
            const gameServiceCall = gameServiceSpy.addedPlayers[0];
            assert_1.default.deepEqual(gameServiceCall, {
                gameId: "some-game-id",
                userId: user.id,
                userName: user.userName
            });
        });
        it('sends game state that the player has joined', () => {
            const user = new UserConnectionSpy_1.UserConnectionSpy();
            user.userName = "some-user-name";
            user.id = "some-user-id";
            const message = {
                type: common_1.CommandType.JOIN_GAME,
                gameId: "some-game-id",
            };
            const expectedEvent = {
                type: common_1.EventType.GAME_JOINED,
                isError: false,
                currentState: gameServiceSpy.gameStateExample,
                origin: "some-game-id"
            };
            server.handleMesage(user, message);
            const receivedMessage = user.receivedMessages[0];
            assert_1.default.deepEqual(receivedMessage, expectedEvent);
        });
        it('adds user to the joined game channel', () => {
            const user = new UserConnectionSpy_1.UserConnectionSpy();
            user.userName = "some-user-name";
            user.id = "some-user-id";
            const message = {
                type: common_1.CommandType.JOIN_GAME,
                gameId: "some-game-id"
            };
            server.handleMesage(user, message);
            const managerCall = channelManagerSpy.usersInChannels[0];
            assert_1.default.equal(managerCall.channelName, "some-game-id");
            assert_1.default.equal(managerCall.user, user);
        });
        it('assigns gameId to the user', () => {
            const user = new UserConnectionSpy_1.UserConnectionSpy();
            user.userName = 'some-user-name';
            user.id = "some-user-id";
            const message = {
                type: common_1.CommandType.JOIN_GAME,
                gameId: "some-game-id"
            };
            server.handleMesage(user, message);
            assert_1.default.equal(user.gameId, "some-game-id");
        });
    });
    describe('handle message with REQUEST START', () => {
        it('calls game service to process request', () => {
            const user = new UserConnectionSpy_1.UserConnectionSpy();
            user.userName = "some-user-name",
                user.id = "some-user-id";
            user.gameId = "some-game-id";
            const message = {
                type: common_1.CommandType.START_GAME,
            };
            server.handleMesage(user, message);
            const serviceCall = gameServiceSpy.startRequests[0];
            assert_1.default.equal(serviceCall.gameId, user.gameId);
            assert_1.default.equal(serviceCall.userId, user.id);
        });
    });
    describe('hanelMessage with MOVEMENT', () => {
        it('calls game service to process request', () => {
            const user = new UserConnectionSpy_1.UserConnectionSpy();
            user.gameId = "some-game-id";
            user.id = "some-user-id";
            const message = {
                type: common_1.CommandType.MOVE,
                path: []
            };
            server.handleMesage(user, message);
            const serviceCall = gameServiceSpy.movedPlayers[0];
            assert_1.default.equal(serviceCall.gameId, user.gameId);
            assert_1.default.equal(serviceCall.userId, user.id);
            assert_1.default.deepEqual(serviceCall.path, []);
        });
    });
    describe('Connection lost', () => {
        it('calls the game service to remove the player', () => {
            const user = new UserConnectionSpy_1.UserConnectionSpy();
            user.id = "some-user-id";
            user.gameId = "some-game-id";
            user.userName = "some-user-name";
            server.connectionLost(user);
            const serviceCall = gameServiceSpy.removedPlayers[0];
            assert_1.default.equal(serviceCall.userId, user.id);
            assert_1.default.equal(serviceCall.gameId, user.gameId);
            assert_1.default.equal(serviceCall.userName, user.userName);
        }),
            it('removes user connection from game channel', () => {
                const user = new UserConnectionSpy_1.UserConnectionSpy();
                user.id = "some-user-id";
                user.gameId = "some-game-id";
                user.userName = "some-user-name";
                server.connectionLost(user);
                const serviceCall = channelManagerSpy.removedUsers[0];
                assert_1.default.equal(serviceCall.channelName, "some-game-id");
                assert_1.default.equal(serviceCall.userId, user.id);
            });
        it('removes user connection from lobby channel', () => {
            const user = new UserConnectionSpy_1.UserConnectionSpy();
            user.id = "some-user-id";
            user.gameId = "some-game-id";
            user.userName = "some-user-name";
            server.connectionLost(user);
            const serviceCall = channelManagerSpy.removedUsers[1];
            assert_1.default.equal(serviceCall.channelName, "lobby");
            assert_1.default.equal(serviceCall.userId, user.id);
        });
        it('does not remove user from game channel when not in game', () => {
            const user = new UserConnectionSpy_1.UserConnectionSpy();
            user.id = "some-user-id";
            user.userName = "some-user-name";
            server.connectionLost(user);
            const calls = channelManagerSpy.removedUsers;
            assert_1.default.equal(calls.length, 1);
            assert_1.default.equal(calls[0].channelName, "lobby");
        });
        it('does not remove user form lobby channel when not logged in', () => {
            const user = new UserConnectionSpy_1.UserConnectionSpy();
            server.connectionLost(user);
            const calls = channelManagerSpy.removedUsers;
            assert_1.default.equal(calls.length, 0);
        });
        it('removes game if no users left', () => {
            const user = new UserConnectionSpy_1.UserConnectionSpy();
            user.id = "some-user-id";
            user.gameId = "some-game-id";
            server.connectionLost(user);
            const call = gameServiceSpy.removedGames[0];
            assert_1.default.equal(call, user.gameId);
        });
        it('only removes the game when connection has gameId', () => {
            const user = new UserConnectionSpy_1.UserConnectionSpy();
            user.id = "some-user-id";
            server.connectionLost(user);
            const length = gameServiceSpy.removedGames.length;
            assert_1.default.equal(length, 0);
        });
    });
});
//# sourceMappingURL=Server.test.js.map