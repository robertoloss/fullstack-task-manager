import express from 'express'
import http from 'http'
import cookieParser from 'cookie-parser'
//import compression from 'compression'
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

dotenv.config()
const dbUrl = process.env.DB_URL;
const port = 8090
const app = express()
app.use(cors({
    origin: 'http://localhost:5174', 
		credentials: true
}))
//app.use(cors({
//	credentials: true
//}))
//app.use(compression())
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

const server = http.createServer(app)
server.listen(port, () => {
	console.log("Server running on http://localhost:8090/")
})







