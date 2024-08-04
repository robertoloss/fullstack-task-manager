import Router from "./services/Router.js"
import { Card } from "./components/Card.js"
import { Spinner } from "./components/Spinner.js"
import AuthCode from "./components/AuthCode.js"

window.app = {}
app.router = Router


window?.addEventListener('DOMContentLoaded', () => {
	console.log("DOMContentLoaded!")
	app.router.init()
})



