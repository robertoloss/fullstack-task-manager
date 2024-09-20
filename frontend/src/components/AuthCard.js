import setNavLinks from "../utils/setNavLinks.js"

export class AuthCard extends HTMLElement {
	constructor() {
		super()
	}
	connectedCallback() {
		this.render()
		document.body.classList.add('bg-slate-300')
	}
	render() {
		const { 
			gotolabel,
			gotolink,
			cardtitle,
		} = { ...this.dataset }

		const children = document.querySelector('#auth-card-children')

		this.innerHTML = `
			<div class="page pattern flex flex-col w-screen h-screen items-center justify-between p-6">
				<div class="flex flex-col w-full">
					<div id="header-bar" class="flex flex-row justify-end w-full gap-x-6">
						<a 
							href="${gotolink}" 
							class="navlink cursor-pointer w-fit px-2 py-1 rounded-lg bg-gray-200 hover:bg-gray-100 
								 min-w-[80px] text-center transition-all shadow active:scale-95 font-normal text-sm"
						>
							${gotolabel}
						</a>
					</div>
					<h1 class="text-4xl mt-4 font-semibold self-center">
						QwikNotes
					</h1>
				</div>
				<div class="flex flex-col gap-y-10 w-full items-center">
					<div 
						class="flex shadow-gray-400 shadow-md p-6  rounded-lg flex-col gap-y-4
						items-start mb-10 max-w-[400px] w-full justify-center bg-slate-50"
					>
						${cardtitle != '' ? `
							<h1 class="text-base font-medium mb-8 w-fit self-center">
								${cardtitle}
							</h1> `
							: '' }
						<div id="slot" class="w-full"></div>			
					</div>
				</div>
				<div class="h-full max-h-20 w-full"></div>
			</div>
		`
		setNavLinks(this)
		const slot = document.querySelector('#slot')
		if (slot && children) slot.appendChild(children)
	}
}

customElements.define('auth-card', AuthCard)
