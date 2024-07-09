import express from 'express';
import { db } from '../index';

export async function getAllUsers(_req: express.Request, res: express.Response) {
	try {
		const response = await db.query(`
			SELECT * FROM users
		`)
		if (response.rowCount > 0) res.send(response.rows)
		else res.sendStatus(400)
	} catch (error) {
		console.error(error)
	}
}

export async function deleteUser(req: express.Request, res: express.Response) {
	try {

	} catch(error) {
		console.error(error)
	}
}
