export function PrintAuthLink() {
    console.log(getAuthLink());
}

export var twitchSocket = null;
var OnConnect = () => {}

export function SetConnectCallback(callback) {
    OnConnect = callback;
}

export async function Connect(req, res) {
    console.log(req.query);
    res.write("thanks");
    var access_token = await exchangeCode(req.query.code);
    console.log(access_token);

    twitchSocket = new WebSocket("wss://eventsub.wss.twitch.tv/ws");
    OnConnect();
}

function getAuthLink() {
    return "https://id.twitch.tv/oauth2/authorize"+
        "?response_type=code"+
        `&client_id=${process.env.TWITCH_API_KEY}`+
        "&redirect_uri=http://localhost:3000/auth"+
        "&scope=user:read:chat+moderator:read:chatters"
}

async function exchangeCode(userCode) {
    var result = {xdx: "xdx"};
    var body = new URLSearchParams({
        client_id: process.env.TWITCH_API_KEY,
        client_secret: process.env.TWITCH_API_SECRET,
        code: userCode,
		grant_type: "authorization_code",
		redirect_uri: "http://localhost:3000/auth",
    }).toString();
    console.log(body);
    await fetch("https://id.twitch.tv/oauth2/token", {
        method: "POST",
        body: body,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    }).then(async resp => {
        await resp.json().then(obj => {
            result = obj;
        })
    })
    return result;
}
