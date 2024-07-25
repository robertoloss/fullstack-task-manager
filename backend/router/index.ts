import express from "express";
import list from './list';
import auth from "./auth";
import users from "./users"
import currentUser from "./currentUser"
import { verifyUser } from "../controllers/verifyUser";

const router = express.Router();

export default (): express.Router => {
	list(router)
	auth(router)
	users(router)
	currentUser(router)
	router.get('/', ()=>console.log("I AM ROOT"))
	return router
}
