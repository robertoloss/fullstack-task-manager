import { db } from ".."
import express from 'express'

export async function getList(req: express.Request, res: express.Response) {
	console.log("Getting list...")
	const userId = (req as any).user
	if (!userId) {
		console.log("userId")
		return res.status(400).json({ error: 'User Id is required'})
	}
	try {
		console.log("Fetching list...")
		console.log("User ID: ", userId)
		const result = await db.query(`
			SELECT *
			FROM test
			WHERE user_id = $1
			ORDER BY date_created DESC
		`, [userId])
		if (result.rowCount && result.rowCount >0) {
			const finalResult = {
				names: result.rows,
				userId
			}
			res.json(finalResult)
		} else {
			res.status(400).json({ error: 'No user found' })
		}
	} catch(error) {
		console.error(error)
	}
}

export async function deleteListEntry(req: express.Request, res: express.Response) {
	const id = req.params.id;
	const userId = (req as any).user
	if (!userId) {
		console.error("No user found")
		return res.status(400).json({ error: "No user found"})
	}
	try {
		const delRes = await db.query(`
		DELETE FROM test
		WHERE id = $1 and user_id = $2
	`, [id, userId])
	if (delRes.rowCount && delRes.rowCount > 0) {
		res.status(200).json({ message: `Name with ID ${id} deleted.` });
	} else {
		res.status(404).json({ message: `Name with ID ${id} not found.` });
	}
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error.');
	}
};

export async function postListEntry(req: express.Request, res: express.Response) {
	const { name } = req.body;
	const userId = (req as any).user
	if (!userId) {
		console.error("User not found")
		return res.status(400).json({ error: "User not found"})
	}
	console.log("Posting...")
	console.log("Name: ", name)
	console.log("User ID: ", userId)
	if (name && name != "") {
		try {
			const result = await db.query(`
				INSERT INTO test (name, user_id)
				VALUES ($1, $2)
				RETURNING name
			`, [name, userId]);
			if (result.rows.length > 0) {
					res.status(201).json(result.rows[0])
			} else {
				console.error("Error: Failed to add row")
				res.status(400).json({ error: 'Failed to add name.' });
			}
		} catch (err) {
				console.error(err);
				res.status(500).json({ error: 'Server error.' });
		}
	} else {
		console.log("empty input!")
		res.status(400).json({ error: 'Name cannot be empty' });
	}
}

export async function updateListEntry(req: express.Request, res: express.Response) {
	const { name } = req.body;
	const id = req.params.id;
	const userId = (req as any).user
	if (!userId) {
		console.error("No user found")
		return res.status(400).json({ error: "No user found"})
	}
	if (name && name != "") {
		try {
			const result = await db.query(`
				UPDATE test
				SET	name = $1
				where id = $2 and user_id = $3
			`, [name, id, userId])
			if (result.rowCount && result.rowCount > 0) {
				res.status(201).send(`Name with ID ${id} updated to ${name}`)
			} else {
				res.status(400).send('Failed to update the name')
			}
		} catch (error) {
			console.log(error)
			res.status(500).send('Server error')
		}
	} else {
		res.status(400).send('Name cannot be empty')
	}
}
