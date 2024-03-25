import { basename } from "node:path"
import { glob } from "glob"
import ora from "ora"
import { promisify } from "node:util"
import { exec } from "node:child_process"
import { mkdir, stat } from "node:fs/promises"

const directories = await glob('pack_*/*/')
directories.sort()

const spinner = ora(`Processing ${directories.length} animations …`).start()

const targetDirectory = 'previews'
try {
    await stat(targetDirectory)
} catch (_) {
    await mkdir(targetDirectory)
}

const run = promisify(exec)

let counter = 0
for await (const directory of directories) {
    spinner.text = `Processing ${++counter}/${directories.length} animations (${directory}) …`

    const name = basename(directory)
    const command = `ffmpeg -y -i ${directory}/progress-%d.png ${targetDirectory}/${name}.gif`

    await run(command)
}

spinner.succeed(`Created ${counter} GIF(s)`)
