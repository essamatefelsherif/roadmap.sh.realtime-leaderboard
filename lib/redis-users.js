/**
 * @module  redis-users
 * @desc    The leaderboard-api Redis users module.
 * @version 1.0.0
 * @author  Essam A. El-Sherif
 */

/**
 * @class
 * @static
 * @desc Class to manage users of the leaderboard system using Redis.
 */
export class Users{

	/**
	 * @method
	 * @instance
	 * @memberof module:redis-users.Users
	 * @param    {object} client - Redis client object.
	 * @param    {string} keyU - Namespace for Redis users keys.
	 * @desc     Constructs and returns a Users object.
	 */
	constructor(client, keyU){
		this.client = client;
		this.keyU = keyU;
	}

	/**
	 * @method
	 * @instance
	 * @memberof module:redis-users.Users
	 * @return   {Promise} A Promise object that will fulfill with an array of username's.
	 * @desc     Returns a Promise object that will fulfill with an array of username's.
	 */
	getUsers(){
		return this.client.sendCommand(['KEYS', `${this.keyU}*`])
				.then((res) => Promise.all(
						res.map(key => ({
							username: key.replace(`${this.keyU}`, ''),
							password: '********'
			 			}))));
	}

	/**
	 * @method
	 * @instance
	 * @memberof module:redis-users.Users
	 * @param    {string} username - User name in lowercase.
	 * @param    {string} pwd - MD5 checksum of the password.
	 * @return   {Promise} A Promise object that will fulfill with user's object.
	 * @desc     Creates a user or throws on failure.
	 * @throws   {Error} Throws an error if the username already exists.
	 */
	createUser(username, pwd){
		return this.client.sendCommand(['EXISTS', `${this.keyU}${username}`])
			.then((res) => {
				if(res){
					throw new Error('username already exists');
				}
				return this.client.sendCommand(['HSET', `${this.keyU}${username}`, 'password', pwd]);
			})
			.then(() => ({username, password: '********'}));
	}

	/**
	 * @method
	 * @instance
	 * @memberof module:redis-users.Users
	 * @param    {string} username - User name in lowercase.
	 * @param    {string} pwd - MD5 checksum of the password.
	 * @param    {string} newpwd - (OPTIONAL) MD5 checksum of the new password.
	 * @return   {Promise} A Promise object that will fulfill with user's object.
	 * @desc     Updates a user or throws on failure.
	 * @throws   {Error} Throws an error if the username does not exist or incorrect password was given.
	 */
	updateUser(username, pwd, newpwd){
		return this.client.sendCommand(['EXISTS', `${this.keyU}${username}`])
			.then((res) => {
				if(res){
					return this.client.sendCommand(['HGET', `${this.keyU}${username}`, 'password']);
				}
				else{
					throw new Error('username does not exist');
				}
			})
			.then((res) => {
				if(res !== pwd){
					throw new Error('invalid password');
				}
				else
				if(newpwd){
					return this.client.sendCommand(['HSET', `${this.keyU}${username}`, 'password', newpwd]);
				}
			})
			.then(() => ({username, password: '********'}));
	}

	/**
	 * @method
	 * @instance
	 * @memberof module:redis-users.Users
	 * @param    {string} username - User name in lowercase.
	 * @param    {string} pwd - MD5 checksum of the password.
	 * @return   {Promise} A Promise object that will fulfill with user's object.
	 * @desc     Deletes a user or throws on failure.
	 * @throws   {Error} Throws an error if the username does not exist or incorrect password was given.
	 */
	deleteUser(username, pwd){
		return this.client.sendCommand(['EXISTS', `${this.keyU}${username}`])
			.then((res) => {
				if(res){
					return this.client.sendCommand(['HGET', `${this.keyU}${username}`, 'password']);
				}
				else{
					throw new Error('username does not exist');
				}
			})
			.then((res) => {
				if(res === pwd){
					return this.client.sendCommand(['DEL', `${this.keyU}${username}`]);
				}
				else{
					throw new Error('invalid password');
				}
			})
			.then(() => ({username, password: '********'}));
	}
}
