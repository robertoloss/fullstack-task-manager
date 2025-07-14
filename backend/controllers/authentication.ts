import express, { CookieOptions } from 'express'
import { userWithEmailExists } from '../db/users';
import { generateToken, hashPassword, verifyPassword } from '../helpers';
import { db } from '..';



export async function register(req: express.Request, res: express.Response) {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			console.error('Some credentials (either email or password) are missing')
			res.sendStatus(400)
		}
		console.log("Credentials: ok", email, password)
		const { userExists, user } = await userWithEmailExists(email);
		if (userExists === true) {
			console.log("user exists, ", userExists)
			console.log("the user: ", user)
			res.sendStatus(400)
		} else if ((userExists as boolean | 'error') === 'error') {
			console.log("userExists error: ", userExists)
			res.sendStatus(400)
		} else {
			const hash = await hashPassword(password)
			console.log("Hash: ", hash)
			const result = await db.query(`
				INSERT INTO qwiknotes.users
				(email, password)
				VALUES($1, $2)
				RETURNING id
			`, [email, hash])
			if (result.rowCount && result.rowCount > 0) {
					console.log("User created: ", result.rows[0])
					res.sendStatus(201)
			} else res.sendStatus(400)
		}
	} catch(error) {
		console.error(error)
	}
}
const cookieOptions: CookieOptions = {
	httpOnly: true,
	secure: true, 
	sameSite: 'none',
	path: '/',
}
export async function login(req: express.Request, res: express.Response) {
	try {
		const { email, password } = req.body;
		console.log("Email and password for login: ", email, password)
		if (!email) res.sendStatus(404)

		const result = await db.query(`
			SELECT * FROM qwiknotes.users
			WHERE email = $1
		`, [email])
		const user = result.rows[0]
		if (result.rowCount && result.rowCount > 0) {
			const storedHash = result.rows[0].password;
			console.log(storedHash)
			console.log("verifying password: ", await verifyPassword(password, storedHash))
			if (await verifyPassword(password, storedHash)) {
					const token = generateToken(user)
					res.cookie('token', token, {
						...cookieOptions,
						maxAge: 3600000,
					});
				console.log("Headers when creating cookie: ", res.getHeaders());
				res.sendStatus(200);
				console.log("verified!")
			} else res.sendStatus(403)
		} else res.sendStatus(400) 

	} catch(error) {
		console.error(error)
	}
}

export async function logOut(_req: express.Request, res: express.Response) {
	console.log("logOut controller")
	res.clearCookie('token', cookieOptions)
	console.log("Headers after clearing cookie: ", res.getHeaders());
	res.status(200).json({ message: "Logged out succesfully"})
}

export async function resetPassword(req: express.Request, res: express.Response) {
	const { email, password } = req.body
	console.log("email and password: ", email, password)
	const hash = await hashPassword(password)
	try {
		const data = await db.query(`
			UPDATE qwiknotes.users
			set password=$2
			where email=$1
		`, [email, hash])
		if (data.rowCount > 0) {
			res.sendStatus(200)
		} else {
			console.log(data.rowCount)
			console.log("data: ", data)
			res.sendStatus(500)
		}
	} catch(err) {
		console.error(err)
		res.sendStatus(500)
	}
}














