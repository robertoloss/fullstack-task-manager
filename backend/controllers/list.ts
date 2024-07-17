import { db } from ".."
import pg from 'pg'
import express from 'express'

export async function getList(req: express.Request, res: express.Response) {
		db.query(`
			SELECT *
			FROM test
			ORDER BY date_created DESC
		`, (err: Error, result: pg.QueryResult<any>) => {
			if (err) {
				console.error(err)
				return
			} else {
				const user = (req as any).user;
				const finalResult = {
					names: result.rows,
					user
				}
				res.send(finalResult)
			} 
		})
	}

export async function deleteListEntry(req: express.Request, res: express.Response) {
	const id = req.params.id;
	try {
		const delRes = await db.query(`
		DELETE FROM test
		WHERE id = $1
	`, [id])
	if (delRes.rowCount && delRes.rowCount > 0) {
					res.status(200).send(`Name with ID ${id} deleted.`);
			} else {
					res.status(404).send(`Name with ID ${id} not found.`);
			}
	} catch (err) {
			console.error(err);
			res.status(500).send('Server error.');
	}

};

export async function postListEntry(req: express.Request, res: express.Response) {
	const { name } = req.body;
	console.log("Posting...")
	console.log("Name: ", name)
	if (name && name != "") {
		try {
			const result = await db.query('INSERT INTO test (name) VALUES ($1) RETURNING name', [name]);

			if (result.rows.length > 0) {
					res.status(201).json(result.rows[0])
			} else {
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
	if (name && name != "") {
		try {
			const result = await db.query(`
				UPDATE test
				SET	name = $1
				where id = $2
			`, [name, id])

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
