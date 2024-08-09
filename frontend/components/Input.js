

export class Input extends HTMLElement {
	constructor() {
		super()
		this.stateInit = {
			smallLabel: false,
			justFocused: false,
			justBlurred: false
		}
		this.state = new Proxy(this.stateInit, {
			set: (target, property, value) => {
					target[property] = value;
					if (property === 'smallLabel') {
						this.render()
					}
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
			<div class="flex flex-col relative h-fit">
				<p 
					id="${inputType}Label" 
					class="${`
						${this.state.smallLabel ? 'top-[5px] text-xs text-blue-700' : 'top-[15px] text-sm text-slate-400'} 
						left-2 max-h-0 transition relative
					`}"
				>
					${inputType[0].toUpperCase() + inputType.slice(1)}
				</p>
				<input 
					type=${inputType} 
					id=${inputType} 
					name=${inputType} 
					autocomplete=${inputType} 
					class="border border-gray-600 px-2 h-12 font-light rounded-md ${this.state.smallLabel ? 'pt-4':''}"
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
		console.log("rendered", inputType)
		console.log("state", inputType, this.state)

		setTimeout(()=>{
			const input = document.getElementById(`${inputType}`)
			const label = document.getElementById(`${inputType}Label`) 

			input?.addEventListener('focus', () => {
				if (!this.state.justFocused) this.state.smallLabel = true
				this.state.justFocused = true
				console.log("focus", inputType)
			})
			input?.addEventListener('blur', (e)=>{
				if (e.target.value === "" && this.state.justFocused) {
					this.state.justFocused = false
					this.state.smallLabel = false
					console.log("empty value")
				} else  {
					console.log("non-empty value")
				}
				console.log('blur', inputType)
			})
			label?.addEventListener('click', ()=>{
				this.state.smallLabel = true
				if (input) {
					console.log("input exists", inputType)
					input.focus()
				}
				console.log("blur", inputType)
			})
			input?.addEventListener('change', ()=> {
				console.log("chagne")
			})

			if (this.state.justFocused) {
				input.focus()
				console.log("here")
			} else {
				input.blur()
			}
		}, 0)


	}
}

customElements.define('input-component', Input)
