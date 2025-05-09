/**
 * @module  leaderboard-route-test
 * @desc    The leaderboard-api leaderboard route testing module.
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
const baseUrl = `${url.href}/leaderboard`;

let testUsers = null;

/**
 * @func Main
 * @async
 * @desc The module entry point function.
 */
(async () => {
	const testData = new TestData(3, 3, false);
	testUsers = testData.testUsers;

	await testData.unregisterTestUsers();
	await testData.registerTestUsers();
	await testData.registerTestActivities();

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

	// TEST SUITE ### - Test Leaderboard Route - Endpoint /global
	suiteDesc = 'Test Leaderboard Route - Endpoint /global';
	suites.set(suiteDesc, []);

	// TEST ### - Test endpoint /global invalid ... test#1
	testData = {};

	testObj = {
		reqUrl : `${baseUrl}/global`,
		reqMethod: 'GET',
		reqAuth: undefined,
		resCode: 401,
		resBody: 'Authorization Error: No authorization token was found',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test endpoint /global             invalid ... test#1';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test endpoint /global valid ... test#2
	testData = {};

	testObj = {
		reqUrl : `${baseUrl}/global`,
		reqMethod: 'GET',
		reqAuth: testUsers[0].token,
		resCode: 200,
		resBody: [
			{ activity: 'activity-3', username: 'user@3', score: '330', rank: 1 },
			{ activity: 'activity-3', username: 'user@2', score: '320', rank: 2 },
			{ activity: 'activity-3', username: 'user@1', score: '310', rank: 3 },
			{ activity: 'activity-2', username: 'user@3', score: '230', rank: 4 },
			{ activity: 'activity-2', username: 'user@2', score: '220', rank: 5 },
			{ activity: 'activity-2', username: 'user@1', score: '210', rank: 6 },
			{ activity: 'activity-1', username: 'user@3', score: '130', rank: 7 },
			{ activity: 'activity-1', username: 'user@2', score: '120', rank: 8 },
			{ activity: 'activity-1', username: 'user@1', score: '110', rank: 9 }
		]
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test endpoint /global               valid ... test#2';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test endpoint /global/top valid ... test#3
	testData = {};

	testObj = {
		reqUrl : `${baseUrl}/global/top`,
		reqMethod: 'GET',
		reqAuth: testUsers[0].token,
		resCode: 200,
		resBody: [
			{ activity: 'activity-3', username: 'user@3', score: '330', rank: 1 },
			{ activity: 'activity-3', username: 'user@2', score: '320', rank: 2 },
			{ activity: 'activity-3', username: 'user@1', score: '310', rank: 3 },
			{ activity: 'activity-2', username: 'user@3', score: '230', rank: 4 },
			{ activity: 'activity-2', username: 'user@2', score: '220', rank: 5 },
		]
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test endpoint /global/top           valid ... test#3';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test endpoint /global/top/0 invalid ... test#4
	testData = {};

	testObj = {
		reqUrl : `${baseUrl}/global/top/0`,
		reqMethod: 'GET',
		reqAuth: testUsers[0].token,
		resCode: 400,
		resBody: 'Retrieval Error: invalid top count'
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test endpoint /global/top/0       invalid ... test#4';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test endpoint /global/top/x0 invalid ... test#5
	testData = {};

	testObj = {
		reqUrl : `${baseUrl}/global/top/x0`,
		reqMethod: 'GET',
		reqAuth: testUsers[0].token,
		resCode: 400,
		resBody: 'Retrieval Error: invalid top count'
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test endpoint /global/top/x0      invalid ... test#5';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test endpoint /global/top/3.5 invalid ... test#6
	testData = {};

	testObj = {
		reqUrl : `${baseUrl}/global/top/3.5`,
		reqMethod: 'GET',
		reqAuth: testUsers[0].token,
		resCode: 400,
		resBody: 'Retrieval Error: invalid top count'
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test endpoint /global/top/3.5     invalid ... test#6';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test endpoint /global/top/5 valid ... test#7
	testData = {};

	testObj = {
		reqUrl : `${baseUrl}/global/top/5`,
		reqMethod: 'GET',
		reqAuth: testUsers[0].token,
		resCode: 200,
		resBody: [
			{ activity: 'activity-3', username: 'user@3', score: '330', rank: 1 },
			{ activity: 'activity-3', username: 'user@2', score: '320', rank: 2 },
			{ activity: 'activity-3', username: 'user@1', score: '310', rank: 3 },
			{ activity: 'activity-2', username: 'user@3', score: '230', rank: 4 },
			{ activity: 'activity-2', username: 'user@2', score: '220', rank: 5 },
		]
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test endpoint /global/top/5         valid ... test#7';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test endpoint /global/user invalid ... test#8
	testData = {};

	testObj = {
		reqUrl : `${baseUrl}/global/user`,
		reqMethod: 'GET',
		reqAuth: testUsers[0].token,
		resCode: 404,
		resBody: 'Retrieval Error: invalid endpoint'
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test endpoint /global/user        invalid ... test#8';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test endpoint /global/user/xxx valid ... test#9
	testData = {};

	testObj = {
		reqUrl : `${baseUrl}/global/user/xxx`,
		reqMethod: 'GET',
		reqAuth: testUsers[0].token,
		resCode: 200,
		resBody: []
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test endpoint /global/user/xxx      valid ... test#9';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test endpoint /global/user/user@1 valid ... test#10
	testData = {};

	testObj = {
		reqUrl : `${baseUrl}/global/user/user@1`,
		reqMethod: 'GET',
		reqAuth: testUsers[0].token,
		resCode: 200,
		resBody: [
			{ activity: 'activity-3', username: 'user@1', score: '310', rank: 1 },
			{ activity: 'activity-2', username: 'user@1', score: '210', rank: 2 },
			{ activity: 'activity-1', username: 'user@1', score: '110', rank: 3 }
		]
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test endpoint /global/user/user@1   valid ... test#10';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test endpoint /global/xxx invalid ... test#11
	testData = {};

	testObj = {
		reqUrl : `${baseUrl}/global/xxx`,
		reqMethod: 'POST',
		reqAuth: testUsers[0].token,
		resCode: 404,
		resBody: `Retrieval Error: invalid request method 'POST'`
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test endpoint /global/xxx           invalid ... test#11';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test endpoint /global/xxx invalid ... test#12
	testData = {};

	testObj = {
		reqUrl : `${baseUrl}/global/xxx`,
		reqMethod: 'GET',
		reqAuth: testUsers[0].token,
		resCode: 404,
		resBody: `Retrieval Error: invalid endpoint`
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test endpoint /global/xxx           invalid ... test#12';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);










	// TEST SUITE ### - Test Leaderboard Route - Endpoint /:activity
	suiteDesc = 'Test Leaderboard Route - Endpoint /:activity';
	suites.set(suiteDesc, []);

	// TEST ### - Test endpoint /activity-1 invalid ... test#1
	testData = {};

	testObj = {
		reqUrl : `${baseUrl}/activity-1`,
		reqMethod: 'GET',
		reqAuth: undefined,
		resCode: 401,
		resBody: 'Authorization Error: No authorization token was found',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test endpoint /activity-1             invalid ... test#1';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test endpoint /activity-1 valid ... test#2
	testData = {};

	testObj = {
		reqUrl : `${baseUrl}/activity-1`,
		reqMethod: 'GET',
		reqAuth: testUsers[0].token,
		resCode: 200,
		resBody: [
			{ activity: 'activity-1', username: 'user@3', score: '130', rank: 1 },
			{ activity: 'activity-1', username: 'user@2', score: '120', rank: 2 },
			{ activity: 'activity-1', username: 'user@1', score: '110', rank: 3 }
		],
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test endpoint /activity-1               valid ... test#2';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test endpoint /activity-1/top valid ... test#3
	testData = {};

	testObj = {
		reqUrl : `${baseUrl}/activity-1/top`,
		reqMethod: 'GET',
		reqAuth: testUsers[0].token,
		resCode: 200,
		resBody: [
			{ activity: 'activity-1', username: 'user@3', score: '130', rank: 1 },
			{ activity: 'activity-1', username: 'user@2', score: '120', rank: 2 },
			{ activity: 'activity-1', username: 'user@1', score: '110', rank: 3 }
		],
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test endpoint /activity-1/top           valid ... test#3';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test endpoint /activity-1/top/0 invalid ... test#4
	testData = {};

	testObj = {
		reqUrl : `${baseUrl}/activity-1/top/0`,
		reqMethod: 'GET',
		reqAuth: testUsers[0].token,
		resCode: 400,
		resBody: 'Retrieval Error: invalid top count'
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test endpoint /activity-1/top/0       invalid ... test#4';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test endpoint /activity-1/top/x0 invalid ... test#5
	testData = {};

	testObj = {
		reqUrl : `${baseUrl}/activity-1/top/x0`,
		reqMethod: 'GET',
		reqAuth: testUsers[0].token,
		resCode: 400,
		resBody: 'Retrieval Error: invalid top count'
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test endpoint /activity-1/top/x0      invalid ... test#5';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test endpoint /activity-1/top/3.5 invalid ... test#6
	testData = {};

	testObj = {
		reqUrl : `${baseUrl}/activity-1/top/3.5`,
		reqMethod: 'GET',
		reqAuth: testUsers[0].token,
		resCode: 400,
		resBody: 'Retrieval Error: invalid top count'
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test endpoint /activity-1/top/3.5     invalid ... test#6';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test endpoint /activity-1/top/2 valid ... test#7
	testData = {};

	testObj = {
		reqUrl : `${baseUrl}/activity-1/top/2`,
		reqMethod: 'GET',
		reqAuth: testUsers[0].token,
		resCode: 200,
		resBody: [
			{ activity: 'activity-1', username: 'user@3', score: '130', rank: 1 },
			{ activity: 'activity-1', username: 'user@2', score: '120', rank: 2 },
		]
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test endpoint /activity-1/top/2         valid ... test#7';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test endpoint /activity-1/user invalid ... test#8
	testData = {};

	testObj = {
		reqUrl : `${baseUrl}/activity-1/user`,
		reqMethod: 'GET',
		reqAuth: testUsers[0].token,
		resCode: 404,
		resBody: 'Retrieval Error: invalid endpoint'
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test endpoint /activity-1/user        invalid ... test#8';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test endpoint /activity-1/user/xxx valid ... test#9
	testData = {};

	testObj = {
		reqUrl : `${baseUrl}/activity-1/user/xxx`,
		reqMethod: 'GET',
		reqAuth: testUsers[0].token,
		resCode: 200,
		resBody: {}
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test endpoint /activity-1/user/xxx      valid ... test#9';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test endpoint /activity-1/user/user@1 valid ... test#10
	testData = {};

	testObj = {
		reqUrl : `${baseUrl}/activity-1/user/user@1`,
		reqMethod: 'GET',
		reqAuth: testUsers[0].token,
		resCode: 200,
		resBody: { activity: 'activity-1', username: 'user@1', score: '110', rank: 3}
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test endpoint /activity-1/user/user@1   valid ... test#10';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test endpoint /activity-1/xxx invalid ... test#11
	testData = {};

	testObj = {
		reqUrl : `${baseUrl}/activity-1/xxx`,
		reqMethod: 'POST',
		reqAuth: testUsers[0].token,
		resCode: 404,
		resBody: `Retrieval Error: invalid request method 'POST'`
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test endpoint /activity-1/xxx         invalid ... test#11';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test endpoint /activity-1/xxx invalid ... test#12
	testData = {};

	testObj = {
		reqUrl : `${baseUrl}/activity-1/xxx`,
		reqMethod: 'GET',
		reqAuth: testUsers[0].token,
		resCode: 404,
		resBody: `Retrieval Error: invalid endpoint`
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test endpoint /activity-1/xxx         invalid ... test#12';

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

		if(new URL(this.reqUrl).protocol === 'https:'){
			module = https;
			reqOptions.rejectUnauthorized = false;
		}

		const cr = module.request(this.reqUrl, reqOptions, (res) => {
			let body = '';
			res.on('data', (chunk) => {
				body += chunk;
			});

			res.on('end', () => {
				try{
					assert.strictEqual(res.statusCode, this.resCode);

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
		cr.end();
	});
}
