import { getAllUsers, deleteUser } from '../controllers/users';
import express from 'express';

export default function(router: express.Router) {
	router.get('/users', getAllUsers)
	router.delete('/users/:id', deleteUser)
}
