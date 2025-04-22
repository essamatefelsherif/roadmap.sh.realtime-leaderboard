/**
 * @module  leaderboard-route
 * @desc    The leaderboard-api leaderboard route module.
 * @version 1.0.0
 * @author  Essam A. El-Sherif
 */

/* Import package dependencies */
import { Router } from 'express';

/* Import local dependencies */
import {
	getActAllMiddleware,
	getActTopMiddleware,
	getActUsrMiddleware,
	getAllMiddleware,
	getTopMiddleware,
	getUsrMiddleware,
} from './controller.js';

/**
 * @const {object} router - Leaderboard router object.
 * @static
 */
const router = Router();

/*
 * =========================================================================================
 * Endpoint                                   Method  Authorization  Router-level middleware
 * =========================================================================================
 * .../leaderboard/:activity                  GET     Yes            getActAllMiddleware
 * .../leaderboard/:activity/top              GET     Yes            getActTopMiddleware
 * .../leaderboard/:activity/top/:count       GET     Yes            getActTopMiddleware
 * .../leaderboard/:activity/user/:username   GET     Yes            getActUsrMiddleware
 * .../leaderboard/global                     GET     Yes            getAllMiddleware
 * .../leaderboard/global/top                 GET     Yes            getTopMiddleware
 * .../leaderboard/global/top/:count          GET     Yes            getTopMiddleware
 * .../leaderboard/global/user/:username      GET     Yes            getUsrMiddleware
 * =========================================================================================
 */

router.get('/global/user/:username', getUsrMiddleware );
router.get('/global/top/:count',     getTopMiddleware );
router.get('/global/top',            getTopMiddleware );
router.get('/global',                getAllMiddleware );

router.get('/:activity/user/:username', getActUsrMiddleware );
router.get('/:activity/top/:count',     getActTopMiddleware );
router.get('/:activity/top',            getActTopMiddleware );
router.get('/:activity',                getActAllMiddleware );

router.use((req, res) => {
	if(req.method.toUpperCase() !== 'GET'){
		res.status(404).send(`Retrieval Error: invalid request method '${req.method}'`);
	}
	else{
		res.status(404).send(`Retrieval Error: invalid endpoint`);
	}
})

export { router };
