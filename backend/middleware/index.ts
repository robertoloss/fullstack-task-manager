import express from 'express';
import jwt from 'jsonwebtoken';

export const SECRET = 'temp-secret-to-be-replaced'
// { id: user.id, email: user.email }

type Token = {
	id: string,
	email: string,
	iat: number,
	exp: number
}

export function verifyToken(req: express.Request , res: express.Response, next: express.NextFunction) {
	//console.log("verify token!")
	const token = req.cookies.token;
	console.log("req.cookies: ", req.cookies)
	if (!token) {
		console.log("no token (verify token)")
		res.redirect('/login')
		return
		//res.status(401).json({ error: 'Access denied' });
	}
	try {
		console.log("verifyToken: try")
		 const decoded : Token = jwt.verify(token, SECRET) as Token;
		 if (decoded) {
			 console.log("JWT OK: ", decoded.id);
			 (req as any).user = decoded.id;
			 next();
		 } else {
			 res.redirect('/login')
			 console.log("redirect")
		 }
	 } catch (error) {
		 res.status(401).json({ error: 'Invalid token' });
	 }
};
