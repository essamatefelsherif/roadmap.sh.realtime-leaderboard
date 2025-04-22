# Real-time Leaderboard

A backend system implemented in node.js for a real-time leaderboard service for ranking and scoring.

[![Static Badge](https://img.shields.io/badge/roadmap.sh-realtime_leaderboard-blue?logo=roadmap.sh)](https://roadmap.sh/projects/realtime-leaderboard-system)

## Installation

```sh
npm install [-g] @essamonline/leaderboard-api
```

## Features

The system features user authentication, score submission, real-time leaderboard updates, and score history tracking using [Redis](https://redis.io/), the most popular NoSQL in-memory key-value data store.

* **User Authentication**: Users should be able to register and log in to the system.
* **Score Submission**: Users should be able to submit their scores for different games or activities.
* **Leaderboard Updates**: Display a global leaderboard showing the top users across all games.
* **User Rankings**: Users should be able to view their rankings on the leaderboard.
* **Top Players Report**: Generate reports on the top players for a specific period.

## API Documentation

### Authentication

* POST .../api/auth
* Creates none-existing user and responds with JWT token.
* Request payload: { username: user@1, password: pwd }.
* Response status code, message and payload:
  - 200 OK **{ token: 'JSON Web Token' }**.
  - 400 Bad Request **Authentication Error: none or invalid request payload**.
  - 400 Bad Request **Authentication Error: no username given**.
  - 400 Bad Request **Authentication Error: no password given**.
  - 401 Unauthorized **Authentication Error: username already exists**.

* PUT .../api/auth
* Updates an existing user's password and responds with JWT token.
* Request payload: { username: user@1, pwd: password }.
* Request payload: { username: user@1, pwd: password, newpassword: newpwd }.
* Response status code, message and payload:
  - 200 OK **{ token: 'JSON Web Token' }**.
  - 400 Bad Request **Authentication Error: none or invalid request payload**.
  - 400 Bad Request **Authentication Error: no username given**.
  - 400 Bad Request **Authentication Error: no password given**.
  - 401 Unauthorized **Authentication Error: username does not exist**.


### Score submission


### Leaderboard
 

## Testing and Documentation

Source code documentation along with a test coverage report are both included under [Documentation](https://essamatefelsherif.github.io/roadmap.sh.realtime-leaderboard/).

## Node version support

**leaderboard-api** supports all currently maintained Node versions. See the [Node Release Schedule](https://github.com/nodejs/Release#release-schedule).

## License

This software is licensed under the MIT license, see the [LICENSE](./LICENSE "LICENSE") file.
