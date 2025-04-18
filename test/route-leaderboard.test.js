/**
 * @module  leaderboard-api-leaderboard-route-test
 * @desc    The leaderboard-api leaderboard route testing module.
 * @version 1.0.0
 * @author  Essam A. El-Sherif
 */

/* Import node.js core modules */
import assert from 'node:assert/strict';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

/* Import local dependencies */
import { TestData } from './test-data.js';
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

const baseUrl = `http://${process.env.lb_serverHost}:${process.env.lb_serverPort}/leaderboard/`;
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

	// TEST SUITE ### - Test Leaderboard Route - createUserActivity
	suiteDesc = 'Test Leaderboard Route - createUserActivity';
	suites.set(suiteDesc, []);

	// TEST ### - Test createUserActivity invalid ... test#1
	testData = {};

	testObj = {
		reqUrl : `${baseUrl}`;
		reqMethod: 'GET',
		reqAuth: undefined,
		reqBody: undefined,
		resCode: 401,
		resBody: 'Authorization Error: No authorization token was found',
	};

	testData.method = testMethod.bind(testObj);
	testData.desc = 'Test createUserActivity invalid ... test#1';

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

		const cr = http.request(this.reqUrl, {method: this.reqMethod}, (res) => {
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
