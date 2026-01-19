export function PrintAuthLink() {
    console.log(getAuthLink());
}

export var twitchSocket = null;
// The OAuth token that Twitch uses for auth
export var AccessToken = undefined;
// The token that came from the user
export var UserToken = undefined;
// The ID of the authorized user of the app
export var UserId = undefined;
// The ID of websocket connection
export var WebSocketId = undefined;

var OnConnect = () => {}

export function SetConnectCallback(callback) {
    OnConnect = callback;
}

export async function Connect(req, res) {
    console.log(req.query);
    res.write("thanks");
    var OAuth_resp = await exchangeCode(req.query.code);
    console.log(OAuth_resp);
    var access_token = OAuth_resp.access_token;
    AccessToken = access_token;
    UserToken = req.query.code;

    twitchSocket = new WebSocket("wss://eventsub.wss.twitch.tv/ws");
    twitchSocket.addEventListener("message", ev => {
        var data = JSON.parse(ev.data);
        console.log(data);
        if (data.metadata.message_type != "session_welcome") return;
        WebSocketId = data.payload.session.id;
    })
    setTimeout(() => {
        OnConnect();
    }, 1000)
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
