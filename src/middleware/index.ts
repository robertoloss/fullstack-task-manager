import express from 'express';
import jwt from 'jsonwebtoken';

const SECRET = 'temp-secret-to-be-replaced'
// { id: user.id, email: user.email }

type Token = {
	id: string,
	email: string,
	iat: number,
	exp: number
}

export function verifyToken(req: express.Request , res: express.Response, next: express.NextFunction) {
	console.log("middleware!")
	const token = req.cookies.token;
	console.log("req.cookies: ", req.cookies)
	if (!token) return res.status(401).json({ error: 'Access denied' });
	try {
		 console.log("verify")
		 const decoded : Token = jwt.verify(token, SECRET) as Token;
		 if (decoded) console.log("JWT OK: ", decoded.email);
		 (req as any).user = decoded.email;
		 next();
	 } catch (error) {
		 res.status(401).json({ error: 'Invalid token' });
	 }
};
