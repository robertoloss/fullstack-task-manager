//import useTailwind from "../utils/useTailwind.js"
import login from "../actions/auth/login.js"

export class LoginPage extends HTMLElement {
	constructor() {
		super()
		this.error = false
	}
	connectedCallback() {
		document.body.classList.remove('bg-zinc-200')
		document.body.classList.add('bg-slate-300')
		this.render()
	}
	displayErrorMessage(message) {
		this.error = true
		const errorDiv = document.querySelector('#error-message')
		errorDiv.innerHTML = null
		const errorP = document.createElement('p')
		errorP.className = 'text-sm text-red-700'
		errorP.innerText = message 
		errorDiv.appendChild(errorP)
	}
	showSpinnerInButton(buttonId) {
		const button = document.querySelector(`#${buttonId}`)
		button.innerHTML = `
			<div class="h-6">
				<spinner-component></spinner-component>
			</div> 
		`
	}
	hideSpinnerInButton(buttonId) {
		const button = document.querySelector(`#${buttonId}`)
		const options = {
			'login-button': 'Login',
		}
		button.innerHTML = ''
		button.innerText = options[buttonId]
	}
	render() {
		this.innerHTML = `		
			<auth-card
				data-goToLabel="Signup"
				data-goToLink="/signup"
				data-cardTitle="Login here"
				data-buttonLabel="Login"
			>
				<div id='auth-card-children' class="flex flex-col gap-y-2">
					<form id="login-form" method="post" action="/auth/login" 
						class="flex flex-col gap-y-2 w-full"
					>
						<div id='auth-card-children' class="flex flex-col gap-y-2">
							<input-component data-type="email"></input-component>
							<input-component data-type="password" data-login="true" ></input-component>
							<div id="error-message" class="min-h-[20px]"></div>
							<button id="login-button" type="submit"
								class="flex flex-col justify-center items-center rounded-md bg-gray-300 font-light 
									h-10 mt-8 text-base px-2 py-1 min-w-14 hover:brightness-95 transition-all"
							>
								Login
							</button>
						</div>
					</form>
				</div>
			</auth-card>
		`
		const loginForm = this.querySelector('#login-form')

		loginForm?.addEventListener('submit', async (event) => {
			event.preventDefault()
			this.showSpinnerInButton('login-button')
			const { email, password } = Object.fromEntries(new FormData(loginForm))
			if (!email || !password) {
				this.hideSpinnerInButton('login-button')
				if (!email && password) this.displayErrorMessage("Please enter an email address")
				else if (!password && email) this.displayErrorMessage('Please enter your password')
				else this.displayErrorMessage('Please enter your email and password')
				return
			}
			const error = await login(email, password)
			if (error) {
				this.hideSpinnerInButton('login-button')
				this.displayErrorMessage(`Wrong email or password`)
				console.error(error)
			}
		})
	}
}

customElements.define('login-page', LoginPage)
