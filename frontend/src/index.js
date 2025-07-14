import Router from "./services/Router.js"
import { Card } from "./components/Card.js"
import { Spinner } from "./components/Spinner.js"
import { Input } from "./components/Input.js"
import { AuthCard } from "./components/AuthCard.js"
import Store from "./services/Store.js" 
import checkInactivity from "./utils/checkInactivity.js"

checkInactivity(10)
console.log("hello")

window.app = {}
app.router = Router
app.store = Store

let ignore = false;

app.setIgnore = (bool)=>{
	if (bool) ignore = bool
}

document.addEventListener('DOMContentLoaded', () => {
	app.router.init()
})



