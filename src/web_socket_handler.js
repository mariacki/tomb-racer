class UserConnection
{
    /**
     * @param {id} Number
     * @param {String} username
     * @param {WebScoket} connection
     */
    constructor(id, username, connection) {
        this.id = id; 
        this.username = username;
        this.connection = connection;
    }

    /**
     * 
     * @param {Object} message 
     */
    receive(message) {
        this.connection.send(JSON.stringify(message));
    }
}

class WebSocketHandler
{
    constructor() {
        this.nextUserId = 1;
        this.namedConnections = [];
    }

    /**
     * 
     * @param {WebSocket} webSocket 
     */
    handleConnection(webSocket) {
        const user = new UserConnection(
            this.nextUserId++,
            null, 
            webSocket
        );

        webSocket.on('message', this.handleMessage(user));
    }

    /**
     * 
     * @param {UserConnection} user 
     */
    handleMessage(user) {
        return (message) => {
            console.log(message);
            const command = JSON.parse(message);
            this.executeCommand(command, user);
        }
    }

    /**
     * 
     * @param {Object} command 
     * @param {UserConnection} issuer 
     */
    executeCommand(command, issuer) {
        console.log(command.type);
        switch(command.type) {
            case "LOGIN": this.handleLoginCommand(command, issuer); break;
            default: this.invalidCommandError(issuer, command.type);
        }
    }

    /**
     * 
     * @param {UserConnection} issuer 
     * @param {String} commandType
     */
    invalidCommandError(issuer, commandType) {
        issuer.receive({
            type: "INVALID-COMMAND-ERROR",
            command: commandType
        });
    }

    /**
     * 
     * @param {Object} command 
     * @param {UserConnection} issuer 
     */
    handleLoginCommand(command, issuer) {
        if (!command.username) {
            issuer.receive({
                type: "INVALID-USERNAME",
                message: "Username cannot be null"
            })
        }

        if (issuer.username) {
            issuer.receive({
                type: "INVALID-LOGIN", 
                message: "User already logged in"
            });
        }

        issuer.username = command.username;
        this.namedConnections.push(issuer);

        issuer.receive({
            type: "CORRECT-LOGIN",
            playerId: issuer.id
        });

        this.nofityAll({
            type: "PLAYER-JOINED",
            data: {
                userName: issuer.username,
                hp: 100
            }
        });
    }

    nofityAll(message) {
        this.namedConnections.forEach(connection => connection.receive(message));
    }
}

module.exports = {
    WebSocketHandler
}