import * as winston from "winston";
import config from "@config";
import { join } from "path";

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const level = () => {
    return config.env === "dev" ? "debug" : "warn";
};

const colors = {
    error: "red",
    warn: "yellow",
    info: "cyan",
    http: "magenta",
    debug: "green",
};

winston.addColors(colors);

const format = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm" }),
    winston.format.printf((info) => {
        const { timestamp, level, message } = info;
        return `[${level}] [${timestamp}] ${message}`;
    })
);

const transports = [
    new winston.transports.Console({
        format: winston.format.combine(winston.format.colorize(), format),
    }),
    new winston.transports.File({
        filename: join(config.paths.logs, "error.log"),
        level: "error",
        maxsize: 41943040, // 40MB
        maxFiles: 5
    }),
    new winston.transports.File({
        filename: join(config.paths.logs, "server.log"),
        maxsize: 10485760, // 10MB
        maxFiles: 10
    })
];

const Logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports
});

export default Logger;