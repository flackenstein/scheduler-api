import * as Router from "koa-router";
import { ctx_error_handler } from "../lib/nodash";
import * as Appointment from "../query/appointment";
import * as User from "../query/user";
import { Users } from "../lib/test_data";
import * as moment from "moment";

const router = new Router();
const BASE_URL = "/api";

router.get(`${BASE_URL}/appointment/`, async (ctx: any) => {
    // Extract username from json web token
    const user = Users.find(u => u.uuid === ctx.state.user.sub);

    if (user === undefined) return ctx_error_handler(ctx, null);

    try {
        ctx.body = {
            success: true,
            data: Appointment.getAppointments(user.username, ctx.query.startDateUTC, ctx.query.endDateUTC)
        };
    } catch (err) {
        ctx_error_handler(ctx, err);
    }
});

router.post(`${BASE_URL}/appointment/`, async (ctx: any) => {
    const user = await User.getUserByUUID(ctx.state.user.sub);
    const body = ctx.request.body;

    // Calendar Active Date Range
    const startTimestampUTC = body.startTimestampUTC;
    const endTimestampUTC = body.endTimestampUTC;

    // Appointment details
    const apptStartTimestampUTC = body.apptStartTimestampUTC;
    const apptEndTimestampUTC = body.apptEndTimestampUTC;
    const comment = body.comment || "";

    // Validate parameters
    if (!user || !startTimestampUTC || !endTimestampUTC || !apptStartTimestampUTC || !apptEndTimestampUTC) {
        return ctx_error_handler(ctx, "Invalid appointment parameters passed");
    }

    // Verify requested appointment start time is scheduled for the future
    if (moment().isAfter(moment.utc(apptStartTimestampUTC))) {
        return ctx_error_handler(ctx, "Requested appointment data has been rejected.  Date must be scheduled in the future");
    }

    // Book requested appointment
    const appointment = {
        username: user.username,
        startTimestampUTC: apptStartTimestampUTC,
        endTimestampUTC: apptEndTimestampUTC,
        comment: comment
    };

    if (await Appointment.setAppointment(appointment) === false) {
        return ctx_error_handler(ctx, "Scheduling conflict.  Please pick another time");
    }

    // Return updated appointment list for calendar
    try {
        ctx.body = {
            success: true,
            data: await Appointment.getAppointments(user.username, startTimestampUTC, endTimestampUTC)
        };
    } catch (err) {
        ctx_error_handler(ctx, err);
    }
});

export default router;
