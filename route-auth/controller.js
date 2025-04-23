/**
 * @module  auth-route-controller
 * @desc    The leaderboard-api authentication controller module.
 * @version 1.0.0
 * @author  Essam A. El-Sherif
 */

/* Import node.js common modules */
import { createHash } from 'node:crypto';

/* Import package dependencies */
import jwt from 'jsonwebtoken';

/* Import local dependencies */
import { Users } from './model.js';
import { LeaderBoard } from './model.js';

/**
 * @func
 * @async
 * @static
 * @param  {object} req - The request object.
 * @param  {object} res - The response object.
 * @return {Promise}
 * @desc   Router-level middleware function to get all users.
 * @requires module:redis-users.Users.getUsers
 */
export async function getUsersMiddleware(req, res){

	res.setHeader('Server', req.app.get('serverName'));

	const usersObj = new Users(req.app.get('clientRd'), req.app.get('redisKeyUser'));

	try{
		let users = await usersObj.getUsers();
		res.status(200).send(users.map((u) => u.username).join(','));
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
 * @desc   Router-level middleware function to create a nonexistent user and responds with JWT token.
 * @requires module:redis-users.Users.createUser
 */
export async function createUserMiddleware(req, res){

	if(!verifyCredentials(req, res)) return;

	const usersObj = new Users(req.app.get('clientRd'), req.app.get('redisKeyUser'));

	const user = {
		username: req.body.username.toLowerCase(),
		password: createHash('md5').update(req.body.password).digest('hex')
	};

	try{
		await usersObj.createUser(user.username, user.password);

		const payload = { ...user };
		delete payload.password;

		// https://www.npmjs.com/package/jsonwebtoken?activeTab=readme#jwtsignpayload-secretorprivatekey-options-callback
		// jwt.sign(payload, secretOrPrivateKey, [options, callback])
		const token = jwt.sign(payload, req.app.get('secretKey'), {algorithm: 'HS256'});

		res.status(201).json({ token });
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
 * @desc   Router-level middleware function to update an existing user and responds with JWT token.
 * @requires module:redis-users.Users.updateUser
 */
export async function updateUserMiddleware(req, res){

	if(!verifyCredentials(req, res)) return;

	const usersObj = new Users(req.app.get('clientRd'), req.app.get('redisKeyUser'));

	const user = {
		username: req.body.username.toLowerCase(),
		password: createHash('md5').update(req.body.password).digest('hex')
	};

	if('newpassword' in req.body && req.body.newpassword){
		user.newpassword = createHash('md5').update(req.body.newpassword).digest('hex');
	}

	try{
		if('newpassword' in req.body){
			await usersObj.updateUser(user.username, user.password, user.newpassword);
		}
		else{
			await usersObj.updateUser(user.username, user.password);
		}

		const payload = { ...user };
		delete payload.password;
		if(payload.newpassword) delete payload.newpassword;

		// https://www.npmjs.com/package/jsonwebtoken?activeTab=readme#jwtsignpayload-secretorprivatekey-options-callback
		// jwt.sign(payload, secretOrPrivateKey, [options, callback])
		const token = jwt.sign(payload, req.app.get('secretKey'), {algorithm: 'HS256'});

		res.status(201).json({ token });
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
 * @desc   Router-level middleware function to delete an existing user.
 * @requires module:redis-users.Users.deleteUser
 * @requires module:redis-leaderboard.LeaderBoard.removeUserScore
 */
export async function deleteUserMiddleware(req, res){

	if(!verifyCredentials(req, res)) return;

	const redisKeyA = req.app.get('redisKeyActivity');
	const redisKeyT = req.app.get('redisKeyTimestamp');

    const leaderboardObj = new LeaderBoard(req.app.get('clientRd'), redisKeyT, redisKeyA);
	const usersObj = new Users(req.app.get('clientRd'), req.app.get('redisKeyUser'));

	const user = {
		username: req.body.username.toLowerCase(),
		password: createHash('md5').update(req.body.password).digest('hex')
	};

	try{
		await usersObj.deleteUser(user.username, user.password);
		await leaderboardObj.removeUserScore(user.username);

		res.status(204).send();
	}
	catch(err){
		res.status(401).send(`Authentication Error: ${err.message}`);
	}
}

/**
 * @func
 * @param  {object} req - The request object.
 * @param  {object} res - The response object.
 * @return {boolean} True when user credentials are verified, false otherwise.
 * @desc   Verifies the user credentials and sends non OK response otherwise.
 */
function verifyCredentials(req, res){

	res.setHeader('Server', req.app.get('serverName'));

	if(Object.keys(req.body).length === 0){
		res.status(400).send('Authentication Error: none or invalid request payload');
		return;
	}

	if(!('username' in req.body || 'password' in req.body)){
		res.status(400).send('Authentication Error: no username/password given');
		return;
	}

	if(!('username' in req.body) || !req.body.username){
		res.status(400).send('Authentication Error: no username given');
		return;
	}

	if(!('password' in req.body) || !req.body.password){
		res.status(400).send('Authentication Error: no password given');
		return;
	}

	return true;
}
