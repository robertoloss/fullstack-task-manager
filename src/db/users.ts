import { db } from "..";


export async function userWithEmailExists(email: string) : Promise<boolean | 'error'> {
	try {
		const result = await db.query(`
			SELECT 1 FROM users 
			WHERE email = $1
		`, [email]);
		return result.rowCount > 0
	} catch(error) {
		console.error(error)
		return 'error'
	}
}
