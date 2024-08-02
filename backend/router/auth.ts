import express from 'express'
import { logOut, login, register } from '../controllers/authentication'

export default function(router: express.Router) {
	router.post('/auth/register', register)
	router.post('/auth/login', login)
	router.post('/auth/logout', logOut)
}
