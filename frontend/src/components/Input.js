

export class Input extends HTMLElement {
	constructor() {
		super()
		this.stateInit = {
			smallLabel: false,
			justFocused: false,
			justBlurred: false,
		}
		this.state = new Proxy(this.stateInit, {
			set: (target, property, value) => {
				target[property] = value;
				if (property === 'smallLabel') this.render()
				return true
			}
		})
	}
	connectedCallback() {
		this.render()
	}
	render() {
		const inputType = this.dataset.type
		this.innerHTML = ''	
		this.innerHTML = `
			<div class="flex flex-col relative h-fit w-full">
				<p 
					id="${inputType}Label" 
					class="${`
						${this.state.smallLabel ? 'top-[5px] text-xs text-blue-700' : 'top-[15px] text-sm text-slate-400'} 
						left-2 max-h-0 transition relative
					`}"
				>
					${inputType[0].toUpperCase() + inputType.slice(1).replace(/_/g, ' ')}
				</p>
				<input 
					type=${inputType.includes('password') ? 'password' : inputType} 
					id=${inputType} 
					name=${inputType} 
					autocomplete=${inputType} 
					class="border border-gray-600 px-2 w-full h-12 font-light rounded-md ${this.state.smallLabel ? 'pt-4':''}"
				/>
				<div class="${inputType === 'password'  ? this.dataset.login ? 'visible' : 'invisible' : 'hidden' }
					flex flex-row w-full mt-1 justify-end"
				>
					<a href="/reset-password" class="navlink text-xs">
						Forgot password?
					</a>
				</div>
			</div>
		`
		this.querySelectorAll('a.navlink').forEach(a => {
			a.addEventListener('click', e => {
				e.preventDefault()
				const url = a.href
				app.router.go(url)
			})
		})

		setTimeout(()=>{
			const input = document.getElementById(`${inputType}`)
			const label = document.getElementById(`${inputType}Label`) 

			input?.addEventListener('focus', () => {
				if (!this.state.justFocused) this.state.smallLabel = true
				this.state.justFocused = true
			})
			input?.addEventListener('blur', (e)=>{
				if (e.target.value === "" && this.state.justFocused) {
					this.state.justFocused = false
					this.state.smallLabel = false
				} else  {
				}
			})
			label?.addEventListener('click', ()=>{
				if (input) {
					input.focus()
				}
				this.state.smallLabel = true
			})
			if (this.state.justFocused) {
				input.focus()
			} else {
				input?.blur()
			}
		}, 0)
	}
}

customElements.define('input-component', Input)
