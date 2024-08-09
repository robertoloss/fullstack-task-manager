//import useTailwind from "../utils/useTailwind.js"

import login from "../actions/auth/login.js"

export class LoginPage extends HTMLElement {
	constructor() {
		super()
		this.stateInit = {
			loggingIn: false,
		}
		this.state = new Proxy (this.stateInit, {
			set: (target, property, value) => {
				target[property] = value
				if (property === 'loggingIn') this.render()
				return true
			}
		}) 
	}
	connectedCallback() {
		this.render()
	}
	render() {
		this.innerHTML = `		
			<auth-card
				data-goToLabel="Signup"
				data-goToLink="/signup"
				data-cardTitle="Please enter your email and password"
				data-formId="login-form"
				data-formAction="/auth/login"
				data-buttonLabel="Login"
				data-buttonIsPending="${this.state.loggingIn}"
			>
				<div id='auth-card-children' class="flex flex-col gap-y-2">
					<input-component data-type="email"></input-component>
					<input-component data-type="password"data-login="true" ></input-component>
				</div>
			</auth-card>
		`
		const loginForm = this.querySelector('#login-form')

		loginForm.addEventListener('submit', async (event) => {
			event.preventDefault()
			const { email, password } = Object.fromEntries(new FormData(loginForm))
			this.state.email = email
			this.state.password = password
			this.state.loggingIn = true
		})

		if (this.state.loggingIn === true) {
			login(this.state.email, this.state.password)
		}
	}
}

customElements.define('login-page', LoginPage)
