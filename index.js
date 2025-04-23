/**
 * @module  leaderboard-api
 * @desc    The leaderboard-api main module.
 * @version 1.0.0
 * @author  Essam A. El-Sherif
 */

/* Import node.js core modules */
import crypto            from 'node:crypto';
import fs                from 'node:fs';
import http              from 'node:http';
import https             from 'node:https';
import process           from 'node:process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

/* Import package dependencies */
import express from 'express';
import morgan  from 'morgan';
import dotenv  from 'dotenv';
import redis   from 'redis';

/**
 * @func  expressjwt
 * @param {object} options
 * @desc  Third-party middleware function.
 */
import { expressjwt } from 'express-jwt';

/**
 * @const {object} authRouter - Authentication router object.
 * @see   module:auth-route.router
 */
import { router as authRouter } from './route-auth/index.js';

/**
 * @const {object} scoreRouter - Score router object.
 * @see   module:score-route.router
 */
import { router as scoreRouter } from './route-score/index.js';

/**
 * @const {object} leaderboardRouter - Leaderboard router object.
 * @see   module:leaderboard-route.router
 */
import { router as leaderboardRouter } from './route-leaderboard/index.js';

/* Emulate commonJS __filename and __dirname constants */
const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

/* Configure dotenv path to read the package .env file */
dotenv.config({path: join(__dirname, './.env')});

/** @const {object} appOptions - The application options. */
const appOptions = {
	serverProt: process.env.lb_serverProtocol,
	serverCert: process.env.lb_serverCert,
	serverKey : process.env.lb_serverKey,
	serverHost: process.env.lb_serverHost,
	serverPort: process.env.lb_serverPort,
	serverPath: process.env.lb_serverPath,
	secretKey : crypto.randomBytes(32).toString('hex'),
	connectRd : process.env.lb_connectRedis,
	serverName: `${process.env.lb_serverName} (${process.platform}) NodeJS/${process.version.substring(1)}`,
	verbose: true,
};

/**
 * @const {object} app - The express app object.
 * @desc  The express app object conventionally denotes the express application.
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

/* Endpoint: .../  Method: GET */
app.get(`${appOptions.serverPath}`, (req, res) => {

	let resBody = '';
	resBody += `${appOptions.serverHost}:${appOptions.serverPort}\n`;
	resBody += `${req.app.get('serverName')}\n`;

	res.setHeader('Server', req.app.get('serverName'));
	res.status(200).send(resBody);
});

/* Endpoint: .../auth */
app.use(`${appOptions.serverPath}/auth`, authRouter);

/* Endpoint: .../score */
app.use(`${appOptions.serverPath}/score`, expressjwt({ secret: app.get('secretKey'), algorithms: ['HS256'] }), scoreRouter);

/* Endpoint: .../leaderboard */
app.use(`${appOptions.serverPath}/leaderboard`, expressjwt({ secret: app.get('secretKey'), algorithms: ['HS256'] }), leaderboardRouter);

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

/* Start the application server */

let serverOptions = {};
let serverModule = http;

if(appOptions.serverProt === 'https'){

	try{
		serverOptions.key  = fs.readFileSync(join(__dirname, appOptions.serverKey));
		serverOptions.cert = fs.readFileSync(join(__dirname, appOptions.serverCert));

		serverModule = https;
	}
	catch(err){
		appOptions.serverProt = 'http';
		serverModule = http;
	}
}

/** @const {object} server - The http/https server object. */
const server = serverModule.createServer(serverOptions, app)

	.listen(appOptions.serverPort, appOptions.serverHost, () => {

		const {port, address:host} = server.address();

		appOptions.verbose && console.log(
			`... leaderboard-api server is listening to ${appOptions.serverProt}://${host}:${port}`
		);
		appOptions.verbose && console.log(
			'... Press CTRL-C to terminate'
		);
		appOptions.verbose && console.log();
	})
	.on('error', (err) => {
		appOptions.verbose && console.error(err.code, err.message);
	});
