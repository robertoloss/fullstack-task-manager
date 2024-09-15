import sendEmail from "../actions/auth/sendEmail.js"
import login from "../actions/auth/login.js"
import { z } from "zod"

export class SignupPage extends HTMLElement {
	constructor() {
		super()
		this.stateInit = {
			showCode: false,
			email: "",
			password: "",
			verify: false,
			error: false
		}
		this.test = z.string().min(2)
		this.state = new Proxy(this.stateInit,{
			set: (target, property, value) => {
				target[property] = value
				if (property === 'showCode') {
					this.render()
				}
				return true
			}
		})
	}
	connectedCallback() {
		this.render()
	}
	displayErrorMessage(message) {
		this.state.error = true
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
			'sign-up-button': 'Sign Up',
			'verify-button': 'Verify'
		}
		button.innerHTML = ''
		button.innerText = options[buttonId]
	}
	render() {
		this.innerHTML = `
				<auth-card
					data-goToLabel="Login"
					data-goToLink="/login"
					data-cardTitle="${this.state.showCode ? `Enter the verification code we've sent you` : 'Sign up here'}"
					data-buttonLabel="Sign Up"
				>
					<div id='auth-card-children' class="flex flex-col gap-y-2">
						${!this.state.showCode ? `
							<form id="signup-form" method="post" action="/auth/signup" 
								class="flex flex-col gap-y-2 w-full"
							>
								<div id='auth-card-children' class="flex flex-col gap-y-2 w-full">
									<input-component data-type="email"></input-component>
									<input-component data-type="password"></input-component>
									<div id="error-message" class="min-h-[20px]"></div>
									<button id="sign-up-button" type="submit"
										class="flex flex-col justify-center items-center rounded-md bg-gray-300 font-light 
											h-10 mt-8 text-base px-2 py-1 min-w-14 hover:brightness-95 transition-all"
									>
										Sign Up
									</button>
								</div>
							</form>
						` : `
							<form id="verify-form" method="post" action="/auth-code/verify" 
								class="flex flex-col gap-y-2 w-full"
							>
								<div id='auth-card-children' class="flex flex-col gap-y-2">
									<input-component data-type="code"></input-component>
									<div id="error-message" class="min-h-[20px]"></div>
									<button id="verify-button" type="submit"
										class="flex flex-col justify-center items-center rounded-md bg-gray-300 font-light 
											h-10 mt-8 text-base px-2 py-1 min-w-14 hover:brightness-95 transition-all"
									>
										Verify
									</button>
								</div>
							</form>
						`} 
					</div>
				</auth-card>
		`
		setTimeout(() => {

		const signupForm = this.querySelector('#signup-form')
		
		signupForm?.addEventListener('submit', async (event) => {
			event.preventDefault();
			this.showSpinnerInButton('sign-up-button')
			const { email, password } = Object.fromEntries(new FormData(signupForm))
			if (!email || !password) {
				this.hideSpinnerInButton('sign-up-button')
				if (!email && password) this.displayErrorMessage('Please enter an email address')
				else if (!password && email) this.displayErrorMessage('Please enter a password')
				else this.displayErrorMessage("Please provide both an email and a password")
				return
			}
			const dataCheckUser = await fetch('https://localhost:8090/auth/check', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json'},
				body: JSON.stringify({ email: email })
			})
			const resCheckUser = await dataCheckUser.json()
			const userAlreadyExists = resCheckUser.userExists
			console.log("userAlreadyExists: ", userAlreadyExists)
			if (userAlreadyExists) {
				this.displayErrorMessage("A user with this email already exists")
				this.hideSpinnerInButton('sign-up-button')
				return
			}
			this.state.signingUp = true
			const resSendEmail = await sendEmail(email)
			if (!resSendEmail.ok) {
				this.displayErrorMessage("We encountered an error while trying to send your email. Pleas try again later.")
				console.error("ERROR while sending email", await resSendEmail.json())
				this.hideSpinnerInButton('sign-up-button')
				return
			}
			this.state.email = email
			this.state.password = password
			this.state.showCode = true
		})

		const verifyForm = document.querySelector('#verify-form')
		verifyForm?.addEventListener('submit', async (e)=> {
			if (this.state.error) return
			e.preventDefault()
			this.showSpinnerInButton('verify-button')
			const { code } = Object.fromEntries(new FormData(verifyForm))
			const resVerifyCode = await fetch('https://localhost:8090/auth-code/verify', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: this.state.email,
					code
				})
			})
			if (!resVerifyCode.ok) {
				this.hideSpinnerInButton('verify-button')
				this.displayErrorMessage("Code is not correct")
				console.error("Code is not correct")
				return
			}
			const response = await fetch('https://localhost:8090/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: this.state.email,
					password: this.state.password
				})
			})
			if (!response.ok) {
				this.hideSpinnerInButton('verify-button')
				this.displayErrorMessage('There was an error while creating the user')
				console.error("There was an error while creating the user")
				return
			}
			login(this.state.email, this.state.password)
		})
		}, 0)
	}
}

customElements.define('signup-page', SignupPage)
