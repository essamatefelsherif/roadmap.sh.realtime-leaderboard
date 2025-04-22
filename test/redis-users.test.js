/**
 * @module  redis-users-test
 * @desc    The leaderboard-api redis-users Users class testing module.
 * @version 1.0.0
 * @author  Essam A. El-Sherif
 */

/* Import node.js core modules */
import assert            from 'node:assert/strict';
import runner            from 'node:test';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

/* Import package dependencies */
import redis  from 'redis';
import dotenv from 'dotenv';

/* Import local dependencies */
import { Users } from '../lib/redis-users.js';

/* Emulate commonJS __filename and __dirname constants */
const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

/* Configure dotenv path to read the package .env file */
dotenv.config({path: join(__dirname, '../.env')});

/* Prepare test environment */
const suites = new Map();
let usersObj = null;

/**
 * @func Main
 * @async
 * @desc The module entry point function.
 */
(async () => {

	let clientRd;

	/*
	 * https://github.com/redis/node-redis
	 *
	 * Create a node-redis Client instance, or throws on failure.
	 * Connect to Redis.
	 * Since v4 of node-redis, the client does not automatically connect to the server.
	 * Instead you need to run .connect() after creating the client or you will receive an error.
	 */
	try{
		clientRd = redis.createClient({
			url: process.env.lb_connectRd,
			name: 'leaderboard-api-test'
		});

		await clientRd.connect();
		await clientRd.sendCommand(['FLUSHALL']);

		usersObj = new Users(clientRd, 'lb:user:');
	}
	catch(err){  /* node:coverage disable */
		console.error(err.message);
		process.exit(1);
	}    /* node:coverage enable */

	loadTestData();

	runner.after(async() => {
		await clientRd.sendCommand(['FLUSHALL']);
		await clientRd.quit();
	});
	nodeRunner(runner);

})('Main Function');

/**
 * @func loadTestData
 * @desc Load test data.
 */
function loadTestData(){

	let testData = null;
	let suiteDesc = '';
	let testObj = null;

	// TEST SUITE ### - Test Users Class
	suiteDesc = 'Test Users Class';
	suites.set(suiteDesc, []);

	// TEST ### - Test createUser(username, pwd) ... test#1
	testData = {};

	testObj = {
		usersMethod: usersObj.createUser,
		usersMethodArg: ['user@1', 'password-1'],
		usersMethodOut: {username: 'user@1', password: '********'},
		usersThrows: false,
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test createUser(username, pwd) ... test#1';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test createUser(username, pwd) ... test#2
	testData = {};

	testObj = {
		usersMethod: usersObj.createUser,
		usersMethodArg: ['user@2', 'password-2'],
		usersMethodOut: {username: 'user@2', password: '********'},
		usersThrows: false,
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test createUser(username, pwd) ... test#2';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test createUser(username, pwd) ... test#3
	testData = {};

	testObj = {
		usersMethod: usersObj.createUser,
		usersMethodArg: ['user@1', 'password-1'],
		usersMethodOut: null,
		usersThrows: 'username already exists',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test createUser(username, pwd) ... test#3';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test updateUser(username, pwd, newpwd) ... test#1
	testData = {};

	testObj = {
		usersMethod: usersObj.updateUser,
		usersMethodArg: ['user@1', 'password-1'],
		usersMethodOut: {username: 'user@1', password: '********'},
		usersThrows: false,
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test updateUser(username, pwd, newpwd) ... test#1';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test updateUser(username, pwd, newpwd) ... test#2
	testData = {};

	testObj = {
		usersMethod: usersObj.updateUser,
		usersMethodArg: ['user@1', 'password-1', 'password-1'],
		usersMethodOut: {username: 'user@1', password: '********'},
		usersThrows: false,
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test updateUser(username, pwd, newpwd) ... test#2';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test updateUser(username, pwd, newpwd) ... test#3
	testData = {};

	testObj = {
		usersMethod: usersObj.updateUser,
		usersMethodArg: ['user@x', 'password-1'],
		usersMethodOut: null,
		usersThrows: 'username does not exist',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test updateUser(username, pwd, newpwd) ... test#3';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test updateUser(username, pwd, newpwd) ... test#4
	testData = {};

	testObj = {
		usersMethod: usersObj.updateUser,
		usersMethodArg: ['user@1', 'password-x'],
		usersMethodOut: null,
		usersThrows: 'invalid password',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test updateUser(username, pwd, newpwd) ... test#4';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test deleteUser(username, pwd) ... test#1
	testData = {};

	testObj = {
		usersMethod: usersObj.deleteUser,
		usersMethodArg: ['user@2', 'password-2'],
		usersMethodOut: {username: 'user@2', password: '********'},
		usersThrows: false,
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test deleteUser(username, pwd) ... test#1';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test deleteUser(username, pwd) ... test#2
	testData = {};

	testObj = {
		usersMethod: usersObj.deleteUser,
		usersMethodArg: ['user@2', 'password-2'],
		usersMethodOut: null,
		usersThrows: 'username does not exist',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test deleteUser(username, pwd) ... test#2';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test deleteUser(username, pwd) ... test#3
	testData = {};

	testObj = {
		usersMethod: usersObj.deleteUser,
		usersMethodArg: ['user@1', 'password-x'],
		usersMethodOut: null,
		usersThrows: 'invalid password',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test deleteUser(username, pwd) ... test#3';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test getUsers() ... test#1
	testData = {};

	testObj = {
		usersMethod: usersObj.getUsers,
		usersMethodArg: [],
		usersMethodOut: [{username: 'user@1', password: '********'}],
		usersThrows: false,
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test getUsers() ... test#1';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);
}

/**
 * @func  nodeRunner
 * @param {object} runner - The node core module 'node:test' object.
 * @desc  Carry out the loaded tests using node test runner.
 */
function nodeRunner(runner){

	for(let [suiteDesc, suiteTests] of suites){
		runner.suite(suiteDesc, () => {
			for(let cmdObj of suiteTests){
				runner.test(cmdObj.desc, {skip: cmdObj.skip}, async () => {
					await cmdObj.method();
				});
			}
		});
	}
}

/**
 * @func
 * @async
 * @desc  Carries out the assertions tests.
 */
async function testMethod(){

	if(this.usersThrows){
		try{
			await this.usersMethod.apply(usersObj, this.usersMethodArg);  /* node:coverage disable */
			assert(false);
		}	/* node:coverage enable */
		catch(err){
			if(typeof this.usersThrows === 'string'){
				assert.strictEqual(err.message, this.usersThrows);
			}
		}
	}
	else{
		let actOut  = await this.usersMethod.apply(usersObj, this.usersMethodArg);

		if(typeof actOut === 'object'){
			if(Array.isArray(actOut)){
				actOut.forEach((obj) => delete obj.timestamp);
			}
			else{
				delete actOut.timestamp;
			}
			assert.deepStrictEqual(actOut, this.usersMethodOut);
		}
	}
}
