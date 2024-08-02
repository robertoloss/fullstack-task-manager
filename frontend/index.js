import Router from "./services/Router.js"
import { Card } from "./components/Card.js"
import { Spinner } from "./components/Spinner.js"

window.app = {}
app.router = Router


window?.addEventListener('DOMContentLoaded', () => {
	console.log("DOMContentLoaded!")
	app.router.init()
})

async function sendEmail() {
	console.warn("Sending email!")
	const response = await fetch('/auth-code/create', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			email: 'robertoloss@gmail.com'
		})
	})
	console.log(response)
}

sendEmail()

