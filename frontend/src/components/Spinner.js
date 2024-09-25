

export class Spinner extends HTMLElement {
	constructor(size) {
		super()
		this.size = size
	}
	connectedCallback() {
		const node = document.createElement('div')
		node.innerHTML = `
			<div 
				id="inner-spinner"
				class="animate-spin self-center justify-self-center inline-block max-h-6 border-[3px] 
					size-6 border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading"
			>
			</div>
		`
		this.appendChild(node)
		setTimeout(()=>{
			const spinner = document.getElementById('inner-spinner')
			if (this.size) {
				spinner.classList.remove('size-6')
				spinner.classList.add(`${this.size}`)
				spinner.classList.remove('border-[3px]')
				spinner.classList.add(`border-[2px]`)
				spinner.classList.add(`mt-[3px]`)
			}
		},1)
	}
}


customElements.define('spinner-component', Spinner)
