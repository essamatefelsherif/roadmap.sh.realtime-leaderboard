/**
 * @module  leaderboard-api-leaderboard-controller
 * @desc    The leaderboard-api leaderboard controller module.
 * @version 1.0.0
 * @author  Essam A. El-Sherif
 */

/* Import local dependencies */
import { LeaderBoard } from './model.js';

/**
 * @func
 * @async
 * @static
 * @param  {object} req - The request object.
 * @param  {object} res - The response object.
 * @return {Promise}
 * @desc   Router-level middleware function for the endpoint /leaderboard/:activity.
 * @requires module:leaderboard-api-redis.LeaderBoard.getActivity
 */
export async function getActAllMiddleware(req, res){

	res.setHeader('Server', req.app.get('serverName'));

	const redisKeyA = req.app.get('redisKeyActivity');
	const redisKeyT = req.app.get('redisKeyTimestamp');

	const leaderboardObj = new LeaderBoard(req.app.get('clientRd'), redisKeyT, redisKeyA);

	try{
		let activities = await leaderboardObj.getActivity(req.params.activity);
		res.status(200).send(activities);
	}
	catch(err){
		res.status(401).send(`Retrieval Error: ${err.message}`);
	}
}

/**
 * @func
 * @async
 * @static
 * @param  {object} req - The request object.
 * @param  {object} res - The response object.
 * @return {Promise}
 * @desc   Router-level middleware function for the endpoint /leaderboard/:activity/top[/:count].
 * @requires module:leaderboard-api-redis.LeaderBoard.getActivityTopUsers
 */
export async function getActTopMiddleware(req, res){

	res.setHeader('Server', req.app.get('serverName'));

	let topCount = 5;
	if('count' in req.params){
		let parsedCount = parseInt(req.params.count, 10);

		if(Number.isNaN(parsedCount) || parsedCount <= 0){
			res.status(400).send(`Retrieval Error: invalid top count`);
			return;
		}
		else{
			topCount = parsedCount;
		}
	}

	const redisKeyA = req.app.get('redisKeyActivity');
	const redisKeyT = req.app.get('redisKeyTimestamp');

	const leaderboardObj = new LeaderBoard(req.app.get('clientRd'), redisKeyT, redisKeyA);

	try{
		let activities = await leaderboardObj.getActivityTopUsers(req.params.activity, topCount);
		res.status(200).send(activities);
	}
	catch(err){
		res.status(401).send(`Retrieval Error: ${err.message}`);
	}

}

/**
 * @func
 * @async
 * @static
 * @param  {object} req - The request object.
 * @param  {object} res - The response object.
 * @return {Promise}
 * @desc   Router-level middleware function for the endpoint /leaderboard/:activity/user/:username.
 * @requires module:leaderboard-api-redis.LeaderBoard.getUserScoreAndRank
 */
export async function getActUsrMiddleware(req, res){

	res.setHeader('Server', req.app.get('serverName'));

	const redisKeyA = req.app.get('redisKeyActivity');
	const redisKeyT = req.app.get('redisKeyTimestamp');

	const leaderboardObj = new LeaderBoard(req.app.get('clientRd'), redisKeyT, redisKeyA);

	try{
		let activities = await leaderboardObj.getUserScoreAndRank(req.params.activity, req.params.username);
		res.status(200).send(activities);
	}
	catch(err){
		res.status(401).send(`Retrieval Error: ${err.message}`);
	}
}

/**
 * @func
 * @async
 * @static
 * @param  {object} req - The request object.
 * @param  {object} res - The response object.
 * @return {Promise}
 * @desc   Router-level middleware function for the endpoint /leaderboard/global.
 * @requires module:leaderboard-api-redis.LeaderBoard.getActivities
 */
export async function getAllMiddleware(req, res){

	res.setHeader('Server', req.app.get('serverName'));

	const redisKeyA = req.app.get('redisKeyActivity');
	const redisKeyT = req.app.get('redisKeyTimestamp');

	const leaderboardObj = new LeaderBoard(req.app.get('clientRd'), redisKeyT, redisKeyA);

	try{
		let activities = await leaderboardObj.getActivities();
		res.status(200).send(activities);
	}
	catch(err){
		res.status(401).send(`Retrieval Error: ${err.message}`);
	}
}

/**
 * @func
 * @async
 * @static
 * @param  {object} req - The request object.
 * @param  {object} res - The response object.
 * @return {Promise}
 * @desc   Router-level middleware function for the endpoint /leaderboard/global/top[/:count].
 * @requires module:leaderboard-api-redis.LeaderBoard.getActivities
 */
export async function getTopMiddleware(req, res){

	res.setHeader('Server', req.app.get('serverName'));

	let topCount = 5;
	if('count' in req.params){
		let parsedCount = parseInt(req.params.count, 10);

		if(Number.isNaN(parsedCount) || parsedCount <= 0){
			res.status(400).send(`Retrieval Error: invalid top count`);
			return;
		}
		else{
			topCount = parsedCount;
		}
	}

	const redisKeyA = req.app.get('redisKeyActivity');
	const redisKeyT = req.app.get('redisKeyTimestamp');

	const leaderboardObj = new LeaderBoard(req.app.get('clientRd'), redisKeyT, redisKeyA);

	try{
		let activities = await leaderboardObj.getActivities().slice(0, topCount);
		res.status(200).send(activities);
	}
	catch(err){
		res.status(401).send(`Retrieval Error: ${err.message}`);
	}
}

/**
 * @func
 * @async
 * @static
 * @param  {object} req - The request object.
 * @param  {object} res - The response object.
 * @return {Promise}
 * @desc   Router-level middleware function for the endpoint /leaderboard/global/user/:username.
 * @requires module:leaderboard-api-redis.LeaderBoard.getUserActivities
 */
export async function getUsrMiddleware(req, res){

	res.setHeader('Server', req.app.get('serverName'));

	if(!('username' in req.params)){
		res.status(400).send(`Retrieval Error: no username given`);
		return;
	}

	const redisKeyA = req.app.get('redisKeyActivity');
	const redisKeyT = req.app.get('redisKeyTimestamp');

	const leaderboardObj = new LeaderBoard(req.app.get('clientRd'), redisKeyT, redisKeyA);

	try{
		let activities = await leaderboardObj.getUserActivities(req.params.username);
		res.status(200).send(activities);
	}
	catch(err){
		res.status(401).send(`Retrieval Error: ${err.message}`);
	}
}
