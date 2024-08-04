import login from "../actions/auth/login.js"

export default class AuthCode extends HTMLElement {
	constructor() {
		super()
	}
	connectedCallback() {
		this.render()
	}
	render() {
		this.innerHTML = `
			<div class="flex flex-row gap-x-10 w-fit justify-center max-w-[400px]">
				<div class="flex flex-col gap-y-4 items-start mb-10 w-full">
					<h1 class="text-lg font-bold w-full">
						Please, enter the confirmation code
					</h1>
					<form id="verify-form" method="post" action="/auth-code/verify" class="flex flex-col gap-y-2">
						<input type="text" id="code" name="code" class="border border-black px-2"/>
						<button 
							type="submit"
							class="rounded-md bg-gray-300 font-light text-sm px-2 py-1 min-w-14 
								hover:brightness-95 transition-all"
						>
							Verify
						</button>
					</form>
				</div>
				<div id="list-of-users" class=" flex flex-col"></div>
			</div>
		`
		const verifyForm = document.querySelector('#verify-form')
		verifyForm.addEventListener('submit', async (e)=> {
			e.preventDefault()
			const { code } = Object.fromEntries(new FormData(verifyForm))
			const resVerifyCode = await fetch('/auth-code/verify', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json'},
				body: JSON.stringify({
					email: this.dataset.email,
					code
				})
			})
			if (resVerifyCode.ok) {
				console.log("Trying to sign up: ", this.dataset.email, this.dataset.password)
				const response = await fetch('/auth/register', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						email: this.dataset.email,
						password: this.dataset.password
					})
				})
				if (response.ok) {
					login(this.dataset.email, this.dataset.password)
				} else {
					console.error("There was an error while creating the user")
				}
			} else {
				console.error("There was an error while signing you up")
			}
		})
	}
}

customElements.define('auth-code', AuthCode)
