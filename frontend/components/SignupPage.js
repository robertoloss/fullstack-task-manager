import login from "../actions/auth/login.js";


export class SignupPage extends HTMLElement {
	constructor() {
		super()
	}
	connectedCallback() {
		const template = document.getElementById('signup-page')
		const content = template.content.cloneNode(true)
		this.appendChild(content)
		this.render()
	}
	render() {
		const signupForm = this.querySelector('#signup-form')
		
		signupForm?.addEventListener('submit', async (event) => {
			event.preventDefault();
			const { email, password } = Object.fromEntries(new FormData(signupForm))
			
			const response = await fetch('http://localhost:8090/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: email, password: password })
			})
			if (response.ok) {
				login(email, password)
			} else {
				console.error("There was an error while creating the user")
			}
		})

	}
}

customElements.define('signup-page', SignupPage)
