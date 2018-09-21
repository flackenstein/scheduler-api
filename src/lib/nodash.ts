// This file contains helper methods
// Note: nodash is a generic name for helper methods that go out of there way to not use underscore, dash, lodash..
import * as Moment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);

import { logger } from "../lib/logger";

// SQL METHODS

export const sql_format = (sql: string): string => {
    // sql_format Example:
    //
    //  let sql = sql_format(`
    //      select
    //          *  --sql_format will remove line comments
    //          /*  sql_format will also remove block comments
    //              a,
    //              b,
    //              c
    //          */
    //      from  tablename
    //      `);
    //
    // Result: "select * from tablename"

    if (typeof sql === "string") {
        return sql
            .replace(/--.*/g, "") // remove any '--' comments
            .replace(/[\n\t]+/g, " ") // replace newline and tabs with space
            .replace(/\/\*.*\*\//g, "") // remove any '/*...*/' comments
            .replace(/(^\s+|\s+$)/g, "") // remove leading and trailing spaces
            .replace(/\s+/g, " "); // replace multiple spaces with single space
    } else {
        return "";
    }
};

// CTX METHODS

export const ctx_error_handler = (ctx: any, err: any) => {
    logger.error(err);
    ctx.body = {
        success: false,
        data: {}
    };
};

// DATE & TIME METHODS

export const isDateTimestampConflict = (dates: [string, string][], startTimestamp: string, endTimestamp: string): boolean => {
    // Compares dates array records against start and end timestamp for range overlaps
    const isConflict = dates.find(dt => {
        const [start, end] = dt;
        const range1 = moment.range(moment(start), moment(end));
        const range2 = moment.range(moment(startTimestamp), moment(endTimestamp));
        return range1.overlaps(range2);
    });

    return !!isConflict;
};
