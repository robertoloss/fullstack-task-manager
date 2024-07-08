import express from 'express'
import { deleteListEntry, getList, postListEntry, updateListEntry } from '../controllers/list'

export default (router: express.Router) => {
	router.get('/list', getList)
	router.delete('/list/:id', deleteListEntry);
	router.post('/list', postListEntry);
	router.put('/list/:id', updateListEntry)
}
