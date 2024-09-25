import { serverURL } from "../actions/server.js";
import setNavLinks from "../utils/setNavLinks.js"
import { Card } from "./Card.js";
import mainPageHTML from './MainPage/main-page.html?raw'
import { openModal } from "./MainPage/openModal.js";
import { renderList } from "./MainPage/renderList.js";
import { saveOrder } from "./MainPage/saveOrder.js";
import { Spinner } from "./Spinner.js";

export class MainPage extends HTMLElement {
	constructor() {
		super()
	}
	connectedCallback() {
		this.id = 'main-main-page'
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
		const events = ['start-saving-order', 'adding-note', 'deleting-note']
		for (let event of events) {
			document.addEventListener(event, ()=>{
				const mainContainer = this.querySelector('#info-h1')
				const saving = document.createElement('h1')
				saving.className = 'text-blue-600'
				saving.innerHTML = 'saving...'
				saving.id = 'saving'
				mainContainer.appendChild(saving)
			})
		}
		document.addEventListener('list-rendered', ()=>{
			const mainContainer = this.querySelector('#info-h1')
			const saving = this.querySelector('#saving')
			if (saving && mainContainer) mainContainer.removeChild(saving)
		})
	}

	renderList = renderList

	saveOrder = saveOrder

	getList = async ()=> {
		const response = await fetch(`${serverURL}/list`, {
			method: 'GET',
			credentials: 'include'	
		});
		const { names  } = await response.json()
		list.innerHTML = ''
		app.store.notes = names
		this.renderList(app.store.notes, this.state.toggle)
	}

	addNoteToList = (name, content, toggleState) => {
		const addEvent = new CustomEvent('adding-note')
		document.dispatchEvent(addEvent)
		const card = new Card(toggleState, name)
		card.setAttribute('data-id', name.id);
		card.setAttribute('data-name', name);
		card.setAttribute('data-content', content);
		const dndNotes = document.querySelector('#dndNotes')
		dndNotes.prepend(card)
	}

	render = () => {
		this.innerHTML = mainPageHTML
		setNavLinks(this)

		this.style.width= '100%'
		const logOutButton = this.querySelector('#log-out')
		const displayUser = this.querySelector('#display-current-user')
		const modalButton = this.querySelector('#add-modal')
		const toggle = this.querySelector('#grid-list-toggle')
		const mainContainer = this.querySelector('#main-container')

		document.addEventListener('there-are-notes', ()=>{
			const info = document.getElementById('info-h1');
			if (!info) {
				const infoH1 = document.createElement('h1')
				infoH1.id = 'info-h1'
				infoH1.classList = 'px-4 py-5 h-[88px] text-sm text-gray-600 text-center font-light'
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
			openModal(this.addNoteToList, this.getList, this.state.toggle)
		})

		document.addEventListener('keydown', (event) => {
			if (event.ctrlKey && event.key === 'n') {
				if (app.modalIsOpen) {
					return
				}
				openModal(this.addNoteToList, this.getList, this.state.toggle)
				app.modalIsOpen = true
			}
		});

		logOutButton?.addEventListener('click', async (e) => {
			e.preventDefault()
			logOutButton.innerHTML = ''
			const spinner = new Spinner('size-4')
			logOutButton.appendChild(spinner)
			console.log("logging out...")
			const response = await fetch(`${serverURL}/auth/logout`, {
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
			const response = await fetch(`${serverURL}/current-user`, {
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
