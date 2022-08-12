import readlineSync from "readline-sync";
import { FriendlyProvider, ShellProvider } from "./provider.js";

const baseConfig = {
    prompt: () => "> ",
};

class Writer {
    constructor(config) {
        this.config = {
            input: process.stdin,
            output: process.stdout,
            ...config
        };
        this._interface = console
    }
    clear = () => {
        this._interface.clear();
    }
    write = (...args) => {
        this._interface.log(...args);
    }
}

export class Shell {
    constructor(config = {}, providers = [], writer = new Writer()) {
        const shellProvider = new ShellProvider();
        const friendlyProvider = new FriendlyProvider();

        this.providers = [shellProvider, friendlyProvider, ...providers];
        this.config = { ...baseConfig, ...config };
        this._writer = writer;
        this.write = this._writer.write;
        this.clear = this._writer.clear;

        this.history = [];

        this.handlers = {};
        this.initializeProviders();
    }

    run = async () => {
        this.loop();
    };

    loop = () => {
        let lastInput = "";
        while (true) {
            // TODO: decouple interface logic from shell logic
            const prompt = this.config.prompt();
            lastInput = readlineSync.question(prompt);
            readlineSync.setEncoding("utf8");
            this.execute(lastInput);
        }
    };

    execute = (input) => {
        if (input === '') return
        const [command, ...args] = input.split(" ");
        const commandHandler = this.handlers[command];
        // TODO: Use adapter pattern to handle command output
        if (commandHandler) {
            commandHandler(args);
            this.history = [...this.history, input];
        } else {
            this.write(`Command not found: ${command}`);
        }
    }

    addProvider = (provider) => {
        provider.bootstrap(this);
        this.providers.push(provider);
    }

    initializeProviders = () => {
        for (let provider of this.providers) {
            provider.bootstrap(this);
        }
    };

    addHandlers = (handlers) => {
        this.handlers = { ...this.handlers, ...handlers };
    };

    setConfig = (config) => {
        this.config = { ...this.config, ...config };
    };
}
