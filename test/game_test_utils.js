const eventsListenerSpy = () => {
    return {
        onPlayerAdded(player) { this.player = player},
        onGameStarted(gameStarted) { this.gameStarted = gameStarted }
    }
}

const Users = {
    userOne: {userId: 1, userName: "a"},
    userTwo: {userId: 2, userName: "b"},
    userThree: {userId: 3, userName: "c"},
    userFour = {userId: 4, userName: "d"} 
}

module.exports = {
    eventsListenerSpy,
    Users
}