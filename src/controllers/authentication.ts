import express from 'express'
import { userWithEmailExists } from '../db/users';
import { hashPassword } from '../helpers';
import { db } from '..';


export async function register(req: express.Request, res: express.Response) {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			console.error('Some credentials (either email or password) are missing')
			res.sendStatus(400)
		}
		console.log("Credentials: ok", email, password)
		const userExists = await userWithEmailExists(email);
		console.log("here")
		if (userExists) {
			console.log("user exists")
			res.sendStatus(400)
		} else if (userExists === 'error') {
			console.log("userExists error!")
			res.sendStatus(400)
		} else {
			const hash = await hashPassword(password)
			console.log("Hash: ", hash)
			const result = await db.query(`
				INSERT INTO users
				(email, password)
				VALUES($1, $2)
				RETURNING id
			`, [email, hash])
			if (result.rowCount && result.rowCount > 0) {
					console.log("User created: ", result.rows[0])
					res.sendStatus(201)
			} else res.sendStatus(400)
		}
	} catch(error) {
		console.error(error)
	}
}


export async function login(req: express.Request, res: express.Response) {
	try {

	} catch(error) {
		console.error(error)
	}
}
