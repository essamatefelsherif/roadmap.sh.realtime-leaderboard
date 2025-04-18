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
	 * @return   {Promise} A Promise object that will fulfill upon adding the user's activity/score.
	 * @desc     Add a user activity/score.
	 */
	addUserScore(activity, username, score){

		let timestamp = Date.now();

		return this.client.sendCommand([
			'HSET',
			`${this.keyT}${activity}:${username}`,
			'timestamp', String(timestamp),
		])
		.then(()=> {
			return this.client.ZADD(`${this.keyA}${activity}`, [{score: score, value: username}]);
		})
		.then(() => {
			return {activity, username, score, timestamp};
		});
	}

	/**
	 * @method
	 * @instance
	 * @memberof module:leaderboard-api-redis.LeaderBoard
	 * @param    {string} username.
	 * @param    {string} activity - (Optional).
	 * @return   {Promise} A Promise object that will fulfill upon removing the user's activity/score.
	 * @desc     Remove a user's activity/score, or remove all user activities if second parameter was not given.
	 */
	removeUserScore(username, activity){

		return this.client.sendCommand([
			'KEYS',
			`${this.keyT}${activity || '*'}:${username}`,
		])
		.then((res) => {
			res = res.filter(str => str.endsWith(username));
			return Promise.all(res.map(tsKey => this.client.sendCommand(['DEL', tsKey])));
		})
		.then(() => {
			return this.client.sendCommand(['KEYS', `${this.keyA}${activity || '*'}`]);
		})
		.then((res) => {
			return Promise.all(res.map(key => this.client.sendCommand(['ZREM', key, username])));
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
		let score, rank, timestamp;

  		return this.client.ZSCORE(`${this.keyA}${activity}`, username)
			.then((res) => {
				score = res;
 				return this.client.zRevRank(`${this.keyA}${activity}`, username);
			})
			.then((res) => {
				rank = res + 1;
				return this.client.sendCommand(['HGET', `${this.ketT}${activity}:${username}`, 'timestamp']);
			})
			.then((res) => {
				timestamp = res;
				return {activity, username, score, timestamp, rank};
			});
	}

	/**
	 * @method
	 * @instance
	 * @memberof module:leaderboard-api-redis.LeaderBoard
	 * @param    {string} activity
	 * @return   {Promise} A Promise object that will fulfill with a leaderboard array of objects.
	 * @desc     Retrieve a leaderboard array of objects for such activity.
	 */
	getActivity(activity){
		let actUser = [];
		let tsKeys = null, tsValues = null;

		return this.client.sendCommand([
			'KEYS',
			`${this.keyA}${activity}`,
		])
		.then((res) => {
			if(!res.length){
				throw new Error(`no activity '${activity}'`);
			}
			return this.client.sendCommand([
				'ZREVRANGE',
				`${this.keyA}${activity}`,
				'0', '-1', 'WITHSCORES'
			]);
		})
		.then((res) => {

			for(let i = 0; i < res.length; i += 2){
				let entry = {};
				entry.activity  = activity;
				entry.username  = res[i];
				entry.score     = res[i+1];
				entry.timestamp = -1;
				entry.rank      = i / 2 + 1;
				actUser.push(entry);
			}

			return this.client.sendCommand([
				'KEYS',
				`${this.keyT}${activity}*`,
			]);
		})
		.then((res) => {
			tsKeys = res;
			return Promise.all(res.map(key =>
				this.client.sendCommand([
					'HGET', key, 'timestamp'])
				));
		})
		.then((res) => {
			tsValues = res;

			let tsObj = {};
			for(let i = 0; i < tsKeys.length; i++){
				tsObj[tsKeys[i].replace(`${this.keyT}`, '')] = tsValues[i];
			}

			for(let i = 0; i < actUser.length; i++){
				let key = `${actUser[i].activity}:${actUser[i].username}`;
				actUser[i].timestamp = tsObj[key];
			}

			return actUser;
		});
	}

	/**
	 * @method
	 * @instance
	 * @memberof module:leaderboard-api-redis.LeaderBoard
	 * @return   {Promise} A Promise object that will fulfill with a leaderboard array of objects.
	 * @desc     Retrieve a leaderboard array of objects for all activities.
	 */
	getActivities(){
		let actUser = [];
		let actKeys = null, actValues = null;
		let tsKeys = null, tsValues = null;

		return this.client.sendCommand([
			'KEYS',
			`${this.keyA}*`,
		])
		.then((res) => {
			actKeys = res;
			return Promise.all(res.map(key =>
				this.client.sendCommand([
					'ZRANGE',
					key,
					'0', '-1', 'WITHSCORES'])
				)
			);
		})
		.then((res) => {
			actValues = res;

			for(let i = 0; i < actValues.length; i++){
				for(let j = 0; j < actValues[i].length; j += 2){
					let entry = {};
					entry.activity = actKeys[i].replace(`${this.keyA}`, '');
					entry.username = actValues[i][j];
					entry.score    = actValues[i][j+1];
					entry.timestamp = -1;
					entry.rank      = -1;
					actUser.push(entry);
				}
			}

			return this.client.sendCommand([
				'KEYS',
				`${this.keyT}*`,
			]);
		})
		.then((res) => {
			tsKeys = res;
			return Promise.all(res.map(key =>
				this.client.sendCommand([
					'HGET', key, 'timestamp'])
			));
		})
		.then((res) => {
			tsValues = res;

			let tsObj = {};
			for(let i = 0; i < tsKeys.length; i++){
				tsObj[tsKeys[i].replace(`${this.keyT}`, '')] = tsValues[i];
			}

			for(let i = 0; i < actUser.length; i++){
				let key = `${actUser[i].activity}:${actUser[i].username}`;
				actUser[i].timestamp = tsObj[key];
			}

			actUser.sort((a, b) => {
				if(+a.score < +b.score) return 1;
				else if(+a.score > +b.score) return -1;
				else if(a.activity < b.activity) return -1;
				else if(a.activity > b.activity) return 1;
				else if(a.username < b.username) return -1;
				else return 1;
			})
			.forEach((e, i, a) => e.rank = i + 1);

			return actUser;
		});
	}

	/**
	 * @method
	 * @instance
	 * @memberof module:leaderboard-api-redis.LeaderBoard
	 * @param    {string} username
	 * @return   {Promise} A Promise object that will fulfill with a leaderboard array of objects.
	 * @desc     Retrieve a leaderboard array of objects for all activities of the given username.
	 */
	getUserActivities(username){
		let actUser = [];
		let actKeys = null, actValues = null;
		let tsKeys = null, tsValues = null;

		return this.client.sendCommand([
			'KEYS',
			`${this.keyT}*:${username}`,
		])
		.then((res) => {
			tsKeys = res;

			return Promise.all(res.map(key =>
				this.client.sendCommand([
					'HGET', key, 'timestamp'])
			));
		})
		.then((res) => {
			tsValues = res;

			actKeys = tsKeys
				.map(key => key.replace(`:${username}`, ''))
				.map(key => key.replace(`${this.keyT}`, `${this.keyA}`));

			return Promise.all(actKeys.map(key =>
				this.client.sendCommand([
					'ZRANGE',
					key,
					'0', '-1', 'WITHSCORES'])
				)
			);
		})
		.then((res) => {
			for(let i = 0; i < res.length; i++){
				for(let j = 0; j < res[i].length; j += 2){
					if(res[i][j] === username){
						res[i] = [res[i][j], res[i][j+1]];
						break;
					}
				}
			}
			actValues = res;
			for(let i = 0; i < actValues.length; i++){
				let entry = {};
				entry.activity = actKeys[i].replace(`${this.keyA}`, '');
				entry.username = actValues[i][0];
				entry.score    = actValues[i][1];
				entry.timestamp = -1;
				entry.rank      = -1;
				actUser.push(entry);
			}

			let tsObj = {};
			for(let i = 0; i < tsKeys.length; i++){
				tsObj[tsKeys[i].replace(`${this.keyT}`, '')] = tsValues[i];
			}

			for(let i = 0; i < actUser.length; i++){
				let key = `${actUser[i].activity}:${actUser[i].username}`;
				actUser[i].timestamp = tsObj[key];
			}

			actUser.sort((a, b) => {
				if(+a.score < +b.score) return 1;
				else if(+a.score > +b.score) return -1;
				else if(a.activity < b.activity) return -1;
				else if(a.activity > b.activity) return 1;
				else return 1;
			})
			.forEach((e, i, a) => e.rank = i + 1);

			return actUser;
		});
	}

	/**
	 * @method
	 * @instance
	 * @memberof module:leaderboard-api-redis.LeaderBoard
	 * @param    {string} activity.
	 * @param    {number} n.
	 * @return   {Promise} A Promise object that will fulfill with a leaderboard array of objects.
	 * @desc     Retrieve a leaderboard array of objects for n top users of the given activity.
	 */
	getActivityTopUsers(activity, n){

		let tsKeys = null, tsValues = null;

		return this.client.sendCommand([
			'KEYS',
			`${this.keyT}${activity}*`,
		])
		.then((res) => {
			tsKeys = res;
			return Promise.all(res.map(key =>
				this.client.sendCommand([
					'HGET', key, 'timestamp'])
				));
		})
		.then((res) => {
			tsValues = res;

			return client.sendCommand([
				'ZREVRANGE',
				`${this.keyA}${activity}`, String(0), String(n - 1), 'WITHSCORES']);
		})
		.then((res) => {

			let tsObj = {};
			for(let i = 0; i < tsKeys.length; i++){
				tsObj[tsKeys[i].replace(`${this.keyT}`, '').replace(`${activity}:`, '')] = tsValues[i];
			}

			const actUser = [];
			for(let i = 0, rank = 1 ; i < res.length ; i += 2, rank++){
				actUser.push({ activity, username: res[i], score: res[i + 1], timestamp: tsObj[res[i]], rank: rank });
			}
			return actUser;
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

