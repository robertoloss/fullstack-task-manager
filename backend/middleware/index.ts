import express from 'express';
import jwt from 'jsonwebtoken';

export const SECRET = 'temp-secret-to-be-replaced'

type Token = {
	id: string,
	email: string,
	iat: number,
	exp: number
}

export function verifyToken(req: express.Request , res: express.Response, next: express.NextFunction) {
	console.log("Verifying token...")
	const token = req.cookies.token;
	if (!token) {
		console.log("no token (verify token)")
		res.redirect('https://localhost:5174/login')
		return
	}
	try {
		console.log("VerifyToken: try")
		 const decoded : Token = jwt.verify(token, SECRET) as Token;
		 if (decoded) {
			 console.log("JWT OK (verifyToken): ", decoded.id);
			 (req as any).user = decoded.id;
			 next();
		 } else {
			 res.redirect('https://localhost:5174/login')
			 console.log("redirect")
		 }
	 } catch (error) {
		 res.status(401).json({ error: 'Invalid token' });
	 }
};
