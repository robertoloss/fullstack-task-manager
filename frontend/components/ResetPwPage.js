import sendEmail from "../actions/auth/sendEmail.js"
import login from "../actions/auth/login.js"


export default class ResetPwPage extends HTMLElement {
	constructor() {
		super()
		this.stateInit = {
			emailEntered: false,
			codeVerified: false,
			codeInvalid: false,
			email: ''
		}
		this.state = new Proxy(this.stateInit, {
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
	render() {
		this.innerHTML =`
			<div class="flex flex-col w-screen items-center px-4">
				<div class="flex flex-col gap-y-4 items-start mb-10 max-w-[400px] w-fit">
					${!this.state.emailEntered ? `
						<h1 class="text-xl  w-full">
							Enter your email here
						</h1>
						<form id="enter-email" method="post" action="/auth/auth-code/create" class="flex flex-col gap-y-2">
							<input type="text" id="email-reset" name="email" class="border border-black px-2"/>
							<button
								type="submit"
								class="rounded-md bg-gray-300 font-light text-sm px-2 py-1 min-w-14 hover:brightness-95
									transition-all"
							>
									Submit
							</button>
						</form>` : ''
					}
					${this.state.emailEntered && !this.state.codeVerified ? `
						<h1 class="text-xl  w-full">
							We have sent you a verification code
						</h1>
						<form id="verify-code" method="post" action="/auth-code/verify" class="flex flex-col gap-y-2">
							<input type="text" id="code" name="code" class="border border-black px-2"/>
							<button 
								type="submit"
								class="rounded-md bg-gray-300 font-light text-sm px-2 py-1 min-w-14 hover:brightness-95
									transition-all"
							>
									Verify code
							</button>
							${this.state.codeInvalid ? `
								<p class="text-sm text-red select-none">
									Invalid code. Enter a new code or
									<span id="get-new-code" class="underline cursor-pointer"> get a new one</span>
								</p>
							`:''}
						</form>` : ''
					}
					${this.state.emailEntered && this.state.codeVerified ? `
						<h1 class="text-xl  w-full">
							Reset your password here
						</h1>
						<form id="reset-pw-form" method="post" action="/auth/reset" class="flex flex-col gap-y-2">
							<input type="text" id="password1" name="password1" class="border border-black px-2"/>
							<input type="text" id="password2" name="password2" class="border border-black px-2"/>
							<button 
								type="submit"
								class="rounded-md bg-gray-300 font-light text-sm px-2 py-1 min-w-14 hover:brightness-95
									transition-all"
							>
									Reset
							</button>
						</form>` : ''
					}
				</div>
			</div>
		`
		const resetPwForm = document.getElementById('reset-pw-form')
		resetPwForm?.addEventListener('submit', async (e) => {
			e.preventDefault()
			const { password1 } = Object.fromEntries(new FormData(resetPwForm))
			const action = new URL(resetPwForm.action).pathname
			const resReset = await fetch(action, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: this.state.email,
					password: password1
				})
			})
			if (!resReset.ok) {
				console.error("Something went wrong while trying to reset your password")
				return
				//to do... display error message on screen
			}
			login(this.state.email,password1)
		})

		const getNewCode = document.getElementById('get-new-code')
		getNewCode?.addEventListener('click', () => {
			console.log('click')
			this.state.codeInvalid = false
			this.state.emailEntered = false
			this.state.codeVerified = false
		})


		const emailForm = document.getElementById('enter-email')
		emailForm?.addEventListener('submit', async (e) => {
			e.preventDefault()
			const { email } = Object.fromEntries(new FormData(emailForm))
			const emailResult = await sendEmail(email)
			if (!emailResult.ok) {
				console.error("Something went wrong while trying to send you an email")
				return
			}
			this.state.emailEntered = true
			this.state.email = email
		})

		const verifyCode = document.getElementById('verify-code')
		verifyCode?.addEventListener('submit', async(e) => {
			e.preventDefault()
			const { code } = Object.fromEntries(new FormData(verifyCode))
			const action = new URL(verifyCode.action).pathname
			const resVerify = await fetch(action, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ code: code })
			})
			if (!resVerify.ok) {
				console.error("Code is not valid")
				this.state.codeInvalid = true
				return
			} 
			this.state.codeVerified = true
		})
	}
}

customElements.define('reset-pw-page', ResetPwPage)
