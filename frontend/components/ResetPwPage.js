import sendEmail from "../actions/auth/sendEmail.js"
import login from "../actions/auth/login.js"

export default class ResetPwPage extends HTMLElement {
	constructor() {
		super()
		this.stateInit = {
			emailEntered: false, //should be: false
			codeVerified: false,
			email: ''
		}
		this.state = new Proxy(this.stateInit, {
			set: (target, property, value) => {
				target[property] = value
				this.render()
				//console.log(this.state)
				if (property === 'noUserExists' && value === true) {
					setTimeout(()=>{
						this.state.noUserExists = false
						this.render()
					}, 3000)
				}
				return true
			}
		})
	}
	connectedCallback() {
		this.render()
	}
	displayErrorMessage(message) {
		this.error = true
		const errorDiv = document.querySelector('#error-message')
		console.log("error message: ", errorDiv)
		const errorP = document.createElement('p')
		errorP.className = 'text-sm text-red-700'
		errorP.innerText = message 
		errorDiv.appendChild(errorP)
		setTimeout(() => {
			errorDiv.removeChild(errorP)
			this.error = false
		},[2000])
	}
	showSpinnerInButton(buttonId) {
		console.log("show spinner")
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
			'send-email-button': 'Send',
			'reset-password-button': 'Reset',
			'send-code-button': 'Submit'
		}
		button.innerHTML = ''
		button.innerText = options[buttonId]
	}
	render() {
		this.innerHTML =`
		<auth-card
			data-goToLabel="Login"
			data-goToLink="/login"
			data-cardTitle=""
		>
			<div id='auth-card-children' class="flex flex-col gap-y-2 w-full">
				<div class="flex flex-col gap-y-4 items-start w-full">
					${!this.state.emailEntered ? `
						<h1 class="text-base font-medium mb-8 w-fit self-center">
							Enter your email here
						</h1>
						<form id="enter-email" method="post" action="/auth/auth-code/create" class="flex flex-col gap-y-2 w-full">
							<input-component data-type="email"></input-component>
							<div id="error-message" class="min-h-[20px]"></div>
							<button 
								id="send-email-button" 
								type="submit"
								class="flex flex-col justify-center items-center rounded-md bg-gray-300 font-light 
									h-10 mt-8 text-base px-2 py-1 min-w-14 hover:brightness-95 transition-all"
							>
								Send
							</button>
						</form> 
					` : ''}
					${this.state.emailEntered && !this.state.codeVerified ? `
						<h1 class="text-base font-medium mb-8 w-fit self-center">
							We have sent you a verification code
						</h1>
						<form id="verify-code" method="post" action="/auth-code/verify" class="flex flex-col gap-y-2 w-full">
							<input-component data-type="code"></input-component>
							<div id="error-message" class="min-h-[20px]"></div>
							<button 
								id="send-code-button" 
								type="submit"
								class="flex flex-col justify-center items-center rounded-md bg-gray-300 font-light 
									h-10 mt-8 text-base px-2 py-1 min-w-14 hover:brightness-95 transition-all"
							>
								Send
							</button>
						</form>` : ''
					}
					${this.state.emailEntered && this.state.codeVerified ? `
						<h1 class="text-base font-medium mb-8 w-fit self-center">
							Reset your password here
						</h1>
						<form id="reset-pw-form" method="post" action="/auth/reset" class="flex flex-col gap-y-2 w-full">
						<input-component data-type="new_password"></input-component>
						<input-component data-type="repeat_password"></input-component>
						<div id="error-message" class="min-h-[20px]"></div>
						<button 
							id="reset-password-button" 
							type="submit"
							class="flex flex-col justify-center items-center rounded-md bg-gray-300 font-light 
								h-10 mt-8 text-base px-2 py-1 min-w-14 hover:brightness-95 transition-all"
						>
							Reset
						</button>
						</form>` : ''
					}
				</div>
			</div>
			<auth-card>
		`
		const resetPwForm = document.getElementById('reset-pw-form')
		resetPwForm?.addEventListener('submit', async (e) => {
			e.preventDefault()
			this.showSpinnerInButton('reset-password-button')
			const { new_password, repeat_password } = Object.fromEntries(new FormData(resetPwForm))
			const action = new URL(resetPwForm.action).pathname
			if (!new_password || ! repeat_password) {
				this.hideSpinnerInButton('reset-password-button')
				if (new_password) this.displayErrorMessage('Please repeat your password')
				else if (repeat_password) this.displayErrorMessage('Please enter your password')
				else this.displayErrorMessage('Please enter your password in both boxes')
				return
			} else if (new_password != repeat_password) {
				this.displayErrorMessage(`Passwords don't match`)
				this.hideSpinnerInButton('reset-password-button')
				return
			}
			const resReset = await fetch(action, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: this.state.email,
					password: new_password
				})
			})
			if (!resReset.ok) {
				this.hideSpinnerInButton('reset-password-button')
				this.displayErrorMessage('Something went wrong while trying to reset your password')
				console.error("Something went wrong while trying to reset your password")
				return
			}
			login(this.state.email,new_password)
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
			if (this.error) return
			this.showSpinnerInButton('send-email-button')
			const { email } = Object.fromEntries(new FormData(emailForm))
			const resCheckData = await fetch('/auth/check', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json'},
				body: JSON.stringify({ email: email})
			})
			const resCheck = await resCheckData.json()
			if (!resCheck.userExists) {
				this.hideSpinnerInButton('send-email-button')
				this.displayErrorMessage('No user with this email exists')
				console.error("No user with this email exists")
				return
			}
			const emailResult = await sendEmail(email)
			if (!emailResult.ok) {
				this.hideSpinnerInButton('send-email-button')
				this.displayErrorMessage("Something went wrong while trying to send you an email")
				console.error("Something went wrong while trying to send you an email")
				return
			}
			this.state.emailEntered = true
			this.state.email = email
		})

		const verifyCode = document.getElementById('verify-code')
		verifyCode?.addEventListener('submit', async(e) => {
			e.preventDefault()
			this.showSpinnerInButton('send-code-button')
			const { code } = Object.fromEntries(new FormData(verifyCode))
			const action = new URL(verifyCode.action).pathname
			const resVerify = await fetch(action, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ 
					code: code,
					email: this.state.email
				})
			})
			if (!resVerify.ok) {
				this.hideSpinnerInButton('send-code-button')
				this.displayErrorMessage("Code is not valid")
				console.error("Code is not valid")
				return
			} 
			this.state.codeVerified = true
		})
	}
}

customElements.define('reset-pw-page', ResetPwPage)
