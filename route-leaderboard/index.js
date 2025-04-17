/**
 * @module  leaderboard-api-leaderboard-route
 * @desc    The leaderboard-api leaderboard route module.
 * @version 1.0.0
 * @author  Essam A. El-Sherif
 */

/* Import package dependencies */
import { Router } from 'express';

/* Import local dependencies */

/**
 * @const {object} router - Leaderboard router object.
 * @static
 */
const router = Router();

/*
 * ========================================================================================
 * Endpoint                                Method  Authorization  Router-level middleware
 * ========================================================================================
 * /leaderboard/:activity                  GET     Yes            getActMiddleware
 * /leaderboard/:activity/top/:count       GET     Yes            getActMiddleware
 * /leaderboard/:activity/rank/:username   GET     Yes            deleteUserMiddleware
 * /leaderboard/global                     GET     Yes            createUserActMiddleware
 * /leaderboard/global/top/:count          GET     Yes            deleteUserMiddleware
 * /leaderboard/global/rank/:username      GET     Yes            deleteUserMiddleware
 * ========================================================================================
 */

export { router };
