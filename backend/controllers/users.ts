import express from 'express';
import { db } from '../index';

export async function getAllUsers(_req: express.Request, res: express.Response) {
	try {
		const response = await db.query(`
			SELECT * FROM qwiknotes.users
		`)
		if (response.rowCount && response.rowCount > 0) res.send(response.rows)
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
			DELETE FROM qwiknotes.users
			WHERE id = $1
		`,[id])
		if (response.rowCount && response.rowCount > 0) res.sendStatus(200)
		else res.sendStatus(400)
	} catch(error) {
		console.error(error)
		res.sendStatus(400)
	}
}

export async function getCurrentUser(req: express.Request, res: express.Response) {
	const userId = (req as any).user;
	try {
		const result = await db.query(`
			SELECT email from qwiknotes.users
			WHERE id = $1
		`, [userId])
		if (result.rowCount && result.rowCount > 0) {
			const user = result.rows[0]
			res.json({ user })
		} else {
			res.status(400).json({ error: "No user found" })
		}
	} catch(error) {
		console.error(error)	
	}
}
