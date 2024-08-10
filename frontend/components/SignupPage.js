import sendEmail from "../actions/auth/sendEmail.js"
import login from "../actions/auth/login.js"

export class SignupPage extends HTMLElement {
	constructor() {
		super()
		this.stateInit = {
			showCode: false,
			email: "",
			password: "",
			error: false,
			errorMessage: "",
			signingUp: false,
			verify: false
		}
		this.state = new Proxy(this.stateInit,{
			set: (target, property, value) => {
				target[property] = value
				this.render()
				if (property === "userAlreadyExists" && value === true) {
					setTimeout(() => {
						this.state.userAlreadyExists = false
						this.render()
					}, 2000)
				}
				return true
			}
		})
	}
	connectedCallback() {
		this.render()
	}
	render() {
		this.innerHTML = `
			${!this.state.showCode ? `
				<auth-card
					data-goToLabel="Login"
					data-goToLink="/login"
					data-cardTitle="Sign up here"
					data-formId="signup-form"
					data-formAction="/auth/signup"
					data-buttonLabel="Sign Up"
					data-buttonIsPending="${this.state.signingUp}"
				>
					<div id='auth-card-children' class="flex flex-col gap-y-2">
						<input-component data-type="email"></input-component>
						<input-component data-type="password"></input-component>
						<div class="min-h-[20px]">
							${this.state.error ? `
									<p class="text-sm text-red-700">
										this.state.errorMessage
									</p>
								` : ''
							}
						</div>
					</div>
				</auth-card>
			` : `
				<auth-card
					data-goToLabel="Login"
					data-goToLink="/login"
					data-cardTitle="Please, enter the verification code"
					data-formId="verify-form"
					data-formAction="/auth-code/verify"
					data-buttonLabel="Verify Code"
					data-buttonIsPending="${this.state.verify}"
				>
					<div id='auth-card-children' class="flex flex-col gap-y-2">
						<input-component data-type="code"></input-component>
					</div>
				</auth-card>
			`} 
		`
		const signupForm = this.querySelector('#signup-form')
		
		signupForm?.addEventListener('submit', async (event) => {
			event.preventDefault();
			this.state.signingUp = true
			const { email, password } = Object.fromEntries(new FormData(signupForm))
			if (!email || !password) {
				this.state.error = true
				this.state.errorMessage = "Please provide both an email and a password"
				this.state.signingUp = false
				return
			}
			const dataCheckUser = await fetch('/auth/check', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json'},
				body: JSON.stringify({ email: email })
			})
			const resCheckUser = await dataCheckUser.json()
			const userAlreadyExists = resCheckUser.userExists
			if (!userAlreadyExists) {
				this.state.error = true
				this.state.errorMessage = "A user with this email already exists"
				this.state.signingUp = false
				return
			}
			const resSendEmail = await sendEmail(email)
			if (!resSendEmail.ok) {
				console.error("ERROR while sending email")
				return
			}
			this.state.email = email
			this.state.password = password
			this.state.signingUp = false
			this.state.showCode = true
		})

		const verifyForm = document.querySelector('#verify-form')
		verifyForm?.addEventListener('submit', async (e)=> {
			e.preventDefault()
			this.state.verify = true
			const { code } = Object.fromEntries(new FormData(verifyForm))
			const resVerifyCode = await fetch('/auth-code/verify', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json'},
				body: JSON.stringify({
					email: this.state.email,
					code
				})
			})
			if (resVerifyCode.ok) {
				const response = await fetch('/auth/register', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						email: this.state.email,
						password: this.state.password
					})
				})
				if (response.ok) {
					login(this.state.email, this.state.password)
				} else {
					console.error("There was an error while creating the user")
				}
			} else {
				console.error("There was an error while signing you up")
			}
		})
	}
}

customElements.define('signup-page', SignupPage)
