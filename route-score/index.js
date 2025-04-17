/**
 * @module  leaderboard-api-score-route
 * @desc    The leaderboard-api score route module.
 * @version 1.0.0
 * @author  Essam A. El-Sherif
 */

/* Import package dependencies */
import { Router } from 'express';

/* Import local dependencies */
import {
    getUserActMiddleware,
    createUserActMiddleware,
    deleteUserActMiddleware,
    deleteUserMiddleware
} from './controller.js';

/**
 * @const {object} router - Score router object.
 * @static
 */
const router = Router();

/*
 * ========================================================================================
 * Endpoint  Method  Authorization  Payload                         Router-level middleware
 * ========================================================================================
 * /score     GET    Yes                                            getUserActMiddleware
 * /score     POST   Yes            {activity:'xxx', score: 'yyy'}  createUserActMiddleware
 * /score     PATCH  Yes            {activity:'xxx'}                deleteUserActMiddleware
 * /score     DELETE Yes                                            deleteUserMiddleware
 * ========================================================================================
 */

/* Endpoint: /score Method: GET */
router.get('/', getUserActMiddleware );

/* Endpoint: /score Method: POST */
router.post('/', createUserActMiddleware );

/* Endpoint: /score Method: PATCH */
router.patch('/', deleteUserActMiddleware );

/* Endpoint: /score Method: DELETE */
router.delete('/', deleteUserMiddleware );

export { router };
