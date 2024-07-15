import { db } from "..";


export async function userWithEmailExists(email: string) 
	: Promise<{
		userExists: boolean | 'error',
		user: {
			id: string,
			email: string,
			password: string,
			date_created: Date
		} | null
	}> {
	try {
		const result = await db.query(`
			SELECT 1 FROM users 
			WHERE email = $1
		`, [email]);
		return { 
			userExists: result.rowCount > 0,
			user: result.rows[0]
		}
	} catch(error) {
		console.error(error)
		return {
			userExists: 'error',
			user: null
		} 
	}
}
