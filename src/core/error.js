const joinError = () => {
    return {
        type: "JOIN-ERROR",
        message: "Maximum number of players exceeded"
    }
}

const invalidUserFinishinTrun = () => {
    return {
        type: 'INVALID-USER-FINISHING-TURN'
    }
}

const cannotMoveGameNotStarted = () => {
    return {
        type: "CANNOT-MOVE-PLAYER-GAME-NOT-STARTED"
    }
}

const invalidUserMoving = () => {
    return {
        type: "INVALID-USER-MOVING"
    }
}

const moveExceedsDistance = () => {
    return {
        type: "MOVE-EXCEEDS-DISTANCE"
    }
}

module.exports = {
    joinError, 
    invalidUserFinishinTrun, 
    cannotMoveGameNotStarted, 
    invalidUserMoving,
    moveExceedsDistance
}