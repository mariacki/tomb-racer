"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const assert_1 = __importDefault(require("assert"));
const ChannelNotifierSpy_1 = require("./spy/ChannelNotifierSpy");
const event_dispatcher_1 = require("../../src/event_dispatcher");
const common_1 = require("../../../common");
describe('Event Dispatcher', () => {
    let channelNotifier;
    let eventDispatcher;
    beforeEach((done) => {
        channelNotifier = new ChannelNotifierSpy_1.ChannelNotifierSpy();
        eventDispatcher = new event_dispatcher_1.EventDispatcher(channelNotifier);
        done();
    });
    it('Sends event to the channel of event origin if its provided', () => {
        const event = {
            isError: false,
            type: common_1.EventType.PLAYER_MOVED,
            origin: "id1"
        };
        eventDispatcher.dispatch(event);
        const serviceCall = channelNotifier.notifications[0];
        assert_1.default.equal(serviceCall.channelName, "id1");
        assert_1.default.equal(serviceCall.message, event);
    });
    it('Send event to the lobby channel if origin is not provided', () => {
        const event = {
            isError: false,
            type: common_1.EventType.GAME_CREATED,
            origin: undefined
        };
        eventDispatcher.dispatch(event);
        const serviceCall = channelNotifier.notifications[0];
        assert_1.default.equal(serviceCall.channelName, "lobby");
        assert_1.default.equal(serviceCall.message, event);
    });
});
//# sourceMappingURL=EventDispatcher.test.js.map