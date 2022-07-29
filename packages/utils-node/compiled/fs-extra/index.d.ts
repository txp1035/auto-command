/// <reference types="node" />

import * as fs from 'fs';

export declare function access(
  path: PathLike,
  callback: (err: NodeJS.ErrnoException) => void,
): void;

export declare function access(
  path: PathLike,
  mode: number,
  callback: (err: NodeJS.ErrnoException) => void,
): void;

export declare function access(path: PathLike, mode?: number): Promise<void>;

export declare function appendFile(
  file: PathLike | number,
  data: any,
  options: {
    encoding?: BufferEncoding | string | undefined;
    mode?: number | string | undefined;
    flag?: string | undefined;
  },
  callback: (err: NodeJS.ErrnoException) => void,
): void;

export declare function appendFile(
  file: PathLike | number,
  data: any,
  callback: (err: NodeJS.ErrnoException) => void,
): void;

export declare function appendFile(
  file: PathLike | number,
  data: any,
  options?:
    | {
        encoding?: BufferEncoding | string | undefined;
        mode?: number | string | undefined;
        flag?: string | undefined;
      }
    | BufferEncoding
    | string,
): Promise<void>;

declare type ArrayBufferView_2 = NodeJS.TypedArray | DataView;
export { ArrayBufferView_2 as ArrayBufferView };

export declare function chmod(
  path: PathLike,
  mode: Mode,
  callback: (err: NodeJS.ErrnoException) => void,
): void;

export declare function chmod(path: PathLike, mode: Mode): Promise<void>;

export declare function chown(path: PathLike, uid: number, gid: number): Promise<void>;

export declare function chown(
  path: PathLike,
  uid: number,
  gid: number,
  callback: (err: NodeJS.ErrnoException) => void,
): void;

declare function close_2(fd: number, callback: (err: NodeJS.ErrnoException) => void): void;

declare function close_2(fd: number): Promise<void>;
export { close_2 as close };

export declare function copy(src: string, dest: string, options?: CopyOptions): Promise<void>;

export declare function copy(src: string, dest: string, callback: (err: Error) => void): void;

export declare function copy(
  src: string,
  dest: string,
  options: CopyOptions,
  callback: (err: Error) => void,
): void;

export declare function copyFile(src: string, dest: string, flags?: number): Promise<void>;

export declare function copyFile(src: string, dest: string, callback: (err: Error) => void): void;

export declare function copyFile(
  src: string,
  dest: string,
  flags: number,
  callback: (err: Error) => void,
): void;

export declare type CopyFilterAsync = (src: string, dest: string) => Promise<boolean>;

export declare type CopyFilterSync = (src: string, dest: string) => boolean;

export declare interface CopyOptions {
  dereference?: boolean | undefined;
  overwrite?: boolean | undefined;
  preserveTimestamps?: boolean | undefined;
  errorOnExist?: boolean | undefined;
  filter?: CopyFilterSync | CopyFilterAsync | undefined;
  recursive?: boolean | undefined;
}

export declare interface CopyOptionsSync extends CopyOptions {
  filter?: CopyFilterSync | undefined;
}

export declare function copySync(src: string, dest: string, options?: CopyOptionsSync): void;

export declare function createFile(file: string): Promise<void>;

export declare function createFile(file: string, callback: (err: Error) => void): void;

export declare function createFileSync(file: string): void;

export declare const createLink: typeof ensureLink;

export declare const createLinkSync: typeof ensureLinkSync;

export declare function createSymlink(src: string, dest: string, type: SymlinkType): Promise<void>;

export declare function createSymlink(
  src: string,
  dest: string,
  type: SymlinkType,
  callback?: (err: Error) => void,
): void;

export declare function createSymlinkSync(src: string, dest: string, type: SymlinkType): void;

export declare function emptyDir(path: string): Promise<void>;

export declare function emptyDir(path: string, callback: (err: Error) => void): void;

export declare const emptydir: typeof emptyDir;

export declare function emptyDirSync(path: string): void;

export declare const emptydirSync: typeof emptyDirSync;

export declare function ensureDir(path: string, options?: EnsureOptions | number): Promise<void>;

export declare function ensureDir(path: string, callback?: (err: Error) => void): void;

export declare function ensureDir(
  path: string,
  options?: EnsureOptions | number,
  callback?: (err: Error) => void,
): void;

export declare function ensureDirSync(path: string, options?: EnsureOptions | number): void;

export declare function ensureFile(path: string): Promise<void>;

export declare function ensureFile(path: string, callback: (err: Error) => void): void;

export declare function ensureFileSync(path: string): void;

export declare function ensureLink(src: string, dest: string): Promise<void>;

export declare function ensureLink(src: string, dest: string, callback: (err: Error) => void): void;

export declare function ensureLinkSync(src: string, dest: string): void;

export declare interface EnsureOptions {
  mode?: number | undefined;
}

export declare function ensureSymlink(src: string, dest: string, type?: SymlinkType): Promise<void>;

export declare function ensureSymlink(
  src: string,
  dest: string,
  type: SymlinkType,
  callback: (err: Error) => void,
): void;

export declare function ensureSymlink(
  src: string,
  dest: string,
  callback: (err: Error) => void,
): void;

export declare function ensureSymlinkSync(src: string, dest: string, type?: SymlinkType): void;

export declare function fchmod(
  fd: number,
  mode: Mode,
  callback: (err: NodeJS.ErrnoException) => void,
): void;

export declare function fchmod(fd: number, mode: Mode): Promise<void>;

export declare function fchown(
  fd: number,
  uid: number,
  gid: number,
  callback: (err: NodeJS.ErrnoException) => void,
): void;

export declare function fchown(fd: number, uid: number, gid: number): Promise<void>;

export declare function fdatasync(fd: number, callback: () => void): void;

export declare function fdatasync(fd: number): Promise<void>;

export declare function fstat(
  fd: number,
  callback: (err: NodeJS.ErrnoException, stats: Stats) => any,
): void;

export declare function fstat(fd: number): Promise<Stats>;

export declare function fsync(fd: number, callback: (err: NodeJS.ErrnoException) => void): void;

export declare function fsync(fd: number): Promise<void>;

export declare function ftruncate(fd: number, callback: (err: NodeJS.ErrnoException) => void): void;

export declare function ftruncate(
  fd: number,
  len: number,
  callback: (err: NodeJS.ErrnoException) => void,
): void;

export declare function ftruncate(fd: number, len?: number): Promise<void>;

export declare function futimes(
  fd: number,
  atime: number,
  mtime: number,
  callback: (err: NodeJS.ErrnoException) => void,
): void;

export declare function futimes(
  fd: number,
  atime: Date,
  mtime: Date,
  callback: (err: NodeJS.ErrnoException) => void,
): void;

export declare function futimes(fd: number, atime: number, mtime: number): Promise<void>;

export declare function futimes(fd: number, atime: Date, mtime: Date): Promise<void>;

export declare function lchown(
  path: PathLike,
  uid: number,
  gid: number,
  callback: (err: NodeJS.ErrnoException) => void,
): void;

export declare function lchown(path: PathLike, uid: number, gid: number): Promise<void>;

export declare function link(
  existingPath: PathLike,
  newPath: PathLike,
  callback: (err: NodeJS.ErrnoException) => void,
): void;

export declare function link(existingPath: PathLike, newPath: PathLike): Promise<void>;

export declare function lstat(
  path: PathLike,
  callback: (err: NodeJS.ErrnoException, stats: Stats) => any,
): void;

export declare function lstat(path: PathLike): Promise<Stats>;

/**
 * Asynchronous mkdir - creates the directory specified in {path}.  Parameter {mode} defaults to 0777.
 *
 * @param callback No arguments other than a possible exception are given to the completion callback.
 */
export declare function mkdir(path: PathLike, callback: (err: NodeJS.ErrnoException) => void): void;

/**
 * Asynchronous mkdir - creates the directory specified in {path}.  Parameter {mode} defaults to 0777.
 *
 * @param callback No arguments other than a possible exception are given to the completion callback.
 */
export declare function mkdir(
  path: PathLike,
  options: Mode | fs.MakeDirectoryOptions | null,
  callback: (err: NodeJS.ErrnoException) => void,
): void;

export declare function mkdir(
  path: PathLike,
  options?: Mode | fs.MakeDirectoryOptions | null,
): Promise<void>;

export declare function mkdirp(dir: string): Promise<void>;

export declare function mkdirp(dir: string, callback: (err: Error) => void): void;

export declare function mkdirpSync(dir: string): void;

export declare function mkdirs(dir: string): Promise<void>;

export declare function mkdirs(dir: string, callback: (err: Error) => void): void;

export declare function mkdirsSync(dir: string): void;

export declare function mkdirSync(
  path: PathLike,
  options?: Mode | fs.MakeDirectoryOptions | null,
): void;

/**
 * Asynchronous mkdtemp - Creates a unique temporary directory. Generates six random characters to be appended behind a required prefix to create a unique temporary directory.
 *
 * @param callback The created folder path is passed as a string to the callback's second parameter.
 */
export declare function mkdtemp(prefix: string): Promise<string>;

export declare function mkdtemp(
  prefix: string,
  callback: (err: NodeJS.ErrnoException, folder: string) => void,
): void;

export declare type Mode = string | number;

export declare function move(src: string, dest: string, options?: MoveOptions): Promise<void>;

export declare function move(src: string, dest: string, callback: (err: Error) => void): void;

export declare function move(
  src: string,
  dest: string,
  options: MoveOptions,
  callback: (err: Error) => void,
): void;

export declare interface MoveOptions {
  overwrite?: boolean | undefined;
  limit?: number | undefined;
}

export declare function moveSync(src: string, dest: string, options?: MoveOptions): void;

declare function open_2(
  path: PathLike,
  flags: string | number,
  callback: (err: NodeJS.ErrnoException, fd: number) => void,
): void;

declare function open_2(
  path: PathLike,
  flags: string | number,
  mode: Mode,
  callback: (err: NodeJS.ErrnoException, fd: number) => void,
): void;

declare function open_2(
  path: PathLike,
  flags: string | number,
  mode?: Mode | null,
): Promise<number>;
export { open_2 as open };

export declare function opendir(
  path: string,
  cb: (err: NodeJS.ErrnoException | null, dir: fs.Dir) => void,
): void;

export declare function opendir(
  path: string,
  options: fs.OpenDirOptions,
  cb: (err: NodeJS.ErrnoException | null, dir: fs.Dir) => void,
): void;

export declare function opendir(path: string, options?: fs.OpenDirOptions): Promise<fs.Dir>;

export declare function outputFile(
  file: string,
  data: any,
  options?: WriteFileOptions | BufferEncoding | string,
): Promise<void>;

export declare function outputFile(file: string, data: any, callback: (err: Error) => void): void;

export declare function outputFile(
  file: string,
  data: any,
  options: WriteFileOptions | string,
  callback: (err: Error) => void,
): void;

export declare function outputFileSync(
  file: string,
  data: any,
  options?: WriteFileOptions | BufferEncoding | string,
): void;

export declare function outputJSON(
  file: string,
  data: any,
  options?: WriteOptions | BufferEncoding | string,
): Promise<void>;

export declare function outputJSON(
  file: string,
  data: any,
  options: WriteOptions | BufferEncoding | string,
  callback: (err: Error) => void,
): void;

export declare function outputJSON(file: string, data: any, callback: (err: Error) => void): void;

export declare function outputJson(
  file: string,
  data: any,
  options?: WriteOptions | BufferEncoding | string,
): Promise<void>;

export declare function outputJson(
  file: string,
  data: any,
  options: WriteOptions | BufferEncoding | string,
  callback: (err: Error) => void,
): void;

export declare function outputJson(file: string, data: any, callback: (err: Error) => void): void;

export declare function outputJSONSync(
  file: string,
  data: any,
  options?: WriteOptions | BufferEncoding | string,
): void;

export declare function outputJsonSync(
  file: string,
  data: any,
  options?: WriteOptions | BufferEncoding | string,
): void;

export declare interface PathEntry {
  path: string;
  stats: Stats;
}

export declare interface PathEntryStream {
  read(): PathEntry | null;
}

export declare function pathExists(path: string): Promise<boolean>;

export declare function pathExists(
  path: string,
  callback: (err: Error, exists: boolean) => void,
): void;

export declare function pathExistsSync(path: string): boolean;

export declare function read<TBuffer extends ArrayBufferView_2>(
  fd: number,
  buffer: TBuffer,
  offset: number,
  length: number,
  position: number | null,
  callback: (err: NodeJS.ErrnoException, bytesRead: number, buffer: TBuffer) => void,
): void;

export declare function read<TBuffer extends ArrayBufferView_2>(
  fd: number,
  buffer: TBuffer,
  offset: number,
  length: number,
  position: number | null,
): Promise<{ bytesRead: number; buffer: TBuffer }>;

export declare function readdir(
  path: PathLike,
  callback: (err: NodeJS.ErrnoException, files: string[]) => void,
): void;

export declare function readdir(
  path: PathLike,
  options: 'buffer' | { encoding: 'buffer'; withFileTypes?: false | undefined },
): Promise<Buffer[]>;

export declare function readdir(
  path: PathLike,
  options?:
    | { encoding: BufferEncoding | string | null; withFileTypes?: false | undefined }
    | BufferEncoding
    | string
    | null,
): Promise<string[]>;

export declare function readdir(
  path: PathLike,
  options?: {
    encoding?: BufferEncoding | string | null | undefined;
    withFileTypes?: false | undefined;
  },
): Promise<string[] | Buffer[]>;

export declare function readdir(
  path: PathLike,
  options: { encoding?: BufferEncoding | string | null | undefined; withFileTypes: true },
): Promise<fs.Dirent[]>;

export declare function readFile(
  file: PathLike | number,
  callback: (err: NodeJS.ErrnoException, data: Buffer) => void,
): void;

export declare function readFile(
  file: PathLike | number,
  encoding: BufferEncoding | string,
  callback: (err: NodeJS.ErrnoException, data: string) => void,
): void;

export declare function readFile(
  file: PathLike | number,
  options:
    | { flag?: string | undefined }
    | { encoding: BufferEncoding | string; flag?: string | undefined },
  callback: (err: NodeJS.ErrnoException, data: Buffer) => void,
): void;

export declare function readFile(
  file: PathLike | number,
  options:
    | { flag?: string | undefined }
    | { encoding: BufferEncoding | string; flag?: string | undefined },
): Promise<string>;

export declare function readFile(
  file: PathLike | number,
  encoding: BufferEncoding | string,
): Promise<string>;

export declare function readFile(file: PathLike | number): Promise<Buffer>;

export declare function readJSON(
  file: string,
  options?: ReadOptions | BufferEncoding | string,
): Promise<any>;

export declare function readJSON(
  file: string,
  callback: (err: Error, jsonObject: any) => void,
): void;

export declare function readJSON(
  file: string,
  options: ReadOptions | BufferEncoding | string,
  callback: (err: Error, jsonObject: any) => void,
): void;

export declare function readJson(
  file: string,
  options?: ReadOptions | BufferEncoding | string,
): Promise<any>;

export declare function readJson(
  file: string,
  callback: (err: Error, jsonObject: any) => void,
): void;

export declare function readJson(
  file: string,
  options: ReadOptions | BufferEncoding | string,
  callback: (err: Error, jsonObject: any) => void,
): void;

export declare function readJSONSync(
  file: string,
  options?: ReadOptions | BufferEncoding | string,
): any;

export declare function readJsonSync(
  file: string,
  options?: ReadOptions | BufferEncoding | string,
): any;

export declare function readlink(
  path: PathLike,
  callback: (err: NodeJS.ErrnoException, linkString: string) => any,
): void;

export declare function readlink(path: PathLike): Promise<string>;

export declare interface ReadOptions {
  throws?: boolean | undefined;
  fs?: object | undefined;
  reviver?: any;
  encoding?: BufferEncoding | string | undefined;
  flag?: string | undefined;
}

export declare function realpath(
  path: PathLike,
  callback: (err: NodeJS.ErrnoException, resolvedPath: string) => any,
): void;

export declare function realpath(
  path: PathLike,
  cache: { [path: string]: string },
  callback: (err: NodeJS.ErrnoException, resolvedPath: string) => any,
): void;

export declare function realpath(
  path: PathLike,
  cache?: { [path: string]: string },
): Promise<string>;

export declare namespace realpath {
  const native: {
    (path: PathLike, options: { encoding: 'buffer' } | 'buffer'): Promise<Buffer>;
    (
      path: PathLike,
      options:
        | { encoding: BufferEncoding | string | null }
        | BufferEncoding
        | string
        | undefined
        | null,
    ): Promise<string>;
    (
      path: PathLike,
      options: { encoding: BufferEncoding | string | null } | string | undefined | null,
    ): Promise<string | Buffer>;
    (path: PathLike): Promise<string>;
  } & typeof fs.realpath.native;
}

export declare function remove(dir: string, callback: (err: Error) => void): void;

export declare function remove(dir: string, callback?: (err: Error) => void): Promise<void>;

export declare function removeSync(dir: string): void;

export declare function rename(
  oldPath: PathLike,
  newPath: PathLike,
  callback: (err: NodeJS.ErrnoException) => void,
): void;

export declare function rename(oldPath: PathLike, newPath: PathLike): Promise<void>;

/**
 * Asynchronously removes files and directories (modeled on the standard POSIX
 * `rm` utility).
 *
 * Only available in node >= v14.14.0
 */
export declare function rm(
  path: PathLike,
  options?: {
    force?: boolean | undefined;
    maxRetries?: number | undefined;
    recursive?: boolean | undefined;
    retryDelay?: number | undefined;
  },
): Promise<void>;

/**
 * Asynchronous rmdir - removes the directory specified in {path}
 *
 * @param callback No arguments other than a possible exception are given to the completion callback.
 */
export declare function rmdir(path: PathLike, callback: (err: NodeJS.ErrnoException) => void): void;

export declare function rmdir(path: PathLike, options?: fs.RmDirOptions): Promise<void>;

export declare function stat(
  path: PathLike,
  callback: (err: NodeJS.ErrnoException, stats: Stats) => any,
): void;

export declare function stat(path: PathLike): Promise<Stats>;

export declare function symlink(
  target: PathLike,
  path: PathLike,
  type: SymlinkType | undefined,
  callback: (err: NodeJS.ErrnoException) => void,
): void;

export declare function symlink(
  target: PathLike,
  path: PathLike,
  callback: (err: NodeJS.ErrnoException) => void,
): void;

export declare function symlink(
  target: PathLike,
  path: PathLike,
  type?: SymlinkType,
): Promise<void>;

export declare type SymlinkType = 'dir' | 'file' | 'junction';

export declare function truncate(
  path: PathLike,
  callback: (err: NodeJS.ErrnoException) => void,
): void;

export declare function truncate(
  path: PathLike,
  len: number,
  callback: (err: NodeJS.ErrnoException) => void,
): void;

export declare function truncate(path: PathLike, len?: number): Promise<void>;

/**
 * Asynchronous unlink - deletes the file specified in {path}
 *
 * @param callback No arguments other than a possible exception are given to the completion callback.
 */
export declare function unlink(
  path: PathLike,
  callback: (err: NodeJS.ErrnoException) => void,
): void;

export declare function unlink(path: PathLike): Promise<void>;

export declare function utimes(
  path: PathLike,
  atime: number,
  mtime: number,
  callback: (err: NodeJS.ErrnoException) => void,
): void;

export declare function utimes(
  path: PathLike,
  atime: Date,
  mtime: Date,
  callback: (err: NodeJS.ErrnoException) => void,
): void;

export declare function utimes(path: PathLike, atime: number, mtime: number): Promise<void>;

export declare function utimes(path: PathLike, atime: Date, mtime: Date): Promise<void>;

export declare function write<TBuffer extends ArrayBufferView_2>(
  fd: number,
  buffer: TBuffer,
  offset: number,
  length: number,
  position: number | null,
  callback: (err: NodeJS.ErrnoException, written: number, buffer: TBuffer) => void,
): void;

export declare function write<TBuffer extends ArrayBufferView_2>(
  fd: number,
  buffer: TBuffer,
  offset: number,
  length: number,
  callback: (err: NodeJS.ErrnoException, written: number, buffer: TBuffer) => void,
): void;

export declare function write(
  fd: number,
  data: any,
  callback: (err: NodeJS.ErrnoException, written: number, str: string) => void,
): void;

export declare function write(
  fd: number,
  data: any,
  offset: number,
  callback: (err: NodeJS.ErrnoException, written: number, str: string) => void,
): void;

export declare function write(
  fd: number,
  data: any,
  offset: number,
  encoding: BufferEncoding | string,
  callback: (err: NodeJS.ErrnoException, written: number, str: string) => void,
): void;

export declare function write<TBuffer extends ArrayBufferView_2>(
  fd: number,
  buffer: TBuffer,
  offset?: number,
  length?: number,
  position?: number | null,
): Promise<{ bytesWritten: number; buffer: TBuffer }>;

export declare function write(
  fd: number,
  data: any,
  offset?: number,
  encoding?: BufferEncoding | string,
): Promise<{ bytesWritten: number; buffer: string }>;

export declare function writeFile(
  file: PathLike | number,
  data: any,
  callback: (err: NodeJS.ErrnoException) => void,
): void;

export declare function writeFile(
  file: PathLike | number,
  data: any,
  options?: WriteFileOptions | BufferEncoding | string,
): Promise<void>;

export declare function writeFile(
  file: PathLike | number,
  data: any,
  options: WriteFileOptions | BufferEncoding | string,
  callback: (err: NodeJS.ErrnoException) => void,
): void;

export declare interface WriteFileOptions {
  encoding?: BufferEncoding | string | null | undefined;
  flag?: string | undefined;
  mode?: number | undefined;
}

export declare function writeJSON(
  file: string,
  object: any,
  options?: WriteOptions | BufferEncoding | string,
): Promise<void>;

export declare function writeJSON(file: string, object: any, callback: (err: Error) => void): void;

export declare function writeJSON(
  file: string,
  object: any,
  options: WriteOptions | BufferEncoding | string,
  callback: (err: Error) => void,
): void;

export declare function writeJson(
  file: string,
  object: any,
  options?: WriteOptions | BufferEncoding | string,
): Promise<void>;

export declare function writeJson(file: string, object: any, callback: (err: Error) => void): void;

export declare function writeJson(
  file: string,
  object: any,
  options: WriteOptions | BufferEncoding | string,
  callback: (err: Error) => void,
): void;

export declare function writeJSONSync(
  file: string,
  object: any,
  options?: WriteOptions | BufferEncoding | string,
): void;

export declare function writeJsonSync(
  file: string,
  object: any,
  options?: WriteOptions | BufferEncoding | string,
): void;

export declare interface WriteOptions extends WriteFileOptions {
  fs?: object | undefined;
  replacer?: any;
  spaces?: number | string | undefined;
  EOL?: string | undefined;
}

export declare function writev(
  fd: number,
  buffers: NodeJS.ArrayBufferView[],
  position: number,
  cb: (
    err: NodeJS.ErrnoException | null,
    bytesWritten: number,
    buffers: NodeJS.ArrayBufferView[],
  ) => void,
): void;

export declare function writev(
  fd: number,
  buffers: NodeJS.ArrayBufferView[],
  cb: (
    err: NodeJS.ErrnoException | null,
    bytesWritten: number,
    buffers: NodeJS.ArrayBufferView[],
  ) => void,
): void;

export declare function writev(
  fd: number,
  buffers: NodeJS.ArrayBufferView[],
  position?: number,
): Promise<WritevResult>;

export declare interface WritevResult {
  bytesWritten: number;
  buffers: ArrayBufferView_2[];
}

export * from 'fs';

export {};
