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
			FROM notes
			WHERE user_id = $1
			ORDER BY date_created DESC
		`, [userId])
		if (result.rows) {
			const finalResult = {
				names: result.rows,
				userId
			}
			res.json(finalResult)
		} else {
			res.status(400).json({ error: 'An error occurred while trying to retrieve names' })
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
		DELETE FROM notes
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
	const { name, content } = req.body;
	const userId = (req as any).user
	if (!userId) {
		console.error("User not found")
		return res.status(400).json({ error: "User not found"})
	}
	console.log("Posting...")
	console.log("Name: ", name)
	console.log("Content: ", content)
	console.log("User ID: ", userId)
	if (name && name != "") {
		try {
			const result = await db.query(`
				INSERT INTO notes (title, content, user_id)
				VALUES ($1, $2, $3)
				RETURNING title
			`, [name, content, userId]);
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
	const { title, content } = req.body;
	const id = req.params.id;
	const userId = (req as any).user
	if (!userId) {
		console.error("No user found")
		return res.status(400).json({ error: "No user found"})
	}
	try {
		const result = await db.query(`
			UPDATE notes SET	
			title = COALESCE(NULLIF($1,NULL), title),
			content = COALESCE(NULLIF($4,NULL), content)
			where id = $2 and user_id = $3
		`, [title, id, userId, content])
		if (result.rowCount && result.rowCount > 0) {
			res.status(201).send(`Name with ID ${id} updated to ${title}`)
		} else {
			res.status(400).send('Failed to update the name')
		}
	} catch (error) {
		console.log(error)
		res.status(500).send('Server error')
	}
}


export async function updateNotesPosition(req: express.Request, res: express.Response) {
	const { notes } = req.body;
  if (!Array.isArray(notes)) {
    return res.status(400).json({ message: 'Invalid data format' });
  }
	console.log(notes.map(note => [note.id, note.position]));

  try {
			const query = `
      UPDATE notes
      SET position = CASE
        ${notes.map((_, i) => `WHEN id = $${i * 2 + 1} THEN CAST($${i * 2 + 2} AS INTEGER)`).join(' ')}
      END
      WHERE id IN (${notes.map((_, i) => `$${i * 2 + 1}`).join(', ')});
    `;

    const params = notes.flatMap(note => [note.id, Number(note.position)]);

    await db.query(query, params);

    res.status(200).json({ message: 'Notes order updated successfully' });

  } catch (error) {
    console.error('Error updating notes order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
