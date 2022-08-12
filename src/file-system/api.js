export class File {
    constructor(name, content = "", parent = null) {
        this.name = name;
        this.content = content;
        this.parent = parent;
    }
}

export class Folder {
    constructor(name, files = []) {
        this.name = name;
        this.files = files;
    }

    addFile = (...files) => {
        for (let file of files) {
            file.parent = this;
            this.files.push(file);
        }
    };
    removeFile = (...files) => {
        this.files = this.files.filter(
            (file) => !files.map((f) => f.name).includes(file.name)
        );
    };
}

export class FileSystem {
    constructor() {
        this.root = new Folder("root", []);
        this.currentFolder = this.root;
    }
    cd = (path) => {
        path = path.split("/");
        let folder = this.currentFolder;
        for (let name of path) {
            if (name === "..") {
                folder = folder.parent;
            } else {
                folder = folder.files.find((file) => file.name === name);
            }
            if (!folder || !(folder instanceof Folder)) {
                return false;
            }
        }
        if (!folder instanceof Folder) {
            return false;
        }
        this.currentFolder = folder;
        return true;
    };
    touch = (name) => {
        const file = new File(name);
        this.currentFolder.addFile(file);
        return file;
    };
    mkdir = (name) => {
        const folder = new Folder(name);
        this.currentFolder.addFile(folder);
        return folder;
    };
    rm = (name) => {
        this.currentFolder.removeFile(name);
    };
    pwd = () => {
        let folder = this.currentFolder;
        let path = "/" + folder.name;
        while (folder.parent) {
            folder = folder.parent;
            path = "/" + folder.name + path;
        }

        return path;
    };
    ls = () => {
        return this.currentFolder.files;
    };
}
