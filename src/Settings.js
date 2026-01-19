import fs from "fs/promises";

export var Settings = null;

export function ReadSettings(path) {
    fs.readFile(path, 'utf8').then(res => {
        Settings = JSON.parse(res);
        console.log(Settings);
    }).catch(err => {
        throw err;
    });
}
