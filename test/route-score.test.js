/**
 * @module  score-route-test
 * @desc    The leaderboard-api score route testing module.
 * @version 1.0.0
 * @author  Essam A. El-Sherif
 */

/* Import node.js core modules */
import assert            from 'node:assert/strict';
import fs                from 'node:fs';
import http              from 'node:http';
import https             from 'node:https';
import runner            from 'node:test';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

/* Import package dependencies */
import dotenv from 'dotenv';

/* Import local dependencies */
import { TestData } from './test-data.js';

/* Emulate commonJS __filename and __dirname constants */
const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

/* Configure dotenv path to read the package .env file */
dotenv.config({path: join(__dirname, '../.env')});

/* Prepare test environment */
const suites = new Map();

const url = new URL('http://server');

url.host = process.env.lb_serverHost;
url.port = process.env.lb_serverPort;
url.pathname = process.env.lb_serverPath;

if(process.env.lb_serverProtocol === 'https'){
	url.protocol = 'https';
}
const baseUrl = `${url.href}/score`;

let testUsers = null;

/**
 * @func Main
 * @async
 * @desc The module entry point function.
 */
(async () => {
	const testData = new TestData();
	testUsers = testData.testUsers;

	await testData.unregisterTestUsers();
	await testData.registerTestUsers();

	loadTestData();

	runner.after(async() => {
		await testData.unregisterTestUsers();
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

	// TEST SUITE ### - Test Score Route - addUserScore
	suiteDesc = 'Test Score Route - addUserScore';
	suites.set(suiteDesc, []);

	// TEST ### - Test addUserScore invalid ... test#1
	testData = {};

	testObj = {
		reqMethod: 'POST',
		reqAuth: undefined,
		reqBody: undefined,
		resCode: 401,
		resBody: 'Authorization Error: No authorization token was found',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test addUserScore invalid ... test#1';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test addUserScore invalid ... test#2
	testData = {};

	testObj = {
		reqMethod: 'POST',
		reqAuth: testUsers[0].token,
		reqBody: undefined,
		resCode: 400,
		resBody: 'Submission Error: none or invalid request payload',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test addUserScore invalid ... test#2';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test addUserScore invalid ... test#3
	testData = {};

	testObj = {
		reqMethod: 'POST',
		reqAuth: testUsers[0].token,
		reqBody: {},
		resCode: 400,
		resBody: 'Submission Error: none or invalid request payload',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test addUserScore invalid ... test#3';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test addUserScore invalid ... test#4
	testData = {};

	testObj = {
		reqMethod: 'POST',
		reqAuth: testUsers[0].token,
		reqBody: 'XXXXXXX',
		resCode: 400,
		resBody: 'Submission Error: none or invalid request payload',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test addUserScore invalid ... test#4';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test addUserScore invalid ... test#5
	testData = {};

	testObj = {
		reqMethod: 'POST',
		reqAuth: testUsers[0].token,
		reqBody: {activity: 'activity-1'},
		resCode: 400,
		resBody: 'Submission Error: no score given',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test addUserScore invalid ... test#5';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test addUserScore invalid ... test#6
	testData = {};

	testObj = {
		reqMethod: 'POST',
		reqAuth: testUsers[0].token,
		reqBody: {score: 100},
		resCode: 400,
		resBody: 'Submission Error: no activity given',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test addUserScore invalid ... test#6';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test addUserScore valid ... test#1
	testData = {};

	testObj = {
		reqMethod: 'POST',
		reqAuth: testUsers[0].token,
		reqBody: {activity: 'activity-1', score: 100},
		resCode: 201,
		resBody: {activity: 'activity-1', username: testUsers[0].username, score: '100'},
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test addUserScore   valid ... test#1';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test addUserScore valid ... test#2
	testData = {};

	testObj = {
		reqMethod: 'POST',
		reqAuth: testUsers[0].token,
		reqBody: {activity: 'activity-1', score: 200},
		resCode: 201,
		resBody: {activity: 'activity-1', username: testUsers[0].username, score: '200'},
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test addUserScore   valid ... test#2';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test addUserScore valid ... test#3
	testData = {};

	testObj = {
		reqMethod: 'POST',
		reqAuth: testUsers[1].token,
		reqBody: {activity: 'activity-1', score: 300},
		resCode: 201,
		resBody: {activity: 'activity-1', username: testUsers[1].username, score: '300'},
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test addUserScore   valid ... test#3';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST SUITE ### - Test Score Route - removeUserScore
	suiteDesc = 'Test Score Route - removeUserScore';
	suites.set(suiteDesc, []);

	// TEST ### - Test removeUserScore invalid ... test#1
	testData = {};

	testObj = {
		reqMethod: 'PATCH',
		reqAuth: undefined,
		reqBody: undefined,
		resCode: 401,
		resBody: 'Authorization Error: No authorization token was found',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test removeUserScore invalid ... test#1';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test removeUserScore invalid ... test#2
	testData = {};

	testObj = {
		reqMethod: 'PATCH',
		reqAuth: testUsers[0].token,
		reqBody: undefined,
		resCode: 400,
		resBody: 'Submission Error: none or invalid request payload',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test removeUserScore invalid ... test#2';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test removeUserScore invalid ... test#3
	testData = {};

	testObj = {
		reqMethod: 'PATCH',
		reqAuth: testUsers[0].token,
		reqBody: {},
		resCode: 400,
		resBody: 'Submission Error: none or invalid request payload',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test removeUserScore invalid ... test#3';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test removeUserScore invalid ... test#4
	testData = {};

	testObj = {
		reqMethod: 'PATCH',
		reqAuth: testUsers[0].token,
		reqBody: 'XXXXXXX',
		resCode: 400,
		resBody: 'Submission Error: none or invalid request payload',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test removeUserScore invalid ... test#4';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test removeUserScore invalid ... test#5
	testData = {};

	testObj = {
		reqMethod: 'PATCH',
		reqAuth: testUsers[0].token,
		reqBody: {score: 100},
		resCode: 400,
		resBody: 'Submission Error: no activity given',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test removeUserScore invalid ... test#5';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test removeUserScore valid ... test#1
	testData = {};

	testObj = {
		reqMethod: 'PATCH',
		reqAuth: testUsers[1].token,
		reqBody: {activity: 'activity-1'},
		resCode: 204,
		resBody: '',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test removeUserScore   valid ... test#1';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST SUITE ### - Test Score Route - removeAllUserScores
	suiteDesc = 'Test Score Route - removeAllUserScores';
	suites.set(suiteDesc, []);

	// TEST ### - Test removeAllUserScores invalid ... test#1
	testData = {};

	testObj = {
		reqMethod: 'POST',
		reqAuth: undefined,
		reqBody: undefined,
		resCode: 401,
		resBody: 'Authorization Error: No authorization token was found',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test removeAllUserScores invalid ... test#1';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test removeAllUserScores valid ... test#1
	testData = {};

	testObj = {
		reqMethod: 'DELETE',
		reqAuth: testUsers[0].token,
		reqBody: undefined,
		resCode: 204,
		resBody: '',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test removeAllUserScores   valid ... test#1';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test removeAllUserScores valid ... test#2
	testData = {};

	testObj = {
		reqMethod: 'DELETE',
		reqAuth: testUsers[0].token,
		reqBody: undefined,
		resCode: 204,
		resBody: '',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test removeAllUserScores   valid ... test#2';

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
	await new Promise((resolve, reject) => {

		let module = http;
		let reqOptions = { method: this.reqMethod };

		if(new URL(baseUrl).protocol === 'https:'){
			module = https;
			reqOptions.rejectUnauthorized = false;
		}

		const cr = module.request(baseUrl, reqOptions, (res) => {
			let body = '';
			res.on('data', (chunk) => {
				body += chunk;
			});

			res.on('end', () => {
				try{
					assert.strictEqual(res.statusCode, this.resCode);

					if(this.reqMethod.toUpperCase() !== 'GET'){
						if(typeof this.resBody === 'string'){
							assert.strictEqual(body, this.resBody);
						}
						else
						if(typeof this.resBody === 'object'){
							assert.deepStrictEqual(
								JSON.parse(body, (key, value) => key !== 'timestamp' ? value : undefined),
								this.resBody
							);
						}
					}
					resolve();
				}
				catch(err){  /* node:coverage disable */
					reject(err);
				}  /* node:coverage enable */
			});
		});

		if(this.reqAuth){
			cr.setHeader('Authorization', `Bearer ${this.reqAuth}`);
		}

		if(typeof this.reqBody === 'object'){
			this.reqBody = JSON.stringify(this.reqBody);
			cr.setHeader('Content-Type', 'application/json; charset=UTF-8');
			cr.write(this.reqBody);
		}
		else
		if(typeof this.reqBody === 'string'){
			cr.setHeader('Content-Type', 'text/plain; charset=UTF-8');
			cr.write(this.reqBody);
		}
		cr.end();
	});
}
