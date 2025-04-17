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
	 * @param    {string} key - prefix to users keys.
	 * @desc     Constructs a Users object.
	 */
	constructor(client, key){
		this.client = client;
		this.key = key;
	}

	/**
	 * @method
	 * @instance
	 * @memberof module:leaderboard-api-redis-users.Users
	 * @return   {Promise}
	 * @desc     Returns a Promise object that will fulfill with an array of username's.
	 */
	getUsers(){
		return this.client.sendCommand(['KEYS', `${this.key}:*`])
			.then((res) => {
				return res.map(key => key.replace(`${this.key}`, ''));
			});
	}

	/**
	 * @method
	 * @instance
	 * @memberof module:leaderboard-api-redis-users.Users
	 * @param    {string} uname - User name in lowercase.
	 * @param    {string} pwd - MD5 checksum of the password.
	 * @return   {Promise}
	 * @desc     Creates a user or throws on failure.
	 */
	createUser(uname, pwd){
		return this.client.sendCommand(['EXISTS', `${this.key}${uname}`])
			.then((res) => {
				if(!res){
					this.client.sendCommand(['HSET', `${this.key}${uname}`, 'password', pwd]);
				}
				else{
					throw new Error('username already exists');
				}
				return Promise.resolve(`Users.createUser: ${this.key}${uname} key was created`);
			});
	}

	/**
	 * @method
	 * @instance
	 * @memberof module:leaderboard-api-redis-users.Users
	 * @param    {string} uname - User name in lowercase.
	 * @param    {string} pwd - MD5 checksum of the password.
	 * @param    {string} newpwd - (OPTIONAL) MD5 checksum of the new password.
	 * @return   {Promise}
	 * @desc     Updates a user or throws on failure.
	 */
	updateUser(uname, pwd, newpwd){
		return this.client.sendCommand(['EXISTS', `${this.key}${uname}`])
			.then((res) => {
				if(res){
					return this.client.sendCommand(['HGET', `${this.key}${uname}`, 'password']);
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
					this.client.sendCommand(['HSET', `${this.key}${uname}`, 'password', newpwd]);
				}
				return Promise.resolve(`Users.updateUser: ${this.key}${uname} password was updated`);
			});
	}

	/**
	 * @method
	 * @instance
	 * @memberof module:leaderboard-api-redis-users.Users
	 * @param    {string} uname - User name in lowercase.
	 * @param    {string} pwd - MD5 checksum of the password.
	 * @return   {Promise}
	 * @desc     Deletes a user or throws on failure.
	 */
	deleteUser(uname, pwd){
		return this.client.sendCommand(['EXISTS', `${this.key}${uname}`])
			.then((res) => {
				if(res){
					return this.client.sendCommand(['HGET', `${this.key}${uname}`, 'password']);
				}
				else{
					throw new Error('username does not exist');
				}
			})
			.then((res) => {
				if(res === pwd){
					this.client.sendCommand(['DEL', `${this.key}${uname}`]);
				}
				else{
					throw new Error('invalid password');
				}
				return Promise.resolve(`Users.deleteUser: ${this.key}${uname} key was deleted`);
			});
	}
}
