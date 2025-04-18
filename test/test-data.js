/**
 * @module  leaderboard-api-test-users
 * @desc    Module for creating, registering or deleting users into/from leaderboard-api server.
 * @version 1.0.0
 * @author  Essam A. El-Sherif
 */

/* Import node.js core modules */
import http from 'node:http';
import { fileURLToPath }  from 'node:url';
import { dirname, join }  from 'node:path';

/* Import package dependencies */
import dotenv from 'dotenv';

/* Emulate commonJS __filename and __dirname constants */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/* Configure dotenv path to read the package .env file */
dotenv.config({path: join(__dirname, '../.env')});

export class TestData{

	#host = process.env.lb_serverHost;
	#port = process.env.lb_serverPort;

	#userPrefix = 'user@';
	#passwordPrefix = 'password-';
	#activityPrefix = 'Activity#';

	#initUser = 'admin';
	#initPassword = 'admin';
	#initActivity = 'Activity#a';

	#usersMap = new Map();
	#actsMap = new Map();

	constructor(numUsers = 2, numActivities = 2, init = true){
		this.numUsers = numUsers;
		this.numActivities = numActivities;
		this.init = init;

		this.createTestUsers();
		this.createTestActivities();
	}

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

	get testUsers(){
		return [...this.#usersMap.values()];
	}

	get testActivities(){
		return [...this.#actsMap.values()].flat();
	}

	registerTestUsers(){

		return [...this.#usersMap.values()].map(user => new Promise((resolve) => {

			const url = `http://${this.#host}:${this.#port}/auth`;
			const cr = http.request(url, {method: 'POST'}, (res) => {

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
		}));
	}

	unregisterTestUsers(){

		return [...this.#usersMap.values()].map(user => new Promise((resolve) => {

			const url = `http://${this.#host}:${this.#port}/auth`;
			const cr = http.request(url, {method: 'PATCH'}, (res) => {

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
		}));
	}

	registerTestActivities(){

		return [...this.#actsMap.values()].flat().map(act => new Promise((resolve) => {

			const url = `http://${this.#host}:${this.#port}/score`;
			const cr = http.request(url, {method: 'POST'}, (res) => {

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
		}));
	}
}
