import Router from "./services/Router.js"
import { Card } from "./components/Card.js"

window.app = {}
app.router = Router


window?.addEventListener('DOMContentLoaded', () => {
	console.log("DOMContentLoaded!")
	app.router.init()
})

