/**
 * @module  test-data
 * @desc    Module for creating, registering/unregistering test users/activities into the leaderboard-api server.
 * @version 1.0.0
 * @author  Essam A. El-Sherif
 */

/* Import node.js core modules */
import http               from 'node:http';
import https              from 'node:https';
import { fileURLToPath }  from 'node:url';
import { dirname, join }  from 'node:path';

/* Import package dependencies */
import dotenv from 'dotenv';

/* Emulate commonJS __filename and __dirname constants */
const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

/* Configure dotenv path to read the package .env file */
dotenv.config({path: join(__dirname, '../.env')});

/**
 * @class
 * @static
 * @desc Class for creating, registering/unregistering test users/activities into the leaderboard-api server.
 */
export class TestData{

	#prot = process.env.lb_serverProtocol || 'http';
	#host = process.env.lb_serverHost;
	#port = process.env.lb_serverPort;
	#path = process.env.lb_serverPath;

	#userPrefix = 'user@';
	#passwordPrefix = 'password-';
	#activityPrefix = 'activity-';

	#initUser = 'admin';
	#initPassword = 'admin';
	#initActivity = 'activity-a';

	#usersMap = new Map();
	#actsMap = new Map();

	/**
     * @method
	 * @instance
	 * @memberof module:leaderboard-api-test-data.TestData
	 * @param    {number} numUsers - Number of users to create.
	 * @param    {number} numActivities - Number of activities to create.
	 * @param    {boolean} init - To create special user/activity.
	 * @desc     Constructs and returns a TestData object.
	 */
	constructor(numUsers = 2, numActivities = 2, init = true){
		this.numUsers = numUsers;
		this.numActivities = numActivities;
		this.init = init;

		this.createTestUsers();
		this.createTestActivities();
	}

	/**
     * @method
	 * @instance
	 * @memberof module:leaderboard-api-test-data.TestData
	 * @desc     Create and keep a set of numUsers users.
	 */
	createTestUsers(){

		if(this.init){
			this.#usersMap.set(this.#initUser, {
				username: this.#initUser,
				password: this.#initPassword,
			});
		}

		for(let i = 1; i <= this.numUsers; i++){
			this.#usersMap.set(`${this.#userPrefix}${i}`, {
				username: `${this.#userPrefix}${i}`,
				password: `${this.#passwordPrefix}${i}`,
			});
		}
	}

	/**
     * @method
	 * @instance
	 * @memberof module:leaderboard-api-test-data.TestData
	 * @desc     Create and keep a set of numActivities activities.
	 */
	createTestActivities(){

		if(this.init){
			this.#actsMap.set(this.#initActivity, [{
				activity: this.#initActivity,
				username: this.#initUser,
				score: 100,
			}]);
		}

		for(let i = 1; i <= this.numActivities; i++){
			let acts = [];
			for(let j = 1; j <= this.numUsers; j++){
				acts.push({
					activity: `${this.#activityPrefix}${i}`,
					username: `${this.#userPrefix}${j}`,
					score: i * 100 + j * 10,
				});
			}
			this.#actsMap.set(`${this.#activityPrefix}${i}`, acts);
		}

	}

	/**
     * @member   testUsers
	 * @instance
	 * @readonly
	 * @memberof module:leaderboard-api-test-data.TestData
	 * @desc     Get an array of testUsers objects.
	 */
	get testUsers(){
		return [...this.#usersMap.values()];
	}

	/**
     * @member   testActivities
	 * @instance
	 * @readonly
	 * @memberof module:leaderboard-api-test-data.TestData
	 * @desc     Get an array of testActivities objects.
	 */
	get testActivities(){
		return [...this.#actsMap.values()].flat();
	}

	/**
     * @method
	 * @instance
	 * @memberof module:leaderboard-api-test-data.TestData
	 * @returns  {Promise} Promise object that will fulfill with an array of test users registered.
	 * @desc     Register the test users into the leaderboard-api server.
	 */
	registerTestUsers(){

		return Promise.all([...this.#usersMap.values()].map(user => new Promise((resolve) => {

			const url = `${this.#prot}://${this.#host}:${this.#port}${this.#path}/auth`;
			const module = this.#prot === 'https' ? https : http;
			const cr = module.request(url, {method: 'POST', rejectUnauthorized: false}, (res) => {

				let body = '';
				res.on('data', (chunk) => {
					body += chunk;
				});

				res.on('end', () => {
					if(res.statusCode === 201){
						user.token = JSON.parse(body).token;
						resolve(user);
					}
					else{
						resolve(null);
					}
				});
			});

			cr.setHeader('Content-Type', 'application/json');
			cr.write(JSON.stringify(user));
			cr.end();
		})));
	}

	/**
     * @method
	 * @instance
	 * @memberof module:leaderboard-api-test-data.TestData
	 * @returns  {Promise} Promise object that will fulfill with an array of test users unregistered.
	 * @desc     Unregister the test users into the leaderboard-api server.
	 */
	unregisterTestUsers(){

		return Promise.all([...this.#usersMap.values()].map(user => new Promise((resolve) => {

			const url = `${this.#prot}://${this.#host}:${this.#port}${this.#path}/auth`;
			const module = this.#prot === 'https' ? https : http;
			const cr = module.request(url, {method: 'PATCH', rejectUnauthorized: false}, (res) => {

				res.on('data', () => {
				});

				res.on('end', () => {
					if(res.statusCode === 204){
						resolve(user);
					}
					else{
						resolve(null);
					}
				});
			});

			delete user.token;

			cr.setHeader('Content-Type', 'application/json');
			cr.write(JSON.stringify(user));
			cr.end();
		})));
	}

	/**
     * @method
	 * @instance
	 * @memberof module:leaderboard-api-test-data.TestData
	 * @returns  {Promise} Promise object that will fulfill with an array of test activities registered.
	 * @desc     Register the test activities into the leaderboard-api server.
	 */
	registerTestActivities(){

		return Promise.all([...this.#actsMap.values()].flat().map(act => new Promise((resolve) => {

			const url = `${this.#prot}://${this.#host}:${this.#port}${this.#path}/score`;
			const module = this.#prot === 'https' ? https : http;
			const cr = module.request(url, {method: 'POST', rejectUnauthorized: false}, (res) => {

				let body = '';
				res.on('data', (chunk) => {
					body += chunk;
				});

				res.on('end', () => {
					if(res.statusCode === 201){
						resolve(JSON.parse(body));
					}
					else{
						resolve(null);
					}
				});
			});

			cr.setHeader('Authorization', `Bearer ${this.#usersMap.get(act.username).token}`);
			cr.setHeader('Content-Type', 'application/json');

			cr.write(JSON.stringify({
				username: act.username,
				activity: act.activity,
				score: act.score,
			}));
			cr.end();
		})));
	}
}
