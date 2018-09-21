import * as Router from "koa-router";
import * as User from "../query/user";
import { logger } from "../lib/logger";
import * as jsonwebtoken from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import config from "../config/default";

const router = new Router();

const ctx_authentication_error = (ctx: any) => {
    ctx.status = 400;
    ctx.body = {
        success: false,
        data: "authentication error"
    };
};

router.post("/auth/login", async (ctx: any, next) => {
    const { username, password } = ctx.request.body.hasOwnProperty("username") ? ctx.request.body : ctx.query;

    // Validate username and password parameters
    if (!username || !password) {
        return ctx_authentication_error(ctx);
    }

    logger.info(`Authenticating user "${username}"`);

    // Fetch user by username
    let user = await User.getUserByUsername(username);

    if (user === undefined) return ctx_authentication_error(ctx);  // Note: typescript convention -- have to explicitly check for undefined or it throws errors

    // Compare passwords
    if (await bcrypt.compare(password, user.hash)) {
        const dt = new Date();
        const token = jsonwebtoken.sign({
            iss: config.jwt.issuer,
            sub: user.uuid,
            aud: config.jwt.audience,
            nbf: Math.floor(dt.getTime() / 1000),
            iat: Math.floor(dt.getTime() / 1000),
            exp: Math.floor(dt.setDate(dt.getDate() + 1) / 1000) // current time + 1 day ahead
        }, config.jwt.secret);

        ctx.body = {
            success: true,
            data: {
                username: user.username,
                uuid: user.uuid,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                token: token
            }
        };
        return next();

    }

    // If no user was found or password mismatch then reject request
    return ctx_authentication_error(ctx);

});

export default router;
