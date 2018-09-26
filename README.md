
# DEMO SCHEDULER API
API backend for the SPI client side "scheduler-api" application.

### Requirements
- node version 8.11.x or later
- npm version 6.4.x or later

------------


### Setting up a production build environment for deployment
1. Execute command "npm ci" from console/terminal to install module dependencies
2. Execute command "npm run builld" to build production files.  Production files will be installed in root folder ".build"
3. Test build by executing command "npm run server" to launch the server on port 9443.

------------


### Developing with the API site
If you are on Windows, do this first to install python, msbuild, etc:
```
npm i -g windows-build-tools
```
 Development instance can be started by executing command "npm start" or "npm run dev".

------------


### API Schema
- GET "/" - Returns API version and meta data
 
  ACCESS: Public
  
  PARAMS: None

  RETURN:
  ```
      {
        success: boolean,
        data: {
          version: number
          data: string
        }
      }
  ```

------------

- POST "/auth/login" - User JWT authentication

  ACCESS: Public
   
  PARAMS:
  ```
      username: string
      password: string
  ```

  RETURN:
  ```
      {
        success: boolean,
        data: {
          username: string
          uuid: string
          firstname: string
          lastname: string
          email: string
          token: string (JWT Authentication Token)
        }
      }
  ```

------------

- GET "/api/appointment" - Returns all schedule date for the date range specified.

  ACCESS: Authentication token required
   
  PARAMS:
  ```
      apptStartTimestampUTC: string
      apptEndTimestampUTC: string
  ```

  RETURN:
  ```
      [
        success: boolean,
        data: [
          {
            username: string (Only shows the username for the logged in user, otherwise blank)
            startTimestampUTC: string
            endTimestampUTC: string
            comment: string (same as username - only shows comments for logged in user)
          }
          ...
        ]
      }
  ```

------------

- POST "/api/appointment" - Adds user/paitient appointment for specified date and time.

  ACCESS: Authentication token required
   
  PARAMS:
  ```
       username: string
       startTimestampUTC: string  ** Calendar start date timestamp
       endTimestampUTC: string ** Calendar end date timestamp
       apptStartTimestampUTC: string ** Appointment start timestamp
       apptEndTimestampUTC: string ** Appointment start timestamp
       comment: string
  ```

  RETURN: 
  ```
      [
        success: boolean,
        data: [
          {
            username: string (Only shows the username for the logged in user, otherwise blank)
            startTimestampUTC: string
            endTimestampUTC: string
            comment: string (same as username - only shows comments for logged in user)
          }
          ...
        ]
      }
  ```

