import express from "express";
import list from './list';
import auth from "./auth";
import users from "./users"
import positions from "./update-notes-order"
import currentUser from "./currentUser"
import path from 'path'
import { verifyToken } from "../middleware";

const router = express.Router();

export default (): express.Router => {
	list(router)
	auth(router)
	positions(router)
	users(router)
	currentUser(router)
	router.get('/', verifyToken, (_req: express.Request, res: express.Response) => {
		res.sendFile(path.join(process.cwd(), 'frontend', 'index.html'))
	})
	return router
}
