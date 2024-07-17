import express from 'express'
import http from 'http'
import cookieParser from 'cookie-parser'
//import compression from 'compression'
//import cors from 'cors'
import pg from 'pg'
import router from './router'
import path from 'path'
import dotenv from 'dotenv'

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
app.use(express.static("public"))
app.use('/',router())

app.get('*', (_req, res) => {
	res.sendFile(path.join(process.cwd(), 'public', 'index.html'))
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







