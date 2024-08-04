//import useTailwind from "../utils/useTailwind.js"

import login from "../actions/auth/login.js"

export class LoginPage extends HTMLElement {
	constructor() {
		super()
	}
	connectedCallback() {
		this.render()
	}
	render() {
		this.innerHTML = `		
			<div class="flex flex-col w-screen items-center px-4">
				<div id="header-bar" class="flex flex-row justify-end w-full gap-x-6">
					<a href="/signup" class="navlink cursor-pointer w-fit">
						Signup
				</a>
				</div>
				<div class="flex flex-col gap-y-4 items-start mb-10 max-w-[400px] w-fit">
					<h1 class="text-4xl font-bold w-full">
						Login
				</h1>
					<form id="login-form" method="post" action="/auth/login" class="flex flex-col gap-y-2">
						<input type="text" id="email" name="email" class="border border-black px-2"/>
						<input type="text" id="password" name="password" class="border border-black px-2"/>
						<button 
							type="submit"
							class="rounded-md bg-gray-300 font-light text-sm px-2 py-1 min-w-14 hover:brightness-95
								transition-all"
						>
								Login
						</button>
					</form>
					<div class="flex flex-row w-full justify-end">
						<a href="/reset-password" class="navlink text-xs">Forget password?</a>
					</div>
				</div>
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
			login(email, password)
		})
	}
}

customElements.define('login-page', LoginPage)
