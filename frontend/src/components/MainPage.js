import setNavLinks from "../utils/setNavLinks.js"
import { openModal } from "./MainPage/openModal.js";
import { renderList } from "./MainPage/renderList.js";
import { saveOrder } from "./MainPage/saveOrder.js";

export class MainPage extends HTMLElement {
	constructor() {
		super()
	}
	connectedCallback() {
		this.render()
		this.addEventListener('update-list', this.getList)
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
		this.renderList(app.store.notes)
	}

	addNoteToList = (name, content) => {
		const card = document.createElement('card-component');
		card.setAttribute('data-id', name.id);
		card.setAttribute('data-name', name);
		card.setAttribute('data-content', content);
		const dndNotes = document.querySelector('#dndNotes')
		dndNotes.prepend(card)
		//list.prepend(card);
	}

	render = () => {
		this.innerHTML = `
			<div id='main-page' class="page flex flex-col w-full min-h-[100vh] h-fit items-center bg-zinc-200 ">
				<div id="header-bar" class="fixed bg-zinc-200 flex flex-row w-full justify-between p-4 h-[64px]">
					<div class="flex flex-row gap-x-4 w-[120px] font-bold">QwikNotes</div>
					<div class="flex flex-row gap-x-4 w-fit">
						<div id="display-current-user" class="flex flex-row justify-center items-center font-light text-sm">
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
				<div class="w-full max-h-[calc(100vh-64px)] mt-[64px] flex flex-col items-center overflow-auto">
					<div class="flex flex-col pb-10  pt-[40px] w-full h-full max-w-[1200px] gap-y-4 items-center px-4 sm:px-10 lg:px-20">
						<button 
							id="add-modal" 
							class="fixed bottom-[32px] right-[40px] w-[64px] h-[64px] bg-blue-700 rounded-full 
								 font-light text-center text-3xl text-white hover:bg-blue-500 transition-all"
						> 
							+
						</button>
						<div 
							id="list" 
							class="w-full grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 pb-10"
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

		if (!app.store.notes) { 
			this.getList()
		} else {
			this.renderList(app.store.notes)
		}
		getUser()

		modalButton.addEventListener('click', ()=> {
			openModal(this.addNoteToList, this.getList)
		})

		document.addEventListener('keydown', (event) => {
			if (event.ctrlKey && event.key === 'n') {
				openModal(this.addNoteToList, this.getList)
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
