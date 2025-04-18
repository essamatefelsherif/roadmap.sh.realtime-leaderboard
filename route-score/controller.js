/**
 * @module  leaderboard-api-score-controller
 * @desc    The leaderboard-api score controller module.
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
 * @desc   Router-level middleware function to get user activities.
 */
export async function getUserActMiddleware(req, res){

	res.setHeader('Server', req.app.get('serverName'));

	const redisKeyA = req.app.get('redisKeyActivity');
	const redisKeyT = req.app.get('redisKeyTimestamp');

	const leaderboardObj = new LeaderBoard(req.app.get('clientRd'), redisKeyT, redisKeyA);

	try{
		let activities = await leaderboardObj.getUserActivities(req.auth.username);
		res.status(200).send(activities.join(','));
	}
	catch(err){
		res.status(401).send(`Authentication Error: ${err.message}`);
	}
}

/**
 * @func
 * @async
 * @static
 * @param  {object} req - The request object.
 * @param  {object} res - The response object.
 * @return {Promise}
 * @desc   Router-level middleware function to create a user activity.
 * @requires module:leaderboard-api-redis.LeaderBoard.addUserScore
 */
export async function createUserActMiddleware(req, res){

	res.setHeader('Server', req.app.get('serverName'));

	if(Object.keys(req.body).length === 0){
		res.status(400).send('Submission Error: none or invalid request payload');
		return;
	}

	if(!('activity' in req.body || 'score' in req.body)){
		res.status(400).send('Submission Error: no activity/score given');
		return;
	}

	if(!('activity' in req.body) || !req.body.activity){
		res.status(400).send('Submission Error: no activity given');
		return false;
	}

	if(!('score' in req.body) || !req.body.score){
		res.status(400).send('Submission Error: no score given');
		return false;
	}

	const redisKeyA = req.app.get('redisKeyActivity');
	const redisKeyT = req.app.get('redisKeyTimestamp');

	const leaderboardObj = new LeaderBoard(req.app.get('clientRd'), redisKeyT, redisKeyA);

	try{
		let activities = await leaderboardObj.addUserScore(req.body.activity, req.auth.username, req.body.score);
		res.status(201).send(activities);
	}
	catch(err){
		res.status(401).send(`Submission Error: ${err.message}`);
	}
}

/**
 * @func
 * @async
 * @static
 * @param  {object} req - The request object.
 * @param  {object} res - The response object.
 * @return {Promise}
 * @desc   Router-level middleware function to delete a user activity.
 * @requires module:leaderboard-api-redis.LeaderBoard.removeUserScore
 */
export async function deleteUserActMiddleware(req, res){

	res.setHeader('Server', req.app.get('serverName'));

	if(Object.keys(req.body).length === 0){
		res.status(400).send('Submission Error: none or invalid request payload');
		return;
	}

	if(!('activity' in req.body && req.body.activity)){
		res.status(400).send('Submission Error: no activity given');
		return;
	}

	const redisKeyA = req.app.get('redisKeyActivity');
	const redisKeyT = req.app.get('redisKeyTimestamp');

	const leaderboardObj = new LeaderBoard(req.app.get('clientRd'), redisKeyT, redisKeyA);

	try{
		await leaderboardObj.removeUserScore(req.auth.username, req.body.activity);
		res.status(204).send();
	}
	catch(err){
		res.status(401).send(`Submission Error: ${err.message}`);
	}
}

/**
 * @func
 * @async
 * @static
 * @param  {object} req - The request object.
 * @param  {object} res - The response object.
 * @return {Promise}
 * @desc   Router-level middleware function to delete all user activities.
 * @requires module:leaderboard-api-redis.LeaderBoard.removeUserScore
 */
export async function deleteUserMiddleware(req, res){

	res.setHeader('Server', req.app.get('serverName'));

	const redisKeyA = req.app.get('redisKeyActivity');
	const redisKeyT = req.app.get('redisKeyTimestamp');

	const leaderboardObj = new LeaderBoard(req.app.get('clientRd'), redisKeyT, redisKeyA);

	try{
		await leaderboardObj.removeUserScore(req.auth.username);
		res.status(204).send();
	}
	catch(err){
		res.status(401).send(`Submission Error: ${err.message}`);
	}
}
