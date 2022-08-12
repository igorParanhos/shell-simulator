export class BaseProvider {
    constructor() {
        this._shell = null
        this._config = {}
        this._handlers = {}
    }
    bootstrap = (shell) => {
        this._shell = shell;
        this._initializeHandlers();
        this._initializeConfig();
    }
    _initializeHandlers = () => {
        this._shell.addHandlers(this._handlers)
    }
    _initializeConfig = () => {
        this._shell.setConfig(this._config)
    }
}

export class FriendlyProvider extends BaseProvider {
    constructor() {
        super()
        this._handlers = {
            hi: this.hi,
            bye: this.bye,
            greet: this.greet,
        }
    }
    hi = () => {
        this._shell.write("Hello!")
    }
    bye = () => {
        this._shell.write("Bye!")
    }
    greet = (args) => {
        this._shell.write(`Hello, ${args[0]}!`)
    }
}

export class ShellProvider extends BaseProvider {
    constructor() {
        super()
        this._handlers = {
            exit: this.exit,
            clear: this.clear,
            echo: this.echo,
            history: this.history,
            help: this.help
        }
        this._config = {
            prompt: () => "$ ",
        }
    }

    help = () => {
        this._shell.write("Available commands:")
        Object.keys(this._shell.handlers).forEach(key => {
            this._shell.write(`${key}`)
        })
    }

    history = () => {
        for (let item of this._shell.history)
            this._shell.write(item)
    }

    echo = (args) => {
        this._shell.write(args.join(" "))
    }

    exit = () => {
        this._shell.write("Bye!");
        process.exit(0);
    }

    clear = () => {
        this._shell.clear();
    }
}
