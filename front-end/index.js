const connection = new WebSocket("ws://localhost:8080");

const gameState = {
    userId: null,
    selectedGame: null,
    gamesList: [],
    joinedGame: {},
    path: [],
    clickables: []
}

connection.onmessage = (message) => {
    const event = JSON.parse(message.data);
    console.info(event);

    switch (event.type) {
        case "LOGIN-SUCCESS": loginSuccess(event); break;
        case "GAME-CREATED": onGameCreated(event); break;
        case "GAME-JOINED": onGameJoined(event); break;
        case "PLAYER-JOINED": onPlayerJoined(event); break;
        case "GAME-STARTED": onGameStarted(event); break;
        case "PLAYER-MOVED": onPlayerMoved(event); break;
        case "NEXT-TURN": onNextTurn(event); break;
        case "PLAYER-DIED": onPlayerDied(event); break;
        case "PLAYER-HIT": onPlayerHit(event); break;
        case "GAME-FINISHED": onGameFinished(event); break;
    }

    console.log(gameState);
}

function onGameFinished(event) {
    const winner = gameState.selectedGame.players.filter((p) => {
        return p.userId === event.data.winner
    })[0];

    alert('Wygrał: ' + winner.userName);
}

function onPlayerHit(event) {
    const deadPlayer = gameState.selectedGame.players.filter((p) => {
        return p.userId === event.data.userId
    })[0];

    deadPlayer.hp = event.data.currentHp;

    renderPlayerList();    
}

function onPlayerDied(event) {
    
    const deadPlayer = gameState.selectedGame.players.filter(p => {
        return p.userId === event.data.userId
    })[0];

    alert('Gacz: ' + deadPlayer.userName + 'wraca na start');

    deadPlayer.hp = 100;
    deadPlayer.position = event.data.movedTo;
    renderBoard();
}

function loginSuccess(event) {
    gameState.userId = event.userId;
    gameState.gamesList = event.games;
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('game-form').classList.remove('hidden');
    renderGamesList();
}

function onGameCreated(event) {
    gameState.gamesList.push(event.data);
    renderGamesList();
}

function onGameJoined(event) {
    gameState.selectedGame = event.game;

    document.getElementById('game-form').classList.add('hidden');
    document.getElementById('board-form').classList.remove('hidden');

    renderBoard();
}

function onPlayerJoined(event) {
    const player = event.data.player;
    if (player.userId == gameState.userId) {
        return;
    }

    gameState.selectedGame.players.push(player);
    renderPlayers();
}

function onGameStarted(event) {
    gameState.selectedGame.currentTurn = event.data.turn;
    updateTurn();
}

function onPlayerMoved(event) {
    const playerId = event.data.userId;
    const newPosition = event.data.position;

    const player = gameState.selectedGame.players.filter((p) => {
        return p.userId == playerId;
    })[0];

    player.position = newPosition;
    
    renderBoard();
}

function onNextTurn(event) {
    gameState.selectedGame.currentTurn = event.data.turn;
    updateTurn();
} 

function updateTurn() {
    console.log("Current turn", gameState.selectedGame.currentTurn);
    const go = document.getElementById('btn-go'); 
    go.setAttribute('disabled', true);

    const playingUser = gameState.selectedGame.players.filter((player) => {
        return player.userId === gameState.selectedGame.currentTurn.userId;
    })[0];

    document.getElementById('turn-info').innerText = `
        Teraz gra ${playingUser.userName}, z ${gameState.selectedGame.currentTurn.stepPoints} 
    `;

    go.classList.remove('hidden');

    if (gameState.selectedGame.currentTurn.userId == gameState.userId) {
        gameState.path = [];  
        setClicables(playingUser.position)
    }
}

function setClicables(pos) {
    clearClickables();
    console.log('Setting clickables of pos', pos)
    const up = {
        row: pos.row - 1,
        col: pos.col
    }

    const down = {
        row: pos.row + 1,
        col: pos.col 
    }

    const left = {
        row: pos.row,
        col: pos.col - 1
    }

    const right = {
        row: pos.row,
        col: pos.col + 1
    }

    const toCheck = [up, down, left, right];
    console.log(toCheck);
    const tiles = gameState.selectedGame.board;
    for (let addr of toCheck) {
        if (!tiles[addr.row]) {
            continue;
        }

        if (!tiles[addr.row][addr.col]) {
            continue;
        }

        if (tiles[addr.row][addr.col].type == "WALL") {
            continue;
        }

        const element = document.getElementById(`${addr.row}_${addr.col}`);

        gameState.clickables.push(element);
        element.classList.add('clickable');
        element.onclick = () => {            
            element.classList.add('selected');
            gameState.path.push(addr);
            
            console.log("Path length", gameState.path.length);
            console.log("Setps", )

            if (gameState.path.length == gameState.selectedGame.currentTurn.stepPoints) {
                clearClickables();
                document.getElementById('btn-go').removeAttribute('disabled');
                return;
            }

            setClicables(addr);
        }       
    }
}

function clearClickables() {
    for (element of gameState.clickables) {
        element.onclick = () => {}
        element.classList.remove('clickable');
    }
    gameState.clickables = [];
}

function renderGamesList() {
    const select = document.getElementById("select-game-list");
    let optionsString = "";

    for (let game of gameState.gamesList) {
        const option = `
            <option value="${game.gameId}">${game.gameName}</option>
        `;
        optionsString += option;
    }

    select.innerHTML = optionsString;
}

function renderBoard() {
    renderTiles();
    renderPlayers();
}

function renderTiles() {
    const tiles = gameState.selectedGame.board;
    const symbols = {
        "STARTING_POINT": {class: "walkable", symbol: "*"},
        "PATH": {class: "walkable", symbol: "$"},
        "SPIKES": {class: "walkable", symbol: "^"},
        "WALL": {class: "wall", symbol: "#"},
        "FINISH_POINT": {class: "finish", symbol: "!"}
    }

    let tileString = "";

    console.log(tiles);

    for (let i = 0; i < tiles.length; i++) {
        let tileRowString = "";
        for (let j = 0; j < tiles[i].length; j++) {
            const tile = tiles[i][j];
            console.log(tile);
            const cssClass = symbols[tile.type].class;
            const symbol = symbols[tile.type].symbol;

            const spanStr = `
                <span 
                    class="tile ${cssClass}"
                    id="${i}_${j}"
                >
                    ${symbol}
                </span>
            `
            tileRowString += spanStr;
        }
        tileRowString += "<br>";
        tileString += tileRowString;
    }
    document.getElementById('tiles').innerHTML = tileString;
}

function renderPlayers() {
    renderPlayerList();
    const players = gameState.selectedGame.players;

    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        const playerSymbol = i+1;
        document.getElementById(`${player.position.row}_${player.position.col}`).innerText = playerSymbol;
    }
}

function renderPlayerList() {
    const players = gameState.selectedGame.players;
    let playerList = "";

    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        const playerSymbol = i+1;
        let cssClass =  "";
        if (player.userId == gameState.userId) {
            cssClass = "clickable";
        }

        const playerListElem = `
            <span class="player-list-elem ${cssClass}">
                ${player.userName} (${playerSymbol}): ${player.hp}
            </span>
            <br>
        `

        playerList += playerListElem;
    }

    document.getElementById('player-list').innerHTML = playerList;
}

document.getElementById('btn-login').onclick = function () {
    login(connection, document.getElementById('txt-username').value);
}

document.getElementById('btn-add-game').onclick = function () {
    createGame(connection, document.getElementById('txt-game-name').value)
}

document.getElementById('btn-join').onclick = function () {
    joinGame(connection, document.getElementById('select-game-list').value);
}

const btnStart = document.getElementById('btn-start');
btnStart.onclick = function () {
    startGame(connection);
    btnStart.remove();
}

document.getElementById('btn-go').onclick = function () {
    movePlayer(connection, gameState.path);
    clearSelected();
}

function clearSelected() {
    clearClickables();
    for (addr of gameState.path) {
        document.getElementById(`${addr.row}_${addr.col}`).classList.remove('selected');
    }

    gameState.path = [];
}

