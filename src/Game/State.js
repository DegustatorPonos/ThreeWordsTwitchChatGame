import fs from "fs/promises";
import { Settings } from "../Settings.js";
import { assert, trace } from "console";

class Tuple {
    words;
    /**
        * @param {string[]} words 
        */
    constructor(words) {
        this.words = words;
    }

    GetRegex() {
        var outp = "";
        for (let i = 0; i < this.words.length; i++) {
            if (i != 0) {
                outp += ".+"
            }
            outp += this.words[i];
        }
        return new RegExp(outp, "gi")
    }
}

class Game {
    isActive;
    sessionId;
    Task;
    words;

    constructor() {
        this.isActive = false;
        this.sessionId = 0;
        this.Task = null;
        this.words = []
    }

    async LoadWords() {
        await fs.readFile(Settings.WordsList).then(async res => {
            var data = JSON.parse(res);
            var words = []
            for (let i of data.Words) {
                words.push(new Tuple(i));
            }
            this.words = words;
        });
    }

    Start() {
        if (this.isActive) return;
        try {
        this.Task = this.GetNextWords();
        this.isActive = true;
        var oldId = this.sessionId;
        this.sessionId++;
        // Temp: checking the ptr break
        assert(oldId != this.sessionId); 
        // Setting up the game end
        setTimeout(() => {
            if (this.sessionId != oldId+1) return;
            this.Stop({ Success: false });
        }, Settings.GameTimeout);
        console.log("The game started");
        } catch (err) {
            console.error(`Failed to start a round: ${err}`)
        }
    }

    Stop(reason) {
        this.isActive = false;
        if (reason.Success) {
            console.log("The game ended: someone guessed the words");
        } else {
            console.log("The game ended: no one guessed the words");
        }
    }

    GetNextWords() {
        while (true) {
            var index = Math.floor(Math.random() * this.words.length);
            var newWordsList = this.words[index];
            if (this.words.length > 1 && newWordsList == this.Task) 
                continue;
            return newWordsList;
        }
    }

    GetGuessedWords(message) {
        if (this.Task == null) return false;
        var parts = message.payload.event.message.text.split(" ");
        let guessed = 0;
        let map = new Map();
        for (let v of parts) {
            v = v.toLowerCase();
            map.set(v, true)
        }
        for (let w of this.Task.words) {
            if (map.has(w)) 
                guessed++;
        }
        return guessed;
    }

    CheckWinCondition(message) {
        if (this.Task == null) return false;
        var regex = this.Task.GetRegex();
        var txt = message.payload.event.message.text;
        return regex.test(txt);
    }
}

export var CurrentGame = new Game();

export function HandleMessage(message) {
    if (!CurrentGame.isActive) return;
    if (message.metadata.message_type != "notification") return;
    try {
        var guessed = CurrentGame.GetGuessedWords(message);
        console.log(`Guessed ${guessed} word(s)`)
        if (guessed == CurrentGame.Task.words.length && CurrentGame.CheckWinCondition(message)) {
            console.log(`This is a win!`)
        }
    } catch (ex) {
        console.error(`Failed to check the message: ${ex}`);
    }
}
