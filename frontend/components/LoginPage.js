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
			<div class="flex flex-col w-screen h-screen items-center justify-between p-6">
				<div id="header-bar" class="flex flex-row justify-end w-full gap-x-6">
					<a href="/signup" class="navlink cursor-pointer w-fit">
						Signup
					</a>
				</div>
				<div 
					class="flex shadow-gray-400 shadow-md p-6  rounded-lg flex-col gap-y-4
					items-start mb-10 max-w-[400px] w-full justify-center bg-slate-50"
				>
					<h1 class="text-base font-medium mb-8 w-fit self-center">
						Please enter your email and password
					</h1>
					<form id="login-form" method="post" action="/auth/login" 
						class="flex flex-col gap-y-2 w-full"
					>
						<input-component data-type="email"></input-component>
						<input-component data-type="password"></input-component>
						<button 
							type="submit"
							class="flex flex-col justify-center items-center rounded-md bg-gray-300 font-light h-10 mt-8 text-base px-2 py-1 min-w-14 hover:brightness-95
								transition-all"
						>
							${this.state.loggingIn 
								? `<div class="h-6">
										<spinner-component></spinner-component>
									</div>` 
								: 'Login'}
						</button>
					</form>
				</div>
				<div class="h-full max-h-20 w-full"></div>
			</div>
		`
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

