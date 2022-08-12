import { BaseProvider } from '../shell/index.js';
import { Folder } from './api.js';
import chalk from 'chalk'


export class FileSystemProvider extends BaseProvider {
    constructor(fileSystem) {
        super()
        this.fileSystem = fileSystem;
        this._handlers = {
            cd: this.cd,
            touch: this.touch,
            mkdir: this.mkdir,
            rm: this.rm,
            pwd: this.pwd,
            ls: this.ls,
        }
        this._config = {
            prompt: () =>
                chalk.bgBlueBright(` 🤡 `) +
                chalk.bgMagenta(` ${this.fileSystem.pwd()}`) +
                chalk.blue(' > ')
        }
    }

    cd = (args) => {
        this.fileSystem.cd(args[0]);
    };
    touch = (args) => {
        this.fileSystem.touch(args[0]);
    };
    mkdir = (args) => {
        this.fileSystem.mkdir(args[0]);
    };
    rm = (args) => {
        this.fileSystem.rm(args[0]);
    };
    pwd = () => {
        this._shell.write(this.fileSystem.pwd());
    };
    ls = () => {
        const items = this.fileSystem.ls();
        for (let item of items) {
            if (item instanceof Folder) {
                this._shell.write(chalk.gray(`${item.name}/`));
            } else {
                this._shell.write(chalk.blue(item.name));
            }
        }
    };
}
