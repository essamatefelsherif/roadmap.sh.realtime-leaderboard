/**
 * @module  score-route
 * @desc    The leaderboard-api score route module.
 * @version 1.0.0
 * @author  Essam A. El-Sherif
 */

/* Import package dependencies */
import { Router } from 'express';

/* Import local dependencies */
import {
	addUserScoreMiddleware,
	removeUserScoreMiddleware,
} from './controller.js';

/**
 * @const {object} router - Score router object.
 * @static
 */
const router = Router();

/*
 * ============================================================================================
 * Endpoint    Method  Authorization  Payload                         Router-level middleware
 * ============================================================================================
 * .../score   POST    Yes            {activity:'xxx', score: 'yyy'}  addUserScoreMiddleware
 * .../score   PATCH   Yes            {activity:'xxx'}                removeUserScoreMiddleware
 * .../score   DELETE  Yes                                            removeUserScoreMiddleware
 * ============================================================================================
 */

/* Endpoint: /score Method: POST */
router.post('/', addUserScoreMiddleware );

/* Endpoint: /score Method: PATCH */
router.patch('/', removeUserScoreMiddleware );

/* Endpoint: /score Method: DELETE */
router.delete('/', removeUserScoreMiddleware );

export { router };
