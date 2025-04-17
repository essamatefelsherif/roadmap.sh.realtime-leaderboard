/**
 * @module  leaderboard-api-redis
 * @desc    The leaderboard-api Redis leaderboard module.
 * @version 1.0.0
 * @author  Essam A. El-Sherif
 */

/**
 * @class
 * @static
 * @desc   Class to manage leaderboard system using Redis.
 */
export class LeaderBoard{

	/**
	 * @method   constructor
	 * @instance
	 * @memberof module:leaderboard-api-redis.LeaderBoard
	 * @param    {object} client - Redis client object.
	 * @param    {string} keyA - namespace for activities key(s).
	 * @param    {string} keyT - namespace for timestamp key(s).
	 * @desc     Constructs a LeaderBoard object.
	 */
	constructor(client, keyT, keyA){
		this.client = client;
		this.keyT = keyT;
		this.keyA = keyA;
	}

	/**
	 * @method
	 * @instance
	 * @memberof module:leaderboard-api-redis.LeaderBoard
	 * @param    {string} activity.
	 * @param    {string} username.
	 * @param    {number} score.
	 * @return   {Promise} A Promise object that will fulfill upon adding the user.
	 * @desc     Add a user.
	 */
	addUserScore(activity, username, score){

		return this.client.sendCommand([
			'HSET',
			`${this.keyT}${activity}:${username}`,
			'timestamp', String(Date.now()),
		])
		.then(()=> {
			this.client.ZADD(`${this.keyA}${activity}`, [{score: score, value: username}]);
			return {activity, score, username};
		});
	}

	/**
	 * @method
	 * @instance
	 * @memberof module:leaderboard-api-redis.LeaderBoard
	 * @param    {string} username.
	 * @param    {string} activity - (Optional).
	 * @return   {Promise} A Promise object that will fulfill upon removing the user activities.
	 * @desc     Remove a user activity, or remove all user activities if second parameter was not given.
	 */
	removeUserScore(username, activity){

		return this.client.sendCommand([
			'KEYS',
			`${this.keyT}${activity || '*'}:${username}`,
		])
		.then((res) => {
			if(res.length){
				res = res.filter(str => str.endsWith(username));
				Promise.all(res.map(tsKey => this.client.sendCommand(['DEL', tsKey])));
			}
		})
		.then(() => {
			return this.client.sendCommand(['KEYS', `${this.keyA}${activity || '*'}`]);
		})
		.then((res) => {
			if(res.length){
				Promise.all(res.map(key => this.client.sendCommand(['ZREM', key, username])));
			}
			return Promise.resolve(`LeaderBoard.removeUserScore: removed ${res.length} username/activity`);
		});
	}

	getUserActivities(username){

		return this.client.sendCommand([
			'KEYS',
			`${this.keyT}*:${username}`,
		])
		.then((res) => {
			return res.map(k => k.replace(this.keyT, '')).map(k => k.replace(`:${username}`, ''));
		});
	}

	/**
	 * @method
	 * @instance
	 * @memberof module:leaderboard-api-redis.LeaderBoard
	 * @param    {string} activity.
	 * @param    {string} username.
	 * @return   {Promise} A Promise object that will fulfill with the user score and rank.
	 * @desc     Retuens a user score and rank.
	 */
	getUserScoreAndRank(activity, username){
		let zscore, zrevrank;

  		return this.client.ZSCORE(`${this.keyA}${activity}`, username)
			.then((res) => {
				zscore = res;
 				return this.client.zRevRank(`${this.keyA}${activity}`, username);
			})
			.then((res) => {
				zrevrank = res;
				return {username, score: zscore, rank: zrevrank};
			});
	}

	/**
	 * @method
	 * @instance
	 * @memberof module:leaderboard-api-redis.LeaderBoard
	 * @param    {number} n.
	 * @return   {Promise} A Promise object that will fulfill upon displaying the top n users.
	 * @desc     Display score and rank of top n users.
	 */
	showTopUsers(activity, n){

		return client.sendCommand(['ZREVRANGE', `${this.keyA}${activity}`, String(0), String(n - 1), 'WITHSCORES'])
			.then((res) => {
				const top = [];
				for(let i = 0, rank = 1 ; i < res.length ; i += 2, rank++){
					top.push({ username: res[i], score: res[i + 1], rank: rank });
				}
				return top;
			});
	}

	/**
	 * @method   getUsersAroundUser
	 * @instance
	 * @memberof module:leaderboard-api-redis.LeaderBoard
	 * @param    {string} username.
	 * @param    {number} n.
	 * @param    {function} callback.
	 * @return   {Promise} A Promise object that will fulfill upon displaying the n users around the given user.
	 * @desc     Display n users around the given user.
	 */
	getUsersAroundUser(username, n, callback){
		const leaderboardKey = this.key;

		return client.zRevRank(leaderboardKey, username)
			.then((zrevrankReply) => {
				let startOffset = Math.floor(zrevrankReply - (n / 2) + 1);
				if(startOffset < 0){
					startOffset = 0;
				}
				let endOffset = startOffset + n - 1;

				return client.sendCommand(['ZREVRANGE', leaderboardKey, String(startOffset), String(endOffset), 'WITHSCORES'])
					.then((zrevrangeReply) => {
						let users = [];
						for (let i = 0, rank = 1 ; i < zrevrangeReply.length ; i += 2, rank++){
							let user = {
								rank: startOffset + rank,
								score: zrevrangeReply[i + 1],
								username: zrevrangeReply[i],
							};
							users.push(user);
						}
						callback(users);
					});
		});
	}
}

