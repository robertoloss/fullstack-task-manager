

export class Spinner extends HTMLElement {
	constructor() {
		super()
	}
	connectedCallback() {
		const node = document.createElement('div')
		node.innerHTML = `
			<div class="animate-spin self-center justify-self-center inline-block size-6 max-h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
			</div>
		`
		this.appendChild(node)
	}
}


customElements.define('spinner-component', Spinner)
