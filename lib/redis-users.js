/**
 * @module  leaderboard-api-redis-users
 * @desc    The leaderboard-api Redis users module.
 * @version 1.0.0
 * @author  Essam A. El-Sherif
 */

/**
 * @class
 * @static
 * @desc   Class to manage users using Redis.
 */
export class Users{

	/**
	 * @method
	 * @instance
	 * @memberof module:leaderboard-api-redis-users.Users
	 * @param    {object} client - Redis client object.
	 * @param    {string} keyU - prefix to users keys.
	 * @desc     Constructs a Users object.
	 */
	constructor(client, keyU){
		this.client = client;
		this.keyU = keyU;
	}

	/**
	 * @method
	 * @instance
	 * @memberof module:leaderboard-api-redis-users.Users
	 * @return   {Promise}
	 * @desc     Returns a Promise object that will fulfill with an array of username's.
	 */
	getUsers(){
		return this.client.sendCommand(['KEYS', `${this.keyU}:*`])
			.then((res) => {
				return Promise.all(res.map(key => key.replace(`${this.keyU}`, '')));
			});
	}

	/**
	 * @method
	 * @instance
	 * @memberof module:leaderboard-api-redis-users.Users
	 * @param    {string} username - User name in lowercase.
	 * @param    {string} pwd - MD5 checksum of the password.
	 * @return   {Promise}
	 * @desc     Creates a user or throws on failure.
	 */
	createUser(username, pwd){
		return this.client.sendCommand(['EXISTS', `${this.keyU}${username}`])
			.then((res) => {
				if(res){
					throw new Error('username already exists');
				}
				return this.client.sendCommand(['HSET', `${this.keyU}${username}`, 'password', pwd]);
			})
			.then(() => {
				return {username, password: '********'};
			});
	}

	/**
	 * @method
	 * @instance
	 * @memberof module:leaderboard-api-redis-users.Users
	 * @param    {string} username - User name in lowercase.
	 * @param    {string} pwd - MD5 checksum of the password.
	 * @param    {string} newpwd - (OPTIONAL) MD5 checksum of the new password.
	 * @return   {Promise}
	 * @desc     Updates a user or throws on failure.
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
			.then(() => {
				return {username, password: '********'};
			});
	}

	/**
	 * @method
	 * @instance
	 * @memberof module:leaderboard-api-redis-users.Users
	 * @param    {string} username - User name in lowercase.
	 * @param    {string} pwd - MD5 checksum of the password.
	 * @return   {Promise}
	 * @desc     Deletes a user or throws on failure.
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
			.then(() => {
				return {username, password: '********'};
			});
	}
}
