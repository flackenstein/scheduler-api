import * as Koa from "koa";
import * as cors from "koa2-cors";
import * as bodyParser from "koa-bodyparser";
import * as compress from "koa-compress";
import { koaLogger, logger } from "./lib/logger";
import config from "./config/default";
import * as jwt from "koa-jwt";

// Create Demo Test Data
import "./lib/test_data";

// API Endpoints
import apiIndex from "./api";
import apiAuth from "./api/auth";
import apiAppointment from "./api/appointment";

// App
const app = new Koa();
const PORT = process.env.PORT || config.server.port;

// Logger
app.use(koaLogger);

// Custom 401 handling if you don't want to expose koa-jwt errors to users
app.use(function (ctx, next) {
    return next().catch((err) => {
        if (401 === err.status) {
            ctx.status = 401;
            ctx.body = "Protected resource, use Authorization header to get access";
        } else {
            throw err;
        }
    });
});

// CORS
app.use(cors({
    origin: "*",
    exposeHeaders: [ "WWW-Authenticate", "Server-Authorization" ],
    maxAge: 0,
    credentials: true,
    allowMethods: [ "GET", "POST", "OPTIONS" ],
    allowHeaders: [ "Content-Type", "Authorization", "Accept", "WithCredentials",
        "X-Requested-With", "X-Forwarded-For", "X-Real-Ip", "X-CustomHeader",
        "User-Agent", "Keep-Alive", "Host", "Connection", "Upgrade",
        "Dnt", "If-Modified-Since", "Cache-Control" ]
}));

// Middleware below this line is only reached if JWT token is valid
// unless the URL starts with '/public'
app.use(jwt({ secret: config.jwt.secret }).unless({ path: [/^\/auth/, "/"] }));

app.use(compress({
   threshold: 1024,
    flush: require("zlib").Z_SYNC_FLUSH
}));

// Body Parser
app.use(bodyParser());

// Public Routes
app.use(apiIndex.routes());
app.use(apiAuth.routes());

// Secure Routes
app.use(apiAppointment.routes());

// Server
const server = app.listen(PORT, () => {
    logger.info(`Server listening on port: ${PORT}`);
});

export default server;
