import { AccessToken, WebSocketId } from "./Connection.js";
import { GetChannel, GetSelf } from "./TwitchAPI.js";

const PubSubEventURL = "https://api.twitch.tv/helix/eventsub/subscriptions"

export async function SubscribeToMessages(targetCahnnel) {
    var broadcasterId = (await GetChannel(targetCahnnel)).id;
    var userId = (await GetSelf()).id;
    if (userId == null || broadcasterId == null) {
        console.log("Failed to subscribe: unauthorized");
        return;
    }
    if (WebSocketId == undefined) {
        console.log("Failed to subscribe: no websocket ID");
        return;
    }
    await SubToEnent({
        type: "channel.chat.message",
        version: 1,
        condition: {
            broadcaster_user_id: broadcasterId,
            user_id: userId,
        },
        transport: {
            method: "websocket",
            session_id: WebSocketId,
        }
    });
}

async function SubToEnent(body) {
    if (AccessToken == undefined) return;
    fetch(PubSubEventURL, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${AccessToken}`,
            "Client-Id": process.env.TWITCH_API_KEY,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
}
