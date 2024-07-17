import express from "express";
import list from './list';
import auth from "./auth";
import users from "./users"
import currentUser from "./currentUser"

const router = express.Router();

export default (): express.Router => {
	list(router)
	auth(router)
	users(router)
	currentUser(router)
	return router
}
