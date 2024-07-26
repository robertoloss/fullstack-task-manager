//import useTailwind from "../utils/useTailwind.js"

import login from "../actions/auth/login.js"

export class LoginPage extends HTMLElement {
	constructor() {
		super()
	}
	connectedCallback() {
		const template = document.getElementById('login-page')
		const content = template.content.cloneNode(true)
		this.appendChild(content)
		this.render()
	}
	render() {
		const loginForm = this.querySelector('#login-form')

		this.querySelectorAll('a.navlink').forEach(a => {
			a.addEventListener('click', e => {
				e.preventDefault()
				const url = a.href
				console.log("Url from listener: ", url)
				app.router.go(url)
			})
		})
		loginForm.addEventListener('submit', async (event) => {
			event.preventDefault()
			const { email, password } = Object.fromEntries(new FormData(loginForm))
			login(email, password)
		})
	}
}

customElements.define('login-page', LoginPage)
