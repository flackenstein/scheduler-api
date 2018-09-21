// This file will generate random appointment data for a three month span that
// includes the month prior through the next.
// Appointments will be random and will be contained to the hours and days defined in the default config.
import * as moment from "moment";
import config from "../config/default";
import * as bcrypt from "bcryptjs";

export interface TypeAppointment {
    username: string;
    startTimestampUTC: string;
    endTimestampUTC: string;
    comment?: string;
}

export interface TypeUserOptions {
    username: string;
    password: string;
    firstname?: string;
    lastname?: string;
    email?: string;
}

export interface TypeUser {
    username: string;
    hash: string;
    uuid: string;
    firstname: string;
    lastname: string;
    email: string;
    token?: string;
}

export let Users: TypeUser[] = [];
export let Appointments: TypeAppointment[] = [];


const createUsers = (): TypeUser[] => {
    const salt = bcrypt.genSaltSync();
    return [
        {
            username: "demo",
            hash: bcrypt.hashSync("demo", salt),
            uuid: "8e2eaafb-8193-45cb-ac12-b428e6a620a1",
            firstname: "Demo",
            lastname: "User",
            email: "demo.user@email.com"
        }, {
            username: "alice",
            hash: bcrypt.hashSync("alice", salt),
            uuid: "4a3337ad-64ce-448d-8414-c2e1839a6ad3",
            firstname: "Alice",
            lastname: "User",
            email: "alice.user@email.com"
        }, {
            username: "bob",
            hash: bcrypt.hashSync("bob", salt),
            uuid: "a0a42b47-17c1-4253-a388-0252b1c5f889",
            firstname: "Bob",
            lastname: "User",
            email: "bob.user@email.com"
        }, {
            username: "charlie",
            hash: bcrypt.hashSync("charlie", salt),
            uuid: "c8572b0d-ca95-4d34-8113-0905fb173faf",
            firstname: "Charlie",
            lastname: "User",
            email: "charlie.user@email.com"
        }, {
            username: "eve",
            hash: bcrypt.hashSync("eve", salt),
            uuid: "fb9955ba-e026-409c-922c-6cbbf1e6d208",
            firstname: "Eve",
            lastname: "User",
            email: "eve.user@email.com"
        }
    ];
};
const createAppointments = () => {
    const office = config.app.office;
    const startDate = moment(office.hours.startTime, "HH:mm").subtract(2, "months");
    const startHour = startDate.hour();
    const endDate = moment(office.hours.endTime, "HH:mm").add(4, "months");
    const diffDays = endDate.diff(startDate, "days");
    const diffHours = moment(office.hours.endTime, "HH:mm").diff(moment(office.hours.startTime, "HH:mm"), "hours");
    const usernames = ["demo", "alice", "bob", "charlie", "eve"];
    const appointments = [];

    // Random data generator
    for (let x = 0; x < diffDays; x++) {

        for (let y = 0; y < diffHours; y++) {

            // Create an appointment record if the random number threshold is met
            if (Math.floor(Math.random() * 10) > 8) {
                const username = usernames[Math.floor(Math.random() * usernames.length)];
                const start = startDate.format("YYYY-MM-DD HH:mm:00");
                const end = moment(startDate).add(1, "hour").format("YYYY-MM-DD HH:mm:00");

                appointments.push({
                    username: username,
                    startTimestampUTC: start,
                    endTimestampUTC: end,
                    comment: `Appointment made for ${username} by test data`
                });
            }

            startDate.add(1, "hour");
        }

        // Add a day and reset the clock
        startDate.set({ hour: startHour }).add(1, "day");

    }

    return appointments;
};

const createData = async () => {
    Users = await createUsers();
    Appointments = await createAppointments();
};

createData();
