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
			SELECT * FROM qwiknotes.users 
			WHERE email = $1
		`, [email]);
		console.log("userWithEmailExists: ", result.rows)
		if (result.rowCount > 0) {
			console.log("userWithEmailExists: YES")
			return { 
				userExists: result.rowCount > 0,
				user: result.rows[0]
			}
		}  else {
			console.log("userWithEmailExists: NO")
			return {
				userExists: false,
				user: null
			}
		}
	} catch(error) {
		console.error("there was an error (userWithEmailExists): ", error)
		return {
			userExists: 'error',
			user: null
		} 
	}
}
