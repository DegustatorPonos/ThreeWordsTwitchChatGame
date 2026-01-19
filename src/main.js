import { ReadSettings, Settings } from "./Settings.js";
import { Connect, PrintAuthLink, SetConnectCallback, twitchSocket } from "./Twitch/Connection.js";
import { config } from "dotenv";
import express from "express";
import { GetSelf } from "./Twitch/TwitchAPI.js";
import { SubscribeToMessages } from "./Twitch/EventSub.js";

config();
ReadSettings("Settings.json");

function main() {
    PrintAuthLink();
    const app = express();
    SetConnectCallback(onSocketConnect);

    app.get("/auth", Connect);

    app.listen(3000, () => {
        console.log("Server is up");
    });
}

main();

async function onSocketConnect() {
    await SubscribeToMessages(Settings.ChannelName);
    twitchSocket.addEventListener("message", ev => {
        console.log(JSON.parse(ev.data));
    });
}
