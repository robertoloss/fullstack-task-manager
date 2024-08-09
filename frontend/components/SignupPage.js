import sendEmail from "../actions/auth/sendEmail.js"

export class SignupPage extends HTMLElement {
	constructor() {
		super()
		this.stateInit = {
			showCode: false,
			email: "",
			password: "",
			userAlreadyExists: false,
			signingUp: false
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
			<auth-card
				data-goToLabel="Login"
				data-goToLink="/login"
				data-cardTitle="Sign up here"
				data-formId="signup-form"
				data-formAction="/auth/signup"
				data-buttonLabel="Sign Up"
				data-buttonIsPending="${this.state.signingUp}"
				data-hidemainbutton="${this.state.showCode}"
			>
				<div id='auth-card-children' class="flex flex-col gap-y-2">
					${!this.state.showCode? `
							<input-component data-type="email"></input-component>
							<input-component data-type="password"></input-component>
						` : ''
					}
					${this.state.userAlreadyExists ? `
							<p class="text-sm text-red-700">A user with this email already exists</p>
						` : ''
					}
					${this.state.showCode ? `
							<auth-code 
								data-email=${this.state.email} 
								data-password=${this.state.password}>
							</auth-code> 
						` : ''
					}
				</div>
			</auth-card>
		`
		const signupForm = this.querySelector('#signup-form')
		
		signupForm?.addEventListener('submit', async (event) => {
			event.preventDefault();
			this.state.signingUp = true
			const { email, password } = Object.fromEntries(new FormData(signupForm))
			const dataCheckUser = await fetch('/auth/check', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json'},
				body: JSON.stringify({ email: email })
			})
			const resCheckUser = await dataCheckUser.json()
			const userAlreadyExists = resCheckUser.userExists
			if (!userAlreadyExists) {
				if (email && password) {
					const resSendEmail = await sendEmail(email)
					if (!resSendEmail.ok) {
						console.error("ERROR while sending email")
						return
					}
					this.state.showCode = true
					this.state.email = email
					this.state.password = password
					this.state.signingUp = false
				}
			} else {
				console.error("A user with this email already exists")
				this.state.userAlreadyExists = true
				this.state.signingUp = false
			}
		})
	}
}

customElements.define('signup-page', SignupPage)
