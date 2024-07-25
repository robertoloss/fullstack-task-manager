//import useTailwind from "../utils/useTailwind.js"

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
		loginForm.addEventListener('submit', async (event) => {
			event.preventDefault()
			try {
				const { email, password } = Object.fromEntries(new FormData(loginForm))
				const response = await fetch('http://localhost:8090/auth/login', {
					method: 'POST',
					credentials: 'include',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email: email, password: password})
				})
				if (response.ok) {
					app.router.go('/')
					console.log(`User successfully logged in`)
				}
			} catch (error) {
				console.error("There was an error while trying to login the user: ", error)
			}
		})
	}
}

customElements.define('login-page', LoginPage)
