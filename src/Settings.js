import fs from "fs/promises";

export var Settings = null;

export async function ReadSettings(path) {
    await fs.readFile(path, 'utf8').then(res => {
        Settings = JSON.parse(res);
    }).catch(err => {
        throw err;
    });
}
