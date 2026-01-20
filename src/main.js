import { ReadSettings, Settings } from "./Settings.js";
import { Connect, PrintAuthLink, SetConnectCallback, twitchSocket } from "./Twitch/Connection.js";
import { config } from "dotenv";
import express from "express";
import expressWs from "express-ws";
import { SubscribeToMessages } from "./Twitch/EventSub.js";
import { CurrentGame, HandleMessage } from "./Game/State.js";
import { RegisterFrontend } from "./Game/Render.js";

config();
await ReadSettings("Settings.json");
await CurrentGame.LoadWords();

function main() {
    PrintAuthLink();
    const app = express();
    expressWs(app);

    app.get("/auth", Connect);
    app.get("/startGame", (req, res) => {
        CurrentGame.Start();
        res.send({ OK: true });
    });
    RegisterFrontend(app);
    SetConnectCallback(onSocketConnect);

    app.listen(3000, () => {
        console.log("Server is up");
    });
}

main();

async function onSocketConnect() {
    await SubscribeToMessages(Settings.ChannelName);
    twitchSocket.addEventListener("message", ev => {
        var data = JSON.parse(ev.data);
        HandleMessage(data);
    });
}
