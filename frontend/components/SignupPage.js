//import login from "../actions/auth/login.js";


export class SignupPage extends HTMLElement {
	constructor() {
		super()
		this.preState = {
			showCode: false,
			email: "",
			password: ""
		}
		this.state = new Proxy(this.preState,{
			set: (target, property, value) => {
				target[property] = value
				this.render()
				return true
			}
		})
	}
	connectedCallback() {
		this.render()
	}
	async sendEmail(email) {
		console.warn("Sending email!")
		const response = await fetch('/auth-code/create', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				email
			})
		})
		console.log(response)
		return response
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
					</div>`}
					${this.state.showCode ? 
						`
							<auth-code 
								data-email=${this.state.email} 
								data-password=${this.state.password}>
							</auth-code>
						` : ''
						}
					<div id="list-of-users" class=" flex flex-col"></div>
				</div>
			</div>
		`
		console.log("render")
		console.log(this.state)
		const signupForm = this.querySelector('#signup-form')
		console.log("signup form ", signupForm)
		
		signupForm?.addEventListener('submit', async (event) => {
			event.preventDefault();
			console.log("Submitted")
			const { email, password } = Object.fromEntries(new FormData(signupForm))
			console.log("")
			if (email && password) {
				const resSendEmail = await this.sendEmail(email)
				if (!resSendEmail.ok) {
					console.error("ERROR while sending email")
					return
				}
				this.state.showCode = true
				this.state.email = email
				this.state.password = password
			}
			
			//const response = await fetch('http://localhost:8090/auth/register', {
			//	method: 'POST',
			//	headers: { 'Content-Type': 'application/json' },
			//})
			//if (response.ok) {
			//	login(email, password)
			//} else {
			//	console.error("There was an error while creating the user")
			//}
		})
	}
}

customElements.define('signup-page', SignupPage)
