import { Users } from "../lib/test_data";
import { TypeUser } from "../lib/test_data";


export const getUserByUsername = (username: string): TypeUser | undefined => {
    // Real code would execute an async/await call to a db query and passback the result
    // example:
    // const result = await db.query("patient", sql.auth.getUserByUsername, [username]);
    // return !!result.success && result.data[0] ? result.data[0] : noData;

    // For the purpose of this demo will find username in Users test data array
    const User = Users.find((user: TypeUser) =>  user.username === username);
    return User;
};

export const getUserByUUID = (uuid: string): TypeUser | undefined => {
    const User = Users.find((user: TypeUser) => user.uuid === uuid);
    return User;
};
