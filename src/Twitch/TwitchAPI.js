import { AccessToken } from "./Connection.js";

const UserIdentityURL =  "https://api.twitch.tv/helix/users";

export async function GetChannel(username) {
    if (AccessToken == undefined) return;
    var outp = {};
    await fetch(`${UserIdentityURL}?login=${username}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${AccessToken}`,
            "Client-Id": process.env.TWITCH_API_KEY,
        }
    }).then(async resp => {
        await resp.json().then(obj => {
            outp = obj;
        });
    })
    if (outp.data.length < 1) {
        return null;
    }
    return outp.data[0];
}

export async function GetSelf() {
    if (AccessToken == undefined) return;
    var outp = {};
    await fetch(`${UserIdentityURL}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${AccessToken}`,
            "Client-Id": process.env.TWITCH_API_KEY,
        }
    }).then(async resp => {
        await resp.json().then(obj => {
            outp = obj;
        });
    });
    if (outp.data.length < 1) {
        return null;
    }
    return outp.data[0];
}
