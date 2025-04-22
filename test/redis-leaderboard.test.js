/**
 * @module  redis-leaderboard-test
 * @desc    The leaderboard-api redis-leaderboard LeaderBoard class testing module.
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
import { LeaderBoard } from '../lib/redis-leaderboard.js';

/* Emulate commonJS __filename and __dirname constants */
const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

/* Configure dotenv path to read the package .env file */
dotenv.config({path: join(__dirname, '../.env')});

/* Prepare test environment */
const suites = new Map();
let lbObj = null;

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

		lbObj = new LeaderBoard(clientRd, 'lb:ts:', 'lb:act:');
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

	// TEST SUITE ### - Test Leaderboard Class
	suiteDesc = 'Test LeaderBoard Class';
	suites.set(suiteDesc, []);

	// TEST ### - Test addUserScore(activity, username, score) ... test#1
	testData = {};

	testObj = {
		lbMethod: lbObj.addUserScore,
		lbMethodInp: ['activity-1', 'user@1', 110],
		lbMethodOut: {activity: 'activity-1', username: 'user@1', score: '110'},
		lbThrows: false,
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test addUserScore(activity, username, score) ... test#1';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test addUserScore(activity, username, score) ... test#2
	testData = {};

	testObj = {
		lbMethod: lbObj.addUserScore,
		lbMethodInp: ['activity-1', 'user@2', 120],
		lbMethodOut: {activity: 'activity-1', username: 'user@2', score: '120'},
		lbThrows: false,
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test addUserScore(activity, username, score) ... test#2';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test addUserScore(activity, username, score) ... test#3
	testData = {};

	testObj = {
		lbMethod: lbObj.addUserScore,
		lbMethodInp: ['activity-2', 'user@1', 210],
		lbMethodOut: {activity: 'activity-2', username: 'user@1', score: '210'},
		lbThrows: false,
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test addUserScore(activity, username, score) ... test#3';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test addUserScore(activity, username, score) ... test#4
	testData = {};

	testObj = {
		lbMethod: lbObj.addUserScore,
		lbMethodInp: ['activity-2', 'user@2', 220],
		lbMethodOut: {activity: 'activity-2', username: 'user@2', score: '220'},
		lbThrows: false,
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test addUserScore(activity, username, score) ... test#4';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test addUserScore(activity, username, score) ... test#5
	testData = {};

	testObj = {
		lbMethod: lbObj.addUserScore,
		lbMethodInp: ['activity-2', 'user@3', 230],
		lbMethodOut: {activity: 'activity-2', username: 'user@3', score: '230'},
		lbThrows: false,
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test addUserScore(activity, username, score) ... test#5';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test removeUserScore(username, activity) ... test#1
	testData = {};

	testObj = {
		lbMethod: lbObj.removeUserScore,
		lbMethodInp: ['user@3', 'activity-2'],
		lbMethodOut: [{activity: 'activity-2', username: 'user@3'}],
		lbThrows: false,
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test removeUserScore(username, activity) ... test#1';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test removeUserScore(username, activity) ... test#2
	testData = {};

	testObj = {
		lbMethod: lbObj.removeUserScore,
		lbMethodInp: ['user@3', 'activity-2'],
		lbMethodOut: [],
		lbThrows: false,
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test removeUserScore(username, activity) ... test#2';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test getUserScoreAndRank(activity, username) ... test#1
	testData = {};

	testObj = {
		lbMethod: lbObj.getUserScoreAndRank,
		lbMethodInp: ['activity-x', 'user@1'],
		lbMethodOut: [],
		lbThrows: `no activity 'activity-x'`,
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test getUserScoreAndRank(activity, username) ... test#1';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test getUserScoreAndRank(activity, username) ... test#2
	testData = {};

	testObj = {
		lbMethod: lbObj.getUserScoreAndRank,
		lbMethodInp: ['activity-1', 'user@x'],
		lbMethodOut: {},
		lbThrows: false,
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test getUserScoreAndRank(activity, username) ... test#2';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test getUserScoreAndRank(activity, username) ... test#3
	testData = {};

	testObj = {
		lbMethod: lbObj.getUserScoreAndRank,
		lbMethodInp: ['activity-1', 'user@1'],
		lbMethodOut: {activity: 'activity-1', username: 'user@1', score: '110', rank: 2},
		lbThrows: false,
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test getUserScoreAndRank(activity, username) ... test#3';

	testData.final = true;
	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test getUserScoreAndRank(activity, username) ... test#4
	testData = {};

	testObj = {
		lbMethod: lbObj.getUserScoreAndRank,
		lbMethodInp: ['activity-1', 'user@2'],
		lbMethodOut: {activity: 'activity-1', username: 'user@2', score: '120', rank: 1},
		lbThrows: false,
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test getUserScoreAndRank(activity, username) ... test#4';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test getActivity(activity) ... test#1
	testData = {};

	testObj = {
		lbMethod: lbObj.getActivity,
		lbMethodInp: ['activity-x'],
		lbMethodOut: [],
		lbThrows: `no activity 'activity-x'`,
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test getActivity(activity) ... test#1';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test getActivity(activity) ... test#2
	testData = {};

	testObj = {
		lbMethod: lbObj.getActivity,
		lbMethodInp: ['activity-2'],
		lbMethodOut: [
			{activity: 'activity-2', username: 'user@2', score: '220', rank: 1},
			{activity: 'activity-2', username: 'user@1', score: '210', rank: 2},
		],
		lbThrows: false,
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test getActivity(activity) ... test#2';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test getActivities() ... test#1
	testData = {};

	testObj = {
		lbMethod: lbObj.getActivities,
		lbMethodInp: [],
		lbMethodOut: [
			{activity: 'activity-2', username: 'user@2', score: '220', rank: 1},
			{activity: 'activity-2', username: 'user@1', score: '210', rank: 2},
			{activity: 'activity-1', username: 'user@2', score: '120', rank: 3},
			{activity: 'activity-1', username: 'user@1', score: '110', rank: 4},
		],
		lbThrows: false,
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test getActivities() ... test#1';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test getUserActivities(username) ... test#1
	testData = {};

	testObj = {
		lbMethod: lbObj.getUserActivities,
		lbMethodInp: ['user@2'],
		lbMethodOut: [
			{activity: 'activity-2', username: 'user@2', score: '220', rank: 1},
			{activity: 'activity-1', username: 'user@2', score: '120', rank: 2},
		],
		lbThrows: false,
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test getUserActivities(username) ... test#1';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test getUserActivities(username) ... test#2
	testData = {};

	testObj = {
		lbMethod: lbObj.getUserActivities,
		lbMethodInp: ['user@x'],
		lbMethodOut: [],
		lbThrows: false,
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test getUserActivities(username) ... test#2';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test getActivityTopUsers(activity, n) ... test#1
	testData = {};

	testObj = {
		lbMethod: lbObj.getActivityTopUsers,
		lbMethodInp: ['activity-1', 2],
		lbMethodOut: [
			{activity: 'activity-1', username: 'user@2', score: '120', rank: 1},
			{activity: 'activity-1', username: 'user@1', score: '110', rank: 2},
		],
		lbThrows: false,
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test getActivityTopUsers(activity, n) ... test#1';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test getActivityTopUsers(activity, n) ... test#2
	testData = {};

	testObj = {
		lbMethod: lbObj.getActivityTopUsers,
		lbMethodInp: ['activity-2', 2],
		lbMethodOut: [
			{activity: 'activity-2', username: 'user@2', score: '220', rank: 1},
			{activity: 'activity-2', username: 'user@1', score: '210', rank: 2},
		],
		lbThrows: false,
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test getActivityTopUsers(activity, n) ... test#2';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test getActivityTopUsers(activity, n) ... test#3
	testData = {};

	testObj = {
		lbMethod: lbObj.getActivityTopUsers,
		lbMethodInp: ['activity-2', 1],
		lbMethodOut: [
			{activity: 'activity-2', username: 'user@2', score: '220', rank: 1},
		],
		lbThrows: false,
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test getActivityTopUsers(activity, n) ... test#3';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test getActivityTopUsers(activity, n) ... test#4
	testData = {};

	testObj = {
		lbMethod: lbObj.getActivityTopUsers,
		lbMethodInp: ['activity-2', 0],
		lbMethodOut: [
			{activity: 'activity-2', username: 'user@2', score: '220', rank: 1},
			{activity: 'activity-2', username: 'user@1', score: '210', rank: 2},
		],
		lbThrows: false,
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test getActivityTopUsers(activity, n) ... test#4';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test getActivityTopUsers(activity, n) ... test#5
	testData = {};

	testObj = {
		lbMethod: lbObj.getActivityTopUsers,
		lbMethodInp: ['activity-x', 2],
		lbMethodOut: [],
		lbThrows: false,
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test getActivityTopUsers(activity, n) ... test#5';

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

	if(this.lbThrows){
		try{
			await this.lbMethod.apply(lbObj, this.lbMethodInp);  /* node:coverage disable */
			assert(false);
		}	/* node:coverage enable */
		catch(err){
			if(typeof this.lbThrows === 'string'){
				assert.strictEqual(err.message, this.lbThrows);
			}
		}
	}
	else{
		let actOut  = await this.lbMethod.apply(lbObj, this.lbMethodInp);

		if(typeof actOut === 'object'){
			if(Array.isArray(actOut)){
				actOut.forEach((obj) => delete obj.timestamp);
			}
			else{
				delete actOut.timestamp;
			}
			assert.deepStrictEqual(actOut, this.lbMethodOut);
		}
	}
}
