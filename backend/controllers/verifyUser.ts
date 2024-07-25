import express from 'express'
import jwt from 'jsonwebtoken';
import { SECRET } from '../middleware';

type Token = {
	id: string,
	email: string,
	iat: number,
	exp: number
}
export async function verifyUser(req: express.Request, res: express.Response) {
	console.log("verify user")
	const token = req.cookies.token;
	console.log("req.cookies (verifyUser): ", req.cookies)
	if (!token) {
		console.log("no token (verify user)")
		return res.status(302).redirect('/login')
	}
	try {
		console.log("verifyToken: try")
		 const decoded : Token = jwt.verify(token, SECRET) as Token;
		 if (decoded) {
			 console.log("JWT OK: ", decoded.email);
			 (req as any).user = decoded.email;
			 res.sendStatus(200)
		 } else {
			 console.log("redirect")
			 res.redirect('/login')
		 }
	 } catch (error) {
		 res.status(401).json({ error: 'Invalid token' });
	 }
}
