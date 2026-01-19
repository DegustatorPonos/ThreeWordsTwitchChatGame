import { ReadSettings } from "./Settings.js";
import { Connect, PrintAuthLink, SetConnectCallback, twitchSocket } from "./Twitch/Connection.js";
import { config } from "dotenv";
import express from "express";

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

function onSocketConnect() {
    twitchSocket.addEventListener("message", ev => {
        console.log(ev.data);
    })
}
