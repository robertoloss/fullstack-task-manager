
export class AuthCard extends HTMLElement {
	constructor() {
		super()
	}
	connectedCallback() {
		this.render()
	}
	render() {
		const { 
			gotolabel,
			gotolink,
			cardtitle,
		} = { ...this.dataset }

		const children = document.querySelector('#auth-card-children')

		this.innerHTML = `
			<div class="page flex flex-col w-screen h-screen items-center justify-between p-6">
				<div id="header-bar" class="flex flex-row justify-end w-full gap-x-6">
					<a href="${gotolink}" class="navlink" cursor-pointer w-fit">
						${gotolabel}
					</a>
				</div>
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
				<div class="h-full max-h-20 w-full"></div>
			</div>
		`
		this.querySelectorAll('a.navlink').forEach(a => {
			a.addEventListener('click', e => {
				e.preventDefault()
				const url = a.href
				app.router.go(url)
			})
		})
		const slot = document.querySelector('#slot')
		if (slot && children) slot.appendChild(children)
	}
}

customElements.define('auth-card', AuthCard)
