 // @ts-ignore
import KoaLogger = require("koa-bunyan");
import bunyan = require("bunyan");
import PrettyStream = require("bunyan-prettystream");

const prettyStdOut = new PrettyStream();
prettyStdOut.pipe(process.stdout);

const isProduction = process.env.NODE_ENV === "production";

export const logger = bunyan.createLogger({
    name: "well-api-demo",
    streams: [
        {
            level: "debug",
            stream: prettyStdOut // log DEBUG and above to stdout
        }
    ]
});

export const koaLogger = KoaLogger(logger, {
    level: isProduction ? "info" : "debug",
    timeLimit: 1000
});
