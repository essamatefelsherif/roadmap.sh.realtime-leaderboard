/**
 * @module  leaderboard-api
 * @desc    The leaderboard-api main module.
 * @version 1.0.0
 * @author  Essam A. El-Sherif
 */

/* Import node.js core modules */
import process from 'node:process';

/* Import package dependencies */
import express from 'express';
import morgan  from 'morgan';
import dotenv  from 'dotenv/config';
import redis   from 'redis';

/**
 * @func  expressjwt
 * @param {object} options
 * @desc  third-party middleware function.
 */
import { expressjwt } from 'express-jwt';

/**
 * @const {object} authRouter - Authentication router object.
 * @see   module:leaderboard-api-auth-router.router
 */
import { router as authRouter } from './route-auth/index.js';

/**
 * @const {object} activityRouter - Activity router object.
 * @see   module:leaderboard-api-activity-router.router
 */
import { router as activityRouter } from './route-score/index.js';

/**
 * @const {object} leaderboardRouter - Leaderboard router object.
 * @see   module:leaderboard-api-leaderboard-router.router
 */
import { router as leaderboardRouter } from './route-leaderboard/index.js';

/** @const {object} appOptions - The application options. */
const appOptions = {
	serverHost: process.env.lb_serverHost,
	serverPort: process.env.lb_serverPort,
	secretKey : process.env.lb_secretKey,
	connectRd : process.env.lb_connectRedis,
	serverName: `${process.env.lb_serverName} (${process.platform}) NodeJS/${process.version.substring(1)}`,
	verbose: true,
};

/**
 * @const {object} app - The express app object.
 * @desc  The express app object conventionally denotes the Express application.
 */
const app = express();

/* Application built-in settings */
app.set('x-powered-by', false);
app.set('etag', false);

/* Application User-defined settings */
app.set('serverName', appOptions.serverName);
app.set('secretKey',  appOptions.secretKey);

app.set('redisKeyUser',     'lb:user:');
app.set('redisKeyActivity', 'lb:act:');
app.set('redisKeyTimestamp','lb:ts:');

/*
 * Use morgan() third-party middleware function
 * for logging HTTP requests, only if verbose is true.
 */
appOptions.verbose && app.use(morgan('common', { immediate: true }));

/*
 * Use express.json() built-in middleware function
 * for parsing incoming requests with JSON payloads.
 */
app.use(express.json());

/* Endpoint: /auth */
app.use('/auth', authRouter);

/* Endpoint: /score */
app.use('/score', expressjwt({ secret: app.get('secretKey'), algorithms: ['HS256'] }), activityRouter);

/* Endpoint: /leaderboard */
app.use('/leaderboard', expressjwt({ secret: app.get('secretKey'), algorithms: ['HS256'] }), leaderboardRouter);

/* Error Handling */
app.use((err, req, res, next) => {

	if(err.name === 'UnauthorizedError'){
		res.status(401).send(`Authorization Error: ${err.message}`);
	}
	else{
		next();
	}
});

/*
 * https://github.com/redis/node-redis
 *
 * Connect to Redis and attach a node-redis Client instance to app.
 * Create a node-redis Client instance, or throws on failure.
 */
try{
	app.set('clientRd',
		redis.createClient({
			url: appOptions.connectRd,
			name: 'leaderboard-api'
		})
		.on('error', (err) => {
    		console.error(err.message);
    		process.exit(1);
		})
	);

	/*
 	 * Since v4 of node-redis, the client does not automatically connect to the server.
	 * Instead you need to run .connect() after creating the client or you will receive an error.
	 */
	await app.get('clientRd').connect();

	appOptions.verbose && console.log(`... Redis database server is connected`);
}
catch(err){
	console.error(err.message);
	process.exit(1);
}

/** @const {object} server - The express server object. */
const server = app.listen(appOptions.serverPort, appOptions.serverHost, () => {

	const {port, address:host} = server.address();

	appOptions.verbose && console.log(`... leaderboard-api server is listening to ${host}:${port}`);
	appOptions.verbose && console.log('... Press CTRL-C to terminate');
	appOptions.verbose && console.log();
});

server.on('error', (err) => {
	appOptions.verbose && console.error(err.code, err.message);
});
