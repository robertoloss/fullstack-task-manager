import { verifyToken } from '../middleware';
import { getAllUsers, deleteUser } from '../controllers/users';
import express from 'express';

export default function(router: express.Router) {
	router.get('/users', verifyToken, getAllUsers)
	router.delete('/users/:id', verifyToken, deleteUser)
}
