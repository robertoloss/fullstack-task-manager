import express from 'express'
import http from 'http'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import pg from 'pg'
import router from './router'
import path from 'path'
import dotenv from 'dotenv'
import { verifyToken } from './middleware'
import { login, register, resetPassword } from './controllers/authentication'
import { verifyUser } from './controllers/verifyUser'
import { createAuthCode, verifyCode } from './controllers/auth-code'
import { checkUser } from './controllers/checkUser'
import fs from 'fs'
import https from 'https'


dotenv.config()

const dbUrl = process.env.DB_URL;
const baseUrl = process.env.BASE_URL;
const production = process.env.NODE_ENV === 'production'

console.log("base url: ", baseUrl)
const app = express()
app.use(cors({
    origin: baseUrl, 
		credentials: true
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({
	extended: true
}))
app.use(express.static(path.join(process.cwd(), 'frontend', 'dist')));
app.use('/signup', (_req, res) => {
	res.sendFile(path.join(process.cwd(), 'frontend', 'dist', 'index.html'))
})
app.use('/login', (_req, res)=> {
	res.sendFile(path.join(process.cwd(), 'frontend', 'dist', 'index.html'))
}) 
app.post('/auth/login', login)
app.post('/auth/register', register)
app.post('/auth/verify', verifyUser)
app.post('/auth/check', checkUser)
app.put('/auth/reset', resetPassword)
app.post('/auth-code/create', createAuthCode)
app.post('/auth-code/verify', verifyCode)

app.use('/', router())
app.use(express.static(path.join(process.cwd(), 'frontend', 'dist')));

app.use(verifyToken)
app.get('*', (_req, res) => {
	res.sendFile(path.join(process.cwd(), 'frontend', 'dist', 'index.html'))
});


const { Pool } = pg
export const db = new Pool({
	connectionString: dbUrl,
	max: 20,                 
  idleTimeoutMillis: 30000, 
  connectionTimeoutMillis: 2000,
});

if (!production) {
	const sslOptions = {
		key: fs.readFileSync(path.join(__dirname, 'server.key')),
		cert: fs.readFileSync(path.join(__dirname, 'server.cert')),
	};
	https.createServer(sslOptions, app).listen(8090, () => {
		console.log('HTTPS Server running on port 8090');
	});


	http.createServer((req, res) => {
		res.writeHead(301, { 'Location': `https://${req.headers.host}${req.url}` });
		res.end();
	}).listen(80, () => {
		console.log('HTTP server listening on port 80 and redirecting to HTTPS');
	});
} else {
	app.listen(process.env.PORT || 3000, () => {
		console.log(`Server running in production mode on port ${process.env.PORT || 3000}`);
	});
}






