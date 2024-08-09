//import login from "../actions/auth/login.js";
import sendEmail from "../actions/auth/sendEmail.js"


export class SignupPage extends HTMLElement {
	constructor() {
		super()
		this.stateInit = {
			showCode: false,
			email: "",
			password: "",
			userAlreadyExists: false
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
			<div class="flex flex-col w-screen items-center px-4">
				<div id="header-bar" class="flex flex-row justify-end w-full gap-x-6">
					<a href="/login" class="navlink cursor-pointer w-fit">
						Login
					</a>
				</div>
				<div class="flex flex-row gap-x-10 w-fit justify-center max-w-[400px]">
					${this.state.showCode ? "" : `<div class="flex flex-col gap-y-4 items-start mb-10 w-full">
						<h1 class="text-4xl font-bold w-full">Sign-Up</h1>
						<form id="signup-form" class="flex flex-col gap-y-3">
							<input type="text" id="email" name="email" class="border border-black px-2"/>
							<input type="text" id="password" name="password" class="border border-black px-2"/>
							<button
								class="rounded-md bg-gray-300 font-light text-sm px-2 py-1 min-w-14 hover:brightness-95
									transition-all"
							>
								Sign-Up
							</button>
						</form>
						${this.state.userAlreadyExists ? `
							<p class="text-sm text-red-700">A user with this email already exists</p>
						` : ''}
					</div>`}
					${this.state.showCode ? `
						<auth-code 
							data-email=${this.state.email} 
							data-password=${this.state.password}>
						</auth-code> ` : ''
					}
					<div id="list-of-users" class=" flex flex-col"></div>
				</div>
			</div>
		`
		this.querySelectorAll('a.navlink').forEach(a => {
			a.addEventListener('click', e => {
				e.preventDefault()
				const url = a.href
				console.log("Url from listener: ", url)
				app.router.go(url)
			})
		})
		const signupForm = this.querySelector('#signup-form')
		
		signupForm?.addEventListener('submit', async (event) => {
			event.preventDefault();
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
				}
			} else {
				console.error("A user with this email already exists")
				this.state.userAlreadyExists = true
			}
		})
	}
}

customElements.define('signup-page', SignupPage)
