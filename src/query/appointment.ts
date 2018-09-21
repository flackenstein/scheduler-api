import { Appointments, TypeAppointment } from "../lib/test_data";
import { isDateTimestampConflict } from "../lib/nodash";
import * as moment from "moment";


export const getAppointments = (username: string, startDateUTC: string, endDateUTC: string): TypeAppointment[] => {
    const appointments: TypeAppointment[] = [];
    Appointments.map(appt => {
        if (moment(appt.startTimestampUTC).isSameOrAfter(startDateUTC) && moment(appt.endTimestampUTC).isSameOrBefore(endDateUTC)) {
            // Clear username & comment from record if it's not the requesting username
            appointments.push({
                username: appt.username === username ? appt.username : "",
                startTimestampUTC: appt.startTimestampUTC,
                endTimestampUTC: appt.endTimestampUTC,
                comment: appt.username === username ? appt.comment : "",
            });
        }
    });

    return appointments;
};

export const setAppointment = (appointment: TypeAppointment): boolean => {
    // Get appointment dates for range overlap check
    const dates = Appointments.map(appt => [appt.startTimestampUTC, appt.endTimestampUTC]);

    // Check for schedule conflicts and insert new appointment if non exist
    const isConflict = isDateTimestampConflict([], appointment.startTimestampUTC, appointment.endTimestampUTC);

    // Add new appointment
    if (isConflict === false) {
        const apptStart = moment(appointment.startTimestampUTC);
        const apptEnd = moment(appointment.endTimestampUTC);

        const spliceIndex = Appointments.findIndex((a: TypeAppointment) => {
            if (apptStart.isSameOrAfter(a.endTimestampUTC) && apptEnd.isSameOrBefore(a.startTimestampUTC)) {
                return true;
            }
            return false;
        });

        Appointments.splice(spliceIndex, 0, appointment);

        return true;
    }

    return false;
};
