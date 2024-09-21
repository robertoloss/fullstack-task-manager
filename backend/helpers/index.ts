import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export async function hashPassword(password: string) {
	try {
		const hash = await argon2.hash(password)
		return hash
	}	catch(error) {
		console.error(error)
	}
}

export async function verifyPassword(input: string, stored: string) {
	try {
		return await argon2.verify(stored,input)
	} catch(error) {
		console.error(error)
	}
}

const SECRET = process.env.JWT_SECRET

type User = {
	id: string,
	email: string,
	password: string,
	date_created: Date
}
export function generateToken(user: User) {
	return jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1h' });
}
