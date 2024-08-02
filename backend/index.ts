import express from 'express'
import http from 'http'
import cookieParser from 'cookie-parser'
//import compression from 'compression'
//import cors from 'cors'
import pg from 'pg'
import router from './router'
import path from 'path'
import dotenv from 'dotenv'
import { verifyToken } from './middleware'
import { login, register } from './controllers/authentication'
import { verifyUser } from './controllers/verifyUser'
import createAuthCode from './controllers/auth-code'

dotenv.config()
const dbUrl = process.env.DB_URL;
const port = 8090
const app = express()
//app.use(cors({
//	credentials: true
//}))
//app.use(compression())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({
	extended: true
}))

app.use('/signup', (_req, res) => {
	res.send('signup')
})
app.use('/login', (_req, res)=> {
	res.sendFile(path.join(process.cwd(), 'frontend', 'index.html'))
}) 
app.post('/auth/login', login)
app.post('/auth/register', register)
app.post('/auth/verify', verifyUser)
app.post('/auth-code/create', createAuthCode)

app.use('/', router())
app.use(express.static("frontend"))

app.use(verifyToken)
app.get('*', (_req, res) => {
	res.sendFile(path.join(process.cwd(), 'frontend', 'index.html'))
});


const { Pool } = pg
export const db = new Pool({
	connectionString: dbUrl 
});
db.connect()

const server = http.createServer(app)
server.listen(port, () => {
	console.log("Server running on http://localhost:8090/")
})







