import Router from "./services/Router.js"
import { Card } from "./components/Card.js"
import { Spinner } from "./components/Spinner.js"
import AuthCode from "./components/AuthCode.js"
import { Input } from "./components/Input.js"
import { AuthCard } from "./components/AuthCard.js"

window.app = {}
app.router = Router

window?.addEventListener('DOMContentLoaded', () => {
	app.router.init()
})



