import setNavLinks from "../utils/setNavLinks.js"
//import { z } from "../../node_modules/zod/lib/"

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
		document.body.classList.add('bg-slate-50')
	}
	renderList(names) {
		if (names.length === 0) {
			list.innerHTML = '<h1>No names yet</h1>'
		} else {
			list.innerHTML = names.map(name => `
				<card-component 
					data-id="${name.id}"
					data-name="${name.title}"
					data-content="${name.content}"
				>
				</card-component>
			`).join('')
		}
	}
	async getList() {
		console.log("getList() invoked...")
		const response = await fetch('http://localhost:8090/list', {
			method: 'GET',
			credentials: 'include'	
		});
		const { names  } = await response.json()
		list.innerHTML = ''
		app.store.notes = names
		this.renderList(app.store.notes)
	}
	render() {
		console.log(this.zComment)
		this.innerHTML = `
			<div id='main-page' class="page flex flex-col w-full max-w-[1200px] min-h-[100vh] h-fit items-center bg-slate-50">
				<div id="header-bar" class="flex flex-row w-full justify-between ">
					<div class="flex flex-row gap-x-4 w-[120px]"></div>
					<div class="flex flex-row gap-x-6 w-fit justify-center">
						<a href="/" class="navlink cursor-pointer w-fit">
							Home
						</a>
						<a href="/new-page" class="navlink cursor-pointer w-fit">
							New Page
						</a>
					</div>
					<div class="flex flex-row gap-x-4 w-fit">
						<div id="display-current-user" class="">
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
				<div class="flex flex-col py-10 max-w-[1200px] gap-y-4 items-center px-4 sm:px-10 lg:px-20">
					<h1 id="hello" class="text-2xl font-semibold w-fit">My Notes</h1>
					<button id="add-modal"> New note </button>
					<div id="list" class="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
						<div class="flex flex-row w-full justify-center">
							<spinner-component></spinner-component>
						</div>
					</div>
				</div>
			</div>
		`
		setNavLinks(this)
		this.style.width= '100%'
		const logOutButton = this.querySelector('#log-out')
		const list = this.querySelector('#list')
		const displayUser = this.querySelector('#display-current-user')
		const modalButton = this.querySelector('#add-modal')

		if (!app.store.notes) { 
			this.getList()
		} else {
			this.renderList(app.store.notes)
		}
		getUser()

		modalButton.addEventListener('click', ()=>{
			const modal = document.createElement('dialog')
			modal.className = `border border-black rounded-md p-6 w-full max-w-[600px] h-full max-h-[600px]`
			modal.id = 'modal'
			modal.innerHTML = `
				<div class="h-full flex flex-col gap-y-4">
					<div class="flex flex-row justify-end">
						<button class="self-end text-sm text-gray-500 font-light hover:text-gray-900 transition-all" 
							id="closeButton"
						>
							close
						</button>
					</div>
					<div class="flex flex-col gap-y-4 h-full">
						<form 
							id="add-name-form" 
							method="post" 
							class="flex flex-col gap-y-2 justify-between h-full"
							action="/list"
							target="hidden-iframe"
						>
							<div class="flex flex-col h-full gap-y-2">
								<input type="text" id="new-name" name="name" class="border border-black px-2"/>
								<textarea id="new-content" name="content" class="border border-black px-2 h-full"/>
								</textarea>
							</div>
							<button id="login-button" type="submit"
								class="flex flex-col justify-center items-center rounded-md bg-gray-300 font-light 
									h-10 text-base px-2 py-1 min-w-14 hover:brightness-95 transition-all"
							>
								Save
							</button>
							<iframe name="hidden-iframe" style="display:none;"></iframe>
						</form>
					</div>
				</div>
			`
			document.body.appendChild(modal);

			//modal.addEventListener('keydown', (event) => {
			//	console.log("preventing closure")
			//	if (event.key === 'Escape') {
			//		event.preventDefault(); 
			//	}
			//})

			modal.addEventListener('click', (event) => {
				const rect = modal.getBoundingClientRect();
				const isInDialog =
					rect.top <= event.clientY &&
					event.clientY <= rect.top + rect.height &&
					rect.left <= event.clientX &&
					event.clientX <= rect.left + rect.width;
				if (!isInDialog) {
					modal.close();
				}
			});

			document.startViewTransition(()=>modal.showModal());
			const closeButton = modal.querySelector('#closeButton');
			closeButton.addEventListener('click', () => {
					modal.close();
			});
			const form = modal.querySelector('#add-name-form')
			form?.addEventListener('submit', async (event) => {
				event.preventDefault();
				const modal = document.querySelector('#modal')
				modal.close()
				console.log("here")
				const formObject = Object.fromEntries(new FormData(form))
				const { name: newName, content } = formObject;
				addNameToList(newName, content);
				const response = await fetch('http://localhost:8090/list', {
						method: 'POST',
						credentials: 'include',
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(formObject)
				});
				if (response.ok) {
					console.log("response ok")
					form.reset();
					this.getList();
				} else {
					console.error('Failed to add name');
					const firstItem = list.firstElementChild
					firstItem.remove()
				}
			});
		})

		logOutButton?.addEventListener('click', async (e) => {
			e.preventDefault()
			const response = await fetch('http://localhost:8090/auth/logout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			})
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
			const response = await fetch('http://localhost:8090/current-user', {
				method: 'GET',
				credentials: 'include'
			})
			const data = await response.json()
			if (data) return data.user.email
		}


		function addNameToList(name, content) {
			const card = document.createElement('card-component');
			card.setAttribute('data-id', name.id);
			card.setAttribute('data-name', name);
			card.setAttribute('data-content', content);
			list.prepend(card);
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
