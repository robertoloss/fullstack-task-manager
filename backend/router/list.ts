import express from 'express'
import { deleteListEntry, getList, postListEntry, updateListEntry } from '../controllers/list'
import { verifyToken } from '../middleware';

export default (router: express.Router) => {
	router.get('/list', verifyToken, getList)
	router.delete('/list/:id', verifyToken, deleteListEntry);
	router.post('/list', verifyToken, postListEntry);
	router.put('/list/:id', verifyToken, updateListEntry)
}
