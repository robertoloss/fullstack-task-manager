
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
			formid,
			formaction,
			buttonlabel,
			hidemainbutton
		} = { ...this.dataset }
		const buttonispending = JSON.parse(this.dataset.buttonispending)
		const hideMainButton = hidemainbutton ? JSON.parse(this.dataset.hidemainbutton) : false

		const children = document.querySelector('#auth-card-children')
		this.innerHTML = `
			<div class="flex flex-col w-screen h-screen items-center justify-between p-6">
				<div id="header-bar" class="flex flex-row justify-end w-full gap-x-6">
					<a href="${gotolink}" class="navlink" cursor-pointer w-fit">
						${gotolabel}
					</a>
				</div>
				<div 
					class="flex shadow-gray-400 shadow-md p-6  rounded-lg flex-col gap-y-4
					items-start mb-10 max-w-[400px] w-full justify-center bg-slate-50"
				>
					<h1 class="text-base font-medium mb-8 w-fit self-center">
						${cardtitle}
					</h1>
					<form id="${formid}" method="post" action="${formaction}" 
						class="flex flex-col gap-y-2 w-full"
					>
						<div id="slot">
						</div>
						${!hideMainButton ? `
							<button 
								type="submit"
								class="flex flex-col justify-center items-center rounded-md bg-gray-300 font-light 
									h-10 mt-8 text-base px-2 py-1 min-w-14 hover:brightness-95 transition-all"
							>
								${buttonispending ? `
									<div class="h-6">
										<spinner-component></spinner-component>
									</div>` 
									: buttonlabel
								}
							</button>` : ''
						}
					</form>
				</div>
				<div class="h-full max-h-20 w-full"></div>
			</div>
		`
		this.querySelectorAll('a.navlink').forEach(a => {
			a.addEventListener('click', e => {
				e.preventDefault()
				const url = a.href
				console.log("Url from listener: ", url)
				app.router.go(url)
			})
		})
		const slot = document.querySelector('#slot')
		if (slot && children) slot.appendChild(children)
		console.log("slot: ", slot)
		console.log("children: ", children)
	}
}

customElements.define('auth-card', AuthCard)
