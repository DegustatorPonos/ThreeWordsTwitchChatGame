var connections = []

/**
    * @param {Express} app 
    */
export function RegisterFrontend(app) {
    app.ws("/api/ws", (ws) => {
        console.log("WebSocket is open");
        connections.push(ws);
        ws.on("message", msg => {
            ws.send(`Server received: ${msg}`);
        });
        ws.on("close", () => {
            console.log("WebSocket connection closed");
            connections.filter(x => x != ws);
        })
    });
}

export function SendToFrontend(data) {
  connections.forEach(function (client) {
    client.send(JSON.stringify(data));
  });
}

export function DisplayGameStart() {
    SendToFrontend({
        Event: "GameStart"
    });
}

export function DisplayGameEnd(winnerUsername, words) {
    SendToFrontend({
        Event: "GameEnd",
        Username: winnerUsername,
        Message: words
    });
}

export function DisplayPartialGuess(user, result) {
    SendToFrontend({
        Event: "PartialGuess",
        Username: user,
        Message: result
    });
}
