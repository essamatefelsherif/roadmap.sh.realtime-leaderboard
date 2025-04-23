# Real-time Leaderboard

A backend system implemented in node.js for a real-time leaderboard service for ranking and scoring. The system features a *configurable environment*, *support for http/https*, *user authentication*, *score submission*, *real-time leaderboard updates*, and *score history tracking* using [Redis](https://redis.io/), the most popular NoSQL in-memory key-value data store.

[![Static Badge](https://img.shields.io/badge/roadmap.sh-realtime_leaderboard-blue?logo=roadmap.sh)](https://roadmap.sh/projects/realtime-leaderboard-system)
[![NPM Version](https://img.shields.io/npm/v/%40essamonline%2Fleaderboard-api?logo=npm)](https://www.npmjs.com/package/@essamonline/leaderboard-api)
[![NPM Downloads](https://img.shields.io/npm/d18m/%40essamonline%2Fleaderboard-api?logo=npm&color=lightgreen)](https://www.npmjs.com/package/@essamonline/leaderboard-api)


## Installation

```sh
npm install [-g] @essamonline/leaderboard-api
```

## Features

* **Configurable Environmentt**: Load environment variables from a **'.env'** file using [dotenv](https://www.npmjs.com/package/dotenv) package.
* **HTTP/HTTPS**: Provide the path to the key and certificate files if HTTPS was chosen.
* **User Authentication**: Users will register and log in to the system using [JSON Web Tokens](https://jwt.io/introduction).
* **Score Submission**: Users will submit their scores for different activities.
* **Leaderboard Updates**: Users can retrieve a global leaderboard showing the top users across all activities.
* **User Rankings**: Users can retrieve their rankings on the leaderboard.
* **Top Users Report**: Generate reports on the top players for a specific period.


**Sample '.env' file located at the package root directory:**
```
############### leaderboard-api  ###############
lb_serverProtocol=https
lb_serverKey=cert/localhost.key
lb_serverCert=cert/localhost.cert
lb_serverHost=localhost
lb_serverPort=8080
lb_serverPath=/api
lb_serverName=leaderboard-api/1.0.0
lb_connectRedis=redis://localhost:6379
```

## API Documentation

### Authentication

#### [POST .../api/auth]()
* *Creates a nonexistent user and responds with JWT token.*
* Request payload: **{ username: user@1, password: pwd }**.
* Response status code, message and payload:
  - 200 OK ... **{ token: \<JSON Web Token\> }**.
  - 400 Bad Request ... **Authentication Error: none or invalid request payload**.
  - 400 Bad Request ... **Authentication Error: no username given**.
  - 400 Bad Request ... **Authentication Error: no password given**.
  - 401 Unauthorized ... **Authentication Error: username already exists**.

#### [PUT .../api/auth]()
* *Updates an existing user password if new password was given and responds with JWT token.*
* Request payload: **{ username: user@1, pwd: password }**.
* Request payload: **{ username: user@1, pwd: password, newpassword: newpwd }**.
* Response status code, message and payload:
  - 200 OK ... **{ token: \<JSON Web Token\> }**.
  - 400 Bad Request ... **Authentication Error: none or invalid request payload**.
  - 400 Bad Request ... **Authentication Error: no username given**.
  - 400 Bad Request ... **Authentication Error: no password given**.
  - 401 Unauthorized ... **Authentication Error: username does not exist**.
  - 401 Unauthorized ... **Authentication Error: invalid password**.

#### [PATCH .../api/auth]()
* *Deletes an existing user and removes all user's activities scores.*
* Request payload: **{ username: user@1, pwd: password }**.
* Response status code, message and payload:
  - 204 No Content.
  - 400 Bad Request ... **Authentication Error: none or invalid request payload**.
  - 400 Bad Request ... **Authentication Error: no username given**.
  - 400 Bad Request ... **Authentication Error: no password given**.
  - 401 Unauthorized ... **Authentication Error: username does not exist**.
  - 401 Unauthorized ... **Authentication Error: invalid password**.

#### [GET .../api/auth]()
* *Retrieves a comma separated list of usernames.*
* Request payload: none.
* Response status code, message and payload:
  - 200 OK ... **user@1,user@2,user@3**.

### Score submission

#### [POST .../api/score]()
* *Submits user's score for an activity that will be created if nonexistent.*
* Request payload: **{ activity: 'activity-1', score: 200 }**.
* Request authorization header: **Authorization: Bearer \<JSON Web Token\>**
* Response status code, message and payload:
  - 201 Created ... **{activity: 'activity-1', username: 'user@1', score: '200'}**.
  - 401 Unauthorized ... **Authorization Error: No authorization token was found**.
  - 400 Bad Request ... **Submission Error: none or invalid request payload**.
  - 400 Bad Request ... **Submission Error: no activity given**.
  - 400 Bad Request ... **Submission Error: no score given**.

#### [PATCH .../api/score]()
* *Removes user's score for an activity.*
* Request payload: **{ activity: 'activity-1' }**.
* Request authorization header: **Authorization: Bearer \<JSON Web Token\>**
* Response status code, message and payload:
  - 204 No Content.
  - 401 Unauthorized ... **Authorization Error: No authorization token was found**.
  - 400 Bad Request ... **Submission Error: none or invalid request payload**.
  - 400 Bad Request ... **Submission Error: no activity given**.

#### [DELETE .../api/score]()
* *Remove user's scores for all activities.*
* Request payload: none.
* Request authorization header: **Authorization: Bearer \<JSON Web Token\>**
* Response status code, message and payload:
  - 204 No Content.
  - 401 Unauthorized ... **Authorization Error: No authorization token was found**.

### Leaderboard

#### [GET .../api/leaderboard/global]()
* *Retrieve a leaderboard array of objects for all activities with rank.*
* Request payload: none.
* Request authorization header: **Authorization: Bearer \<JSON Web Token\>**
* Response status code, message and payload:
  - 200 OK ... **[{ activity: 'activity-3', username: 'user@3', score: '330', rank: 1 }, ...]**.
  - 401 Unauthorized ... **Authorization Error: No authorization token was found**.

#### [GET .../api/leaderboard/global/top]()
* *Retrieve a leaderboard array of objects for top 5 activities with rank.*
* Request payload: none.
* Request authorization header: **Authorization: Bearer \<JSON Web Token\>**
* Response status code, message and payload:
  - 200 OK ... **[{ activity: 'activity-3', username: 'user@3', score: '330', rank: 1 }, ...]**.
  - 401 Unauthorized ... **Authorization Error: No authorization token was found**.

#### [GET .../api/leaderboard/global/top/:count]()
* *Retrieve a leaderboard array of objects for top \<count\> activities with rank.*
* Request payload: none.
* Request authorization header: **Authorization: Bearer \<JSON Web Token\>**
* Response status code, message and payload:
  - 200 OK ... **[{ activity: 'activity-3', username: 'user@3', score: '330', rank: 1 }, ...]**.
  - 401 Unauthorized ... **Authorization Error: No authorization token was found**.

#### [GET .../api/leaderboard/global/user/:username]()
* *Retrieve a leaderboard array of objects for user's activities with rank.*
* Request payload: none.
* Request authorization header: **Authorization: Bearer \<JSON Web Token\>**
* Response status code, message and payload:
  - 200 OK ... **[{ activity: 'activity-3', username: 'user@3', score: '330', rank: 1 }, ...]**.
  - 401 Unauthorized ... **Authorization Error: No authorization token was found**.

#### [GET .../api/leaderboard/:activity]()
* *Retrieve an array of objects for the given activity with rank.*
* Request payload: none.
* Request authorization header: **Authorization: Bearer \<JSON Web Token\>**
* Response status code, message and payload:
  - 200 OK ... **[{ activity: 'activity-3', username: 'user@3', score: '330', rank: 1 }, ...]**.
  - 401 Unauthorized ... **Authorization Error: No authorization token was found**.

#### [GET .../api/leaderboard/:activity/top]()
* *Retrieve an array of objects for the given activity top 5 scores with rank.*
* Request payload: none.
* Request authorization header: **Authorization: Bearer \<JSON Web Token\>**
* Response status code, message and payload:
  - 200 OK ... **[{ activity: 'activity-3', username: 'user@3', score: '330', rank: 1 }, ...]**.
  - 401 Unauthorized ... **Authorization Error: No authorization token was found**.

#### [GET .../api/leaderboard/:activity/top/:count]()
* *Retrieve an array of objects for the given activity top \<count\> scores with rank.*
* Request payload: none.
* Request authorization header: **Authorization: Bearer \<JSON Web Token\>**
* Response status code, message and payload:
  - 200 OK ... **[{ activity: 'activity-3', username: 'user@3', score: '330', rank: 1 }, ...]**.
  - 401 Unauthorized ... **Authorization Error: No authorization token was found**.

#### [GET .../api/leaderboard/:activity/user/:username]()
* *Retrieve an object with the given user's score and rank for the given activity.*
* Request payload: none.
* Request authorization header: **Authorization: Bearer \<JSON Web Token\>**
* Response status code, message and payload:
  - 200 OK ... **{ activity: 'activity-3', username: 'user@3', score: '330', rank: 1 }**.
  - 401 Unauthorized ... **Authorization Error: No authorization token was found**.

 

## Testing and Documentation

Source code documentation generated by [JSDoc 4.04](https://www.npmjs.com/package/jsdoc) along with a Test coverage report generated by [lcov](https://github.com/linux-test-project/lcov) are both included under [Documentation](https://essamatefelsherif.github.io/roadmap.sh.realtime-leaderboard/). **leaderboard-api** were tested using node.js 20.x LTS core module [Test runner](https://nodejs.org/docs/latest-v20.x/api/test.html).

## Node version support

**leaderboard-api** supports all currently maintained Node versions. See the [Node Release Schedule](https://github.com/nodejs/Release#release-schedule).

## License

This software is licensed under the MIT license, see the [LICENSE](./LICENSE "LICENSE") file.
