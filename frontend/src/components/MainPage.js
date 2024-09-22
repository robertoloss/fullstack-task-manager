import setNavLinks from "../utils/setNavLinks.js"
import { openModal } from "./MainPage/openModal.js";
import { renderList } from "./MainPage/renderList.js";
import { saveOrder } from "./MainPage/saveOrder.js";

export class MainPage extends HTMLElement {
	constructor() {
		super()
	}
	connectedCallback() {
		this.stateInit = {
			toggle: false
		}
		this.state = new Proxy(this.stateInit, {
			set: (target, property, value) => {
				target[property] = value
				if (property === 'toggle') {
					const toggle = document.getElementById('toggle')
					const list = document.getElementById('dndNotes')
					if (this.state.toggle) {
						toggle.classList.add('translate-x-[26px]')
						list.classList.remove('grid-cols-[repeat(auto-fit,minmax(280px,1fr))]')
						list.classList.add('grid-cols-1')
						list.classList.add('max-w-[800px]')
					} else {
						toggle.classList.remove('translate-x-[26px]')
						list.classList.remove('grid-cols-1')
						list.classList.remove('max-w-[800px]')
						list.classList.add('grid-cols-[repeat(auto-fit,minmax(280px,1fr))]')
					}
					const customEvent = new CustomEvent('grid-list-toggle', {
						detail: {
							toggleOn: this.state.toggle
						}
					})
					document.dispatchEvent(customEvent)
				}
				return true
			}
		})
		this.render()
		this.addEventListener('update-list', this.getList)
		document.addEventListener('grid-list-toggle', () => {
			this.renderList(app.store.notes, this.state.toggle)
		})
		this.addEventListener('get-list', this.getList)
		this.style.width = ''
		this.className = 'flex flex-col w-full items-center'	
		document.body.classList.add('bg-zinc-200')
		document.body.classList.add('overflow-hidden')
	}

	renderList = renderList

	saveOrder = saveOrder

	getList = async ()=> {
		const response = await fetch('https://localhost:8090/list', {
			method: 'GET',
			credentials: 'include'	
		});
		const { names  } = await response.json()
		list.innerHTML = ''
		app.store.notes = names
		this.renderList(app.store.notes, this.state.toggle)
	}

	addNoteToList = (name, content) => {
		const card = document.createElement('card-component');
		card.setAttribute('data-id', name.id);
		card.setAttribute('data-name', name);
		card.setAttribute('data-content', content);
		const dndNotes = document.querySelector('#dndNotes')
		dndNotes.prepend(card)
	}

	render = () => {
		this.innerHTML = `
			<div 
				id='main-page' 
				class="page pattern flex flex-col w-full min-h-[100vh] h-fit items-center bg-zinc-200"
			>
				<div 
					id="header-bar" 
					class="fixed bg-zinc-200 flex flex-row w-full justify-between p-4 h-[64px] shadow"
				>
					<div class="flex flex-row items-center gap-x-4 font-bold w-full">
						QwikNotes
					</div>
					<div class="flex flex-row items-center justify-center h-full w-full">
						<div 
							id="grid-list-toggle"
							class="flex flex-row justify-start p-[4px] items-center w-[56px] rounded-full h-[28px] 
								bg-white border border-zinc-300 cursor-pointer"
						>
							<div 
								id='toggle'
								class="rounded-full transition-all duration-300 w-[20px] h-[20px] bg-zinc-400"
							>
							</div>
						</div>
					</div>
					<div class="flex flex-row gap-x-4 w-full justify-end">
						<div 
							id="display-current-user" 
							class="hidden sm:block flex-row justify-start sm:justify-center w-full items-center font-light 
								text-sm sm:w-fit sm:max-w-[200px] max-w-[80px] text-ellipsis overflow-hidden"
						>
							...
						</div>
						<button 
							id="log-out" 
							class="flex flex-row items-center justify-center 
								rounded-md bg-gray-300 font-light text-sm px-2 py-1 min-w-14 
								hover:brightness-95 transition-all"
						>
							Logout
						</button>
					</div>
				</div>
				<div 
					id="main-container"
					class="w-full h-full max-h-[calc(100vh-64px)] mt-[64px] flex flex-col items-center overflow-y-scroll"
				>
					<div class="flex flex-col pb-10  w-full h-full max-w-[1200px] gap-y-4 items-center px-4 sm:px-10 lg:px-20">
						<button 
							id="add-modal" 
							class="fixed bottom-[32px] right-[40px] w-[64px] h-[64px] bg-blue-700 rounded-full 
								 font-light text-center text-4xl text-white hover:bg-blue-500 transition-all"
						> 
							+
						</button>
						<div 
							id="list" 
							class="transition-all w-full flex flex-col items-center gap-4 pb-10"
						>
							<div class="flex flex-row w-full justify-center">
								<spinner-component></spinner-component>
							</div>
						</div>
					</div>
				</div>
			</div>
		`
		setNavLinks(this)

		this.style.width= '100%'
		const logOutButton = this.querySelector('#log-out')
		const displayUser = this.querySelector('#display-current-user')
		const modalButton = this.querySelector('#add-modal')
		const toggle = this.querySelector('#grid-list-toggle')
		const mainContainer = this.querySelector('#main-container')
		console.log('main container', mainContainer)

		document.addEventListener('there-are-notes', ()=>{
			const info = document.getElementById('info-h1');
			if (!info) {
				const infoH1 = document.createElement('h1')
				infoH1.id = 'info-h1'
				infoH1.classList = 'px-4 py-5 text-sm text-gray-600 text-center font-light'
				infoH1.innerHTML = `
					To create a new note press the + button below or use the shortcut 'CTRL+n'
				`
				mainContainer.prepend(infoH1)
			}
		})

		document.addEventListener('there-are-no-notes', ()=>{
			const info = document.getElementById('info-h1');
			info?.remove()
		})


		toggle.addEventListener('click', ()=>{
			this.state.toggle = !this.state.toggle
		})

		if (!app.store.notes) { 
			this.getList()
		} else {
			this.renderList(app.store.notes, this.state.toggle)
		}
		getUser()

		modalButton.addEventListener('click', ()=> {
			app.modalIsOpen = true
			openModal(this.addNoteToList, this.getList)
		})

		document.addEventListener('keydown', (event) => {
			if (event.ctrlKey && event.key === 'n') {
				if (app.modalIsOpen) {
					console.log("modal is open: ", app.modalIsOpen)
					return
				}
				openModal(this.addNoteToList, this.getList)
				app.modalIsOpen = true
			}
		});

		logOutButton?.addEventListener('click', async (e) => {
			e.preventDefault()
			console.log("logging out...")
			const response = await fetch('https://localhost:8090/auth/logout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				mode: 'cors'
			})
			app.store.notes = null
			app.store.user = null
			console.log("response: ", response)
			console.log("response headers: ", response.headers)
			if (response.ok) {
				app.router.go('/login')
			}
		})

		async function getUser() {
			try {
				if (!app.store.user) {
					const user = await getCurrentUser()
					app.store.user = user
				}
				displayUser.innerHTML = ''
				displayUser.innerHTML = `${app.store.user}`	
				displayUser.classList.add('sm:w-fit','sm:max-w-[200px]','max-w-[80px]', 'text-ellipsis', 'overflow-hidden')
			} catch (error) {
				console.error(error)
			}
		}

		async function getCurrentUser() {
			const response = await fetch('https://localhost:8090/current-user', {
				method: 'GET',
				credentials: 'include'
			})
			const data = await response.json()
			if (data) return data.user.email
		}



		const iFrame = document.querySelector('iframe');
		if (iFrame) {
			iFrame.onload = function() {
				location.reload();
			};
		}
	}
}

customElements.define('main-page', MainPage)
