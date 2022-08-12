import { Shell } from './src/shell/index.js'
import { FileSystem, FileSystemProvider } from './src/file-system/index.js'

function main() {
    const fileSystem = new FileSystem()
    const fileSystemProvider = new FileSystemProvider(fileSystem)

    const shell = new Shell({})
    shell.addProvider(fileSystemProvider)

    shell.run()
}

main()