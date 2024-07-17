import { getCurrentUser } from '../controllers/users'
import express from 'express'
import { verifyToken } from '../middleware'


export default async function(router: express.Router) {
	router.get('/current-user', verifyToken, getCurrentUser)
}
