import { updateNotesPosition } from '../controllers/list'
import express from 'express'
import { verifyToken } from '../middleware';

export default function(router: express.Router) {
	router.post('/update-notes-order', verifyToken, updateNotesPosition)
}
