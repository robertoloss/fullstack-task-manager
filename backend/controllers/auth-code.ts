import express from 'express'
import emailjs from '@emailjs/nodejs'
import { db } from '../index';

export default async function createAuthCode(req: express.Request, res: express.Response) {
	const  { email }  = req.body 

	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let code = '';
	for (let i = 0; i < 6; i++) {
		code += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	console.log("Auth code created: ", code)

	const storedCodeRes = await db.query(`
		INSERT INTO	auth_codes (email, code)
		VALUES ($1, $2)
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
		await emailjs.send(
			process.env.EMAIL_SERVICE_ID as string, 
			process.env.EMAIL_TEMPLATE_ID as string, 
			templateParams,
			{
				publicKey: process.env.EMAIL_PUBLIC_KEY as string,  
				privateKey: process.env.EMAIL_PRIVATE_KEY as string 
			},
		);

		console.log('SUCCESS!');
	} catch(err) {
		console.error(err)
		res.sendStatus(500)
	}
}
