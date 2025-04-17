/**
 * @module  leaderboard-api-auth-route
 * @desc    The leaderboard-api authentication route module.
 * @version 1.0.0
 * @author  Essam A. El-Sherif
 */

/* Import package dependencies */
import { Router } from 'express';

/* Import local dependencies */
import {
	createUserMiddleware,
	updateUserMiddleware,
	deleteUserMiddleware,
	getUsersMiddleware
} from './controller.js';

/**
 * @const {object} router - Authentication router object.
 * @static
 */
const router = Router();

/*
 * ======================================================================================================
 * Endpoint  Method  Auth  Payload                                                Router-level middleware
 * ======================================================================================================
 * /auth     GET     No                                                           getUsersMiddleware
 * /auth     POST    No    {username:'xxx', password: 'yyy'}                      createUserMiddleware
 * /auth     PUT     No    {username:'xxx', password: 'yyy'}                      updateUserMiddleware
 * /auth     PUT     No    {username:'xxx', password: 'yyy', newpassword: 'zzz'}  updateUserMiddleware
 * /auth     PATCH   No    {username:'xxx', password: 'yyy'}                      deleteUserMiddleware
 * ======================================================================================================
 */

/* Endpoint: /auth Method: GET */
router.get('/', getUsersMiddleware );

/* Endpoint: /auth Method: POST */
router.post('/', createUserMiddleware );

/* Endpoint: /auth Method: PUT */
router.put('/', updateUserMiddleware );

/* Endpoint: /auth Method: PATCH */
router.patch('/', deleteUserMiddleware );

export { router };
