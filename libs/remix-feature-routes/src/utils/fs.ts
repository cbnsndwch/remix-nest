import type { PathLike } from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

/**
 * Determine whether the given `dir` points to an empty directory.
 */
export async function isEmptyDir(dir: PathLike) {
    try {
        const directory = await fsp.opendir(dir);
        const entry = await directory.read();
        await directory.close();

        return entry === null;
    } catch (error) {
        return false;
    }
}

type WalkEntry = {
    root: string;
    base: string;
    name: string;
};

/**
 * Walks the given directory and yields all files within it, optionally excluding
 * files and directories based on the given patterns.
 *
 * @param baseDir Base directory to walk
 * @param exclude List of directory or file patterns to exclude
 */
export async function* walk(
    baseDir: string,
    exclude: string[] = []
): AsyncIterable<WalkEntry> {
    const root = baseDir;
    for await (const d of await fsp.opendir(baseDir)) {
        const entry = path.join(baseDir, d.name);
        if (exclude.some(pattern => entry.match(pattern))) {
            continue;
        }

        if (d.isDirectory()) {
            yield* walk(entry);
        } else if (d.isFile()) {
            yield {
                root,
                base: '',
                name: d.name
            };
        }
    }
}

async function* walkChild(
    root: string,
    child: string,
    exclude: string[] = []
): AsyncIterable<WalkEntry> {
    const baseDir = path.join(root, child);
    for await (const d of await fsp.opendir(baseDir)) {
        const entry = path.join(child, d.name);
        if (exclude.some(pattern => entry.match(pattern))) {
            continue;
        }

        if (d.isDirectory()) {
            yield* walk(entry);
        } else if (d.isFile()) {
            yield {
                root,
                base: child,
                name: d.name
            };
        }
    }
}

/**
 * Checks whether the given path is a directory and throws an error if not.
 *
 * @param directoryPathMaybe The filesystem path to the directory to check
 */
export async function assertIsDirectory(directoryPathMaybe: string) {
    const dirStat = await fsp.lstat(directoryPathMaybe);
    if (dirStat?.isDirectory()) {
        return;
    }

    throw new Error(
        `Path "${directoryPathMaybe}" does not exist or is not a directory`
    );
}
