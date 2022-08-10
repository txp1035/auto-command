import { join } from 'path';
import pino, { type Logger } from 'pino';
import chalk from '../compiled/chalk';
import fsExtra from '../compiled/fs-extra';

const loggerDir = join(process.cwd(), 'node_modules/.cache/logger');
const loggerPath = join(loggerDir, 'txpjs.log');

const customLevels = {
  ready: 31,
  event: 32,
  wait: 55,
};

let logger: Logger<{ customLevels: typeof customLevels }>;
function init() {
  // 不存在目录就创建它
  if (!logger) {
    fsExtra.mkdirpSync(loggerDir);
    logger = pino(
      {
        customLevels,
        level: 'debug',
      },
      pino.transport({
        targets: [
          {
            target: 'pino-pretty',
            options: {
              destination: loggerPath,
              colorize: false,
              translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
              messageFormat: 'level: {level}、msg: {msg}',
            },
            level: 'trace',
          },
        ],
      }),
    );
  }
}

const prefixesBase = {
  wait: chalk.cyan('wait') + '  -',
  error: chalk.red('error') + ' -',
  fatal: chalk.red('fatal') + ' -',
  warn: chalk.yellow('warn') + '  -',
  ready: chalk.green('ready') + ' -',
  info: chalk.cyan('info') + '  -',
  event: chalk.magenta('event') + ' -',
  debug: chalk.gray('debug') + ' -',
};

const prefixes = new Proxy(prefixesBase, {
  get(target, key, receiver) {
    init();
    return Reflect.get(target, key, receiver);
  },
});

export function wait(...message: any[]) {
  console.log(prefixes.wait, ...message);
  logger.wait(message[0]);
}

export function error(...message: any[]) {
  console.error(prefixes.error, ...message);
  logger.error(message[0]);
}

export function warn(...message: any[]) {
  console.warn(prefixes.warn, ...message);
  logger.warn(message[0]);
}

export function ready(...message: any[]) {
  console.log(prefixes.ready, ...message);
  logger.ready(message[0]);
}

export function info(...message: any[]) {
  console.log(prefixes.info, ...message);
  logger.info(message[0]);
}

export function event(...message: any[]) {
  console.log(prefixes.event, ...message);
  logger.event(message[0]);
}

export function debug(...message: any[]) {
  if (process.env.DEBUG) {
    console.log(prefixes.debug, ...message);
  }
  logger.debug(message[0]);
}

export function fatal(...message: any[]) {
  console.error(prefixes.fatal, ...message);
  logger.fatal(message[0]);
}

export function getLatestLogFilePath() {
  return loggerPath;
}
