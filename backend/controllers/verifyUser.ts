import express from 'express'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken';
import { SECRET } from '../middleware';

type Token = {
	id: string,
	email: string,
	iat: number,
	exp: number
}

dotenv.config() 
const baseURL = process.env.BASE_URL

export async function verifyUser(req: express.Request, res: express.Response) {
	console.log("VerifyUser Req headers: ", req.headers)
	console.log("verify user")
	const token = req.cookies.token;
	console.log("req.cookies (verifyUser): ", req.cookies)
	if (!token) {
		console.log("no token (verify user)")
		return res.status(401).json({ redirect: `${baseURL}/login` })
	}
	try {
		console.log("verifyToken: try")
		 const decoded : Token = jwt.verify(token, SECRET) as Token;
		 if (decoded) {
			 console.log("JWT OK (verifyUser): ", decoded.email);
			 (req as any).user = decoded.email;
			 res.status(200).json({ status: '200' })
		 } else {
			 console.log("redirect")
			 res.status(401).set('Location', `${baseURL}/login`).end();
		 }
	 } catch (error) {
		 res.status(401).json({ error: 'Invalid token' });
	 }
}
