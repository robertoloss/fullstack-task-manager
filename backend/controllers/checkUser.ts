import express from 'express'
import { db } from '../index'

export async function checkUser(req: express.Request, res: express.Response) {
	const { email	} = req.body
	console.log("checkUser - email: ", email)
	try {
		const data = await db.query(`
			SELECT 1 FROM users
			where email=$1
		`, [email])
		console.log("checkUser - data.rows: ", data.rows)
		if (data.rowCount > 0) {
			res.status(200).json({ userExists: true})
		} else {
			res.status(200).json({ userExists: false})
		}
	} catch(err) {
		console.error(err)
		res.sendStatus(500)
	}
}
