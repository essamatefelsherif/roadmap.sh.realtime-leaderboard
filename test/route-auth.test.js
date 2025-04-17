/**
 * @module  leaderboard-api-auth-route-test
 * @desc    The leaderboard-api authentication route testing module.
 * @version 1.0.0
 * @author  Essam A. El-Sherif
 */

/* Import node.js core modules */
import assert from 'node:assert/strict';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

/* Import local dependencies */
import { TestData } from './test-data.js'
import dotenv from 'dotenv';

/* Emulate commonJS __filename and __dirname constants */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/* Configure dotenv path to read the package .env file */
dotenv.config({path: join(__dirname, '../.env')});

/** @const {object} cmdOptions - Options used when running the tests. */
const cmdOptions = {
    node    : true,
    verbose : true,
};

/* Prepare test environment */

let testCount   = 1;
let passCount   = 0;
let failCount   = 0;
let cancelCount = 0;
let skipCount   = 0;
let todoCount   = 0;
let startTime = Date.now();

const suites = new Map();

const baseUrl = `http://${process.env.lb_serverHost}:${process.env.lb_serverPort}/auth`;
let testUsers = null;

/**
 * @func Main
 * @async
 * @desc The module entry point function.
 */
(async () => {
	const testData = new TestData();
	testUsers = testData.testUsers;

	await Promise.all(testData.unregisterTestUsers());
	await Promise.all(testData.registerTestUsers());

	loadTestData();

	if(cmdOptions.node){
		import('node:test')
			.then(runner => {
				cmdOptions.verbose = false;
				runner.after(async() => {
					await Promise.all(testData.unregisterTestUsers());
				});
				nodeRunner(runner);
			})  /* node:coverage disable */
			.catch(async(e) => {
				defRunner();
				await Promise.all(testData.unregisterTestUsers());
			});
	}
	else{
		defRunner();
		await Promise.all(testData.unregisterTestUsers());
	}   /* node:coverage enable */

})('Main Function');

/**
 * @func loadTestData
 * @desc Load test data.
 */
function loadTestData(){

	let testData = null;
	let suiteDesc = '';
	let testObj = null;

	// TEST SUITE ### - Test Authentication Route - createUser
	suiteDesc = 'Test Authentication Route - createUser';
	suites.set(suiteDesc, []);

	// TEST ### - Test createUser invalid ... test#1
	testData = {};

	testObj = {
		reqMethod: 'POST',
		reqBody: undefined,
		resCode: 400,
		resBody: 'Authentication Error: none or invalid request payload',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test createUser invalid ... test#1';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test createUser invalid ... test#2
	testData = {};

	testObj = {
		reqMethod: 'POST',
		reqBody: {},
		resCode: 400,
		resBody: 'Authentication Error: none or invalid request payload',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test createUser invalid ... test#2';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test createUser invalid ... test#3
	testData = {};

	testObj = {
		reqMethod: 'POST',
		reqBody: {username: 'admin'},
		resCode: 400,
		resBody: 'Authentication Error: no password given',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test createUser invalid ... test#3';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test createUser invalid ... test#4
	testData = {};

	testObj = {
		reqMethod: 'POST',
		reqBody: {password: 'admin'},
		resCode: 400,
		resBody: 'Authentication Error: no username given',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test createUser invalid ... test#4';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test createUser invalid ... test#5
	testData = {};

	testObj = {
		reqMethod: 'POST',
		reqBody: {username: 'admin', password: 'admin'},
		resCode: 401,
		resBody: 'Authentication Error: username already exists',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test createUser invalid ... test#5';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test createUser valid ... test#1
	testData = {};

	testObj = {
		reqMethod: 'POST',
		reqBody: {username: 'test', password: 'test'},
		resCode: 201,
		resBody: {token: 'JWT'},
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test createUser valid ... test#1';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST SUITE ### - Test Authentication Route - updateUser
	suiteDesc = 'Test Authentication Route - updateUser';
	suites.set(suiteDesc, []);

	// TEST ### - Test updateUser invalid ... test#1
	testData = {};

	testObj = {
		reqMethod: 'PUT',
		reqBody: undefined,
		resCode: 400,
		resBody: 'Authentication Error: none or invalid request payload',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test updateUser invalid ... test#1';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test updateUser invalid ... test#2
	testData = {};

	testObj = {
		reqMethod: 'PUT',
		reqBody: {},
		resCode: 400,
		resBody: 'Authentication Error: none or invalid request payload',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test updateUser invalid ... test#2';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test updateUser invalid ... test#3
	testData = {};

	testObj = {
		reqMethod: 'PUT',
		reqBody: {username: 'admin'},
		resCode: 400,
		resBody: 'Authentication Error: no password given',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test updateUser invalid ... test#3';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test updateUser invalid ... test#4
	testData = {};

	testObj = {
		reqMethod: 'PUT',
		reqBody: {password: 'admin'},
		resCode: 400,
		resBody: 'Authentication Error: no username given',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test updateUser invalid ... test#4';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test updateUser invalid ... test#5
	testData = {};

	testObj = {
		reqMethod: 'PUT',
		reqBody: {username: 'xxx', password: 'xxx'},
		resCode: 401,
		resBody: 'Authentication Error: username does not exist',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test updateUser invalid ... test#5';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test updateUser invalid ... test#6
	testData = {};

	testObj = {
		reqMethod: 'PUT',
		reqBody: {username: 'admin', password: 'xxx'},
		resCode: 401,
		resBody: 'Authentication Error: invalid password',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test updateUser invalid ... test#6';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test updateUser valid ... test#1
	testData = {};

	testObj = {
		reqMethod: 'PUT',
		reqBody: {username: 'admin', password: 'admin'},
		resCode: 201,
		resBody: {token: 'JWT'},
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test updateUser valid ... test#1';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test updateUser valid ... test#2
	testData = {};

	testData = {};

	testObj = {
		reqMethod: 'PUT',
		reqBody: {username: 'admin', password: 'admin', newpassword: 'admin'},
		resCode: 201,
		resBody: {token: 'JWT'},
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test updateUser valid ... test#2';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST SUITE ### - Test Authentication Route - deleteUser
	suiteDesc = 'Test Authentication Route - deleteUser';
	suites.set(suiteDesc, []);

	// TEST ### - Test deleteUser invalid ... test#1
	testData = {};

	testObj = {
		reqMethod: 'PATCH',
		reqBody: undefined,
		resCode: 400,
		resBody: 'Authentication Error: none or invalid request payload',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test deleteUser invalid ... test#1';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test deleteUser invalid ... test#2
	testData = {};

	testObj = {
		reqMethod: 'PATCH',
		reqBody: {},
		resCode: 400,
		resBody: 'Authentication Error: none or invalid request payload',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test deleteUser invalid ... test#2';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test deleteUser invalid ... test#3
	testData = {};

	testObj = {
		reqMethod: 'PATCH',
		reqBody: {username: 'admin'},
		resCode: 400,
		resBody: 'Authentication Error: no password given',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test deleteUser invalid ... test#3';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test deleteUser invalid ... test#4
	testData = {};

	testObj = {
		reqMethod: 'PATCH',
		reqBody: {password: 'admin'},
		resCode: 400,
		resBody: 'Authentication Error: no username given',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test deleteUser invalid ... test#4';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test deleteUser invalid ... test#5
	testData = {};

	testObj = {
		reqMethod: 'PATCH',
		reqBody: {username: 'xxx', password: 'xxx'},
		resCode: 401,
		resBody: 'Authentication Error: username does not exist',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test deleteUser invalid ... test#5';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test deleteUser invalid ... test#6
	testData = {};

	testObj = {
		reqMethod: 'PATCH',
		reqBody: {username: 'admin', password: 'xxx'},
		resCode: 401,
		resBody: 'Authentication Error: invalid password',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test deleteUser invalid ... test#6';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST ### - Test deleteUser valid ... test#1
	testData = {};

	testObj = {
		reqMethod: 'PATCH',
		reqBody: {username: 'test', password: 'test'},
		resCode: 204,
		resBody: '',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test deleteUser valid ... test#1';

	testData.skip = false;
	suites.get(suiteDesc).push(testData);

	// TEST SUITE ### - Test Authentication Route - getUsers
	suiteDesc = 'Test Authentication Route - getUsers';
	suites.set(suiteDesc, []);

	// TEST ### - Test getUsers valid ... test#1
	testData = {};

	testObj = {
		reqMethod: 'GET',
		reqBody: '',
		resCode: 200,
		resBody: '',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test getUsers valid ... test#1';

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
					await makeTest(cmdObj);
				});
			}
		});
	}
}
/* node:coverage disable */

/**
 * @func  defRunner
 * @desc  Carry out the loaded tests using this developed test runner.
 */
function defRunner(){

	cmdOptions.verbose && process.on('exit', () => {
		console.log();
		console.log('▶ tests',    -- testCount);
		console.log('▶ suites',      suites.size);
		console.log('▶ pass',        passCount);
		console.log('▶ fail',        failCount);
		console.log('▶ cancelled',   cancelCount);
		console.log('▶ skipped',     skipCount);
		console.log('▶ todo',        todoCount);
		console.log('▶ duration_ms', Math.round(Date.now() - startTime));
	});

	cmdOptions.verbose && console.error();
	for(let [suiteDesc, suiteTests] of suites)
		for(let cmdObj of suiteTests){
			if(!cmdObj.skip){
				(async() => {
					await makeTest(cmdObj);
				})();
			}
		}

	cmdOptions.verbose && console.log();
}
/* node:coverage enable */

/**
 * @func
 * @async
 * @param {object} obj - The test data object.
 * @desc  Carry out a single test.
 */
async function makeTest(obj){

	const testID = testCount++;

	let preMsg = `Test#${(testID).toString().padStart(3, '0')} ... `;
	let postMsg = preMsg;

	preMsg += `Initiate ... ${obj.desc}`;
	cmdOptions.verbose && console.error(preMsg);

	if(!cmdOptions.verbose){
		await obj.method();
	}   /* node:coverage disable */
	else{
		try{
			await obj.method();
			passCount++;

			postMsg += `Success  ... ${obj.desc}`;
			cmdOptions.verbose && console.error(postMsg);
		}
		catch(e){
			failCount++;

			postMsg += `Failure  ... ${obj.desc}`;
			cmdOptions.verbose && console.error(postMsg);
		}
	}   /* node:coverage enable */
}

/**
 * @func
 * @async
 * @desc  Carries out the assertions tests.
 */
async function testMethod(){
	await new Promise((resolve, reject) => {

		const cr = http.request(baseUrl, {method: this.reqMethod}, (res) => {
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
							assert('token' in JSON.parse(body));
						}
					}
					resolve();
				}
				catch(err){  /* node:coverage disable */
					reject(err);
				}  /* node:coverage enable */
			});
		});

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
