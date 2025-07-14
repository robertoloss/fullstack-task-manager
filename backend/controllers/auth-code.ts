import express from 'express'
import emailjs from '@emailjs/nodejs'
import { db } from '../index';

export async function createAuthCode(req: express.Request, res: express.Response) {
	const  { email }  = req.body 
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let code = '';
	for (let i = 0; i < 6; i++) {
		code += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	console.log("Auth code created: ", code)

	const storedCodeRes = await db.query(`
		INSERT INTO	qwiknotes.auth_codes (email, code, is_valid)
		VALUES ($1, $2, true)
		RETURNING code
	`, [email, code])
	if (storedCodeRes.rowCount = 0) {
		return res.status(500).json({ error: "Couldn't store generated key"})
	}
	const storedCode = storedCodeRes.rows[0]?.code
	if (!storedCode) {
		return res.status(500).json({ error: "Couldn't store generated key"})
	}

	const templateParams = {
		to_email: email,
		code: storedCode 
	};
	
	try {
		emailjs.init({
			publicKey: process.env.EMAIL_PUBLIC_KEY,
			validationRequired: false
		})
		const emailjsResponse = await emailjs.send(
			process.env.EMAIL_SERVICE_ID as string, 
			process.env.EMAIL_TEMPLATE_ID as string, 
			templateParams,
			{
				publicKey: process.env.EMAIL_PUBLIC_KEY as string,  
				privateKey: process.env.EMAIL_PRIVATE_KEY as string 
			},
		);
		console.log('SUCCESS!');
		res.status(200).json({ message: "Email sent correctly"})
	} catch(err) {
		console.error(err)
		res.sendStatus(500)
	}
}

export async function verifyCode(req: express.Request, res: express.Response) {
	const { email, code } = req.body
	console.log("verifyCode - email, body: ", email, code)
	try {
		const data = await db.query(`
				SELECT 1 from qwiknotes.auth_codes
				where email=$1 and code=$2 and is_valid=true 
		`, [email, code])
    console.log("verifyCode data", data)

		const codeOk = data.rowCount > 0

		if (codeOk) {
      res.status(200).json({ message: 'Code is valid.' });
			const invalidation = await db.query(`
				UPDATE qwiknotes.auth_codes
				SET is_valid=false
				where email=$1 and code=$2 and is_valid=true
			`, [email, code])
			if (invalidation.rowCount > 0) {
				console.log("Code successfully invalidated")
			} else {
				console.log("ERROR: code was not invalidated")
			}
    } else {
      res.status(404).json({ error: 'Code not found or invalid.' });
    }

	} catch(err) {
		console.error(err)
		res.sendStatus(500)
	}
}
