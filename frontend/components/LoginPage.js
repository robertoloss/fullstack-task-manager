//import useTailwind from "../utils/useTailwind.js"

export class LoginPage extends HTMLElement {
	constructor() {
		super()

		//this.shadowDOM = this.attachShadow({mode: 'open'})
		const template = document.getElementById('login-page')
		const content = template.content.cloneNode(true)
		this.appendChild(content)
	}

		//connectedCallback() {
		//	useTailwind(this.shadowDOM)
		//	const template = document.getElementById('login-page')
		//	const content = template.content.cloneNode(true)
		//	this.shadowDOM.appendChild(content)
		//}
}

customElements.define('login-page', LoginPage)
