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
	const id = req.params.id;
	console.log("Id of user to delete: ", id)
	try {
		const response = await db.query(`
			DELETE FROM users
			WHERE id = $1
		`,[id])
		if (response.rowCount > 0) res.sendStatus(200)
		else res.sendStatus(400)
	} catch(error) {
		console.error(error)
		res.sendStatus(400)
	}
}

export async function getCurrentUser(req: express.Request, res: express.Response) {
	const user = (req as any).user;
	res.json({user: user})
}
