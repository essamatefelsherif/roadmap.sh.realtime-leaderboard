# Real-time Leaderboard

A backend system implemented in node.js for a real-time leaderboard service for ranking and scoring. The system features user authentication, score submission, real-time leaderboard updates, and score history tracking using [Redis](https://redis.io/), the most popular NoSQL in-memory key-value data store.

[![Static Badge](https://img.shields.io/badge/roadmap.sh-realtime_leaderboard-blue?logo=roadmap.sh)](https://roadmap.sh/projects/realtime-leaderboard-system)

## Installation

```sh
npm install [-g] @essamonline/leaderboard-api
```

## Features

* **User Authentication**: Users should be able to register and log in to the system.
* **Score Submission**: Users should be able to submit their scores for different games or activities.
* **Leaderboard Updates**: Display a global leaderboard showing the top users across all games.
* **User Rankings**: Users should be able to view their rankings on the leaderboard.
* **Top Players Report**: Generate reports on the top players for a specific period.

## API Documentation

### Authentication

**POST .../api/auth**
* *Creates none-existing user and responds with JWT token.*
* Request payload: **{ username: user@1, password: pwd }**.
* Response status code, message and payload:
  - 200 OK ... **{ token: <JSON Web Token> }**.
  - 400 Bad Request ... **Authentication Error: none or invalid request payload**.
  - 400 Bad Request ... **Authentication Error: no username given**.
  - 400 Bad Request ... **Authentication Error: no password given**.
  - 401 Unauthorized ... **Authentication Error: username already exists**.


**PUT .../api/auth**
* *Updates an existing user password and responds with JWT token, or just responds with JWT token when no new password was given.*
* Request payload: **{ username: user@1, pwd: password }**.
* Request payload: **{ username: user@1, pwd: password, newpassword: newpwd }**.
* Response status code, message and payload:
  - 200 OK ... **{ token: <JSON Web Token> }**.
  - 400 Bad Request ... **Authentication Error: none or invalid request payload**.
  - 400 Bad Request ... **Authentication Error: no username given**.
  - 400 Bad Request ... **Authentication Error: no password given**.
  - 401 Unauthorized ... **Authentication Error: username does not exist**.
  - 401 Unauthorized ... **Authentication Error: invalid password**.


**PATCH .../api/auth**
* *Deletes an existing user and removes all her activities scores.*
* Request payload: **{ username: user@1, pwd: password }**.
* Response status code, message and payload:
  - 204 OK.
  - 400 Bad Request ... **Authentication Error: none or invalid request payload**.
  - 400 Bad Request ... **Authentication Error: no username given**.
  - 400 Bad Request ... **Authentication Error: no password given**.
  - 401 Unauthorized ... **Authentication Error: username does not exist**.
  - 401 Unauthorized ... **Authentication Error: invalid password**.


**GET .../api/auth**
* *Retrieves a comma separated list of usernames.*
* Response status code, message and payload:
  - 200 OK ... **user@1,user@2,user@3**.


### Score submission


**POST .../api/score**
* *Submits user's new score for an activity, which will be created if not exists.*
* Request payload: **{ activity: 'activity-1', score: 200 }**.
* Request authorization header: **Authorization: Bearer <JSON Web Token>**
* Response status code, message and payload:
  - 201 Created ... **{activity: 'activity-1', username: 'user@1', score: '200'}**.
  - 401 Unauthorized ... **Authorization Error: No authorization token was found**.
  - 400 Bad Request ... **Submission Error: none or invalid request payload**.
  - 400 Bad Request ... **Submission Error: no activity given**.
  - 400 Bad Request ... **Submission Error: no score given**.




### Leaderboard
 

## Testing and Documentation

Source code documentation along with a test coverage report are both included under [Documentation](https://essamatefelsherif.github.io/roadmap.sh.realtime-leaderboard/).

## Node version support

**leaderboard-api** supports all currently maintained Node versions. See the [Node Release Schedule](https://github.com/nodejs/Release#release-schedule).

## License

This software is licensed under the MIT license, see the [LICENSE](./LICENSE "LICENSE") file.
