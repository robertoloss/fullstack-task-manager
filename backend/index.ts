import express from 'express'
import http from 'http'
import https from 'https'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import pg from 'pg'
import router from './router'
import dotenv from 'dotenv'
import { verifyToken } from './middleware'
import { login, register, resetPassword } from './controllers/authentication'
import { verifyUser } from './controllers/verifyUser'
import { createAuthCode, verifyCode } from './controllers/auth-code'
import { checkUser } from './controllers/checkUser'

dotenv.config()
const dbUrl = process.env.DB_URL;
const baseUrl = process.env.BASE_URL;
const production = process.env.NODE_ENV === 'production'

const app = express()
app.use((req, res, next) => {
  // Set the Access-Control-Allow-Origin header to allow requests from http://localhost:5174
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5174');

  // You might also need to allow specific headers and methods
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  next();
});
app.use(cors({
    origin: baseUrl, 
		credentials: true
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({
	extended: true
}))
app.get('/test', (req, res)=> res.json({ message: "This route works!"}))
app.post('/auth/login', login)
app.post('/auth/register', register)
app.post('/auth/verify', verifyUser)
app.post('/auth/check', checkUser)
app.put('/auth/reset', resetPassword)
app.post('/auth-code/create', createAuthCode)
app.post('/auth-code/verify', verifyCode)

app.use('/', router())
app.use(verifyToken)

const { Pool } = pg
export const db = new Pool({
	connectionString: dbUrl,
	max: 20,                 
  idleTimeoutMillis: 30000, 
  connectionTimeoutMillis: 2000,
});


if (!production) {
	http.createServer(app).listen(8090, () => {
		console.log('HTTPS Server running on port 8090');
	});
	http.createServer((req, res) => {
		res.writeHead(301, { 'Location': `http://${req.headers.host}${req.url}` });
		res.end();
	}).listen(80, () => {
		console.log('HTTP server listening on port 80 and redirecting to HTTPS');
	});
} else {
	app.listen(process.env.PORT || 3000, () => {
		console.log(`Server running in production mode on port ${process.env.PORT || 3000}`);
	});

}






