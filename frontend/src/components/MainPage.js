import setNavLinks from "../utils/setNavLinks.js"
import { reactive, html } from "@arrow-js/core";
import { animations, dragAndDrop,swap } from "@formkit/drag-and-drop";

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
	}
	renderList(names) {
		if (names.length === 0) {
			list.innerHTML = '<h1>No names yet</h1>'
		} else {
			list.innerHTML = ''
			const state = reactive({
				dndNames: names.sort((a,b)=>a.position - b.position)
			})
			html`
				<ul 
					id="dndNotes" 
					class="w-full grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4"
				>
					${()=>
						state.dndNames.map((name) => 
							html`
								<card-component 
									data-id="${name.id}"
									data-name="${name.title}"
									data-content="${name.content}"
								>
								</card-component>
							`
					)}
				</ul>
			`(document.getElementById('list'))

			dragAndDrop({
				parent: document.getElementById("dndNotes"),
				getValues: ()=>state.dndNames,
				setValues: (newValues) => {
					this.previousOrder = [...state.dndNames];
					this.newValues = newValues
					state.dndNames = reactive(newValues);
				},
				config: {
					dragHandle: '.note-handle',
					handleEnd: () => {
						this.saveOrder(this.newValues).catch(() => {
							state.dndNames = reactive(this.previousOrder);
							alert('Failed to update the order. Reverting to previous state.');
						});
					},
					plugins: [
						//animations(),
						//swap()
					],
					dropZoneClass: 'dragging'
				}
			})
		}
	}
	async saveOrder(updatedNotes) {
		const newNotes = JSON.parse(JSON.stringify(updatedNotes))

		if (!Array.isArray(newNotes)) throw new Error("No array found")

		newNotes.forEach((note, i) => note.position = i+1)

		try {
			const response = await fetch('https://localhost:8090/update-notes-order', {
				credentials: 'include',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ notes: newNotes })
			})
			if (!response.ok) {
				throw new Error("failed to update the order")
			} 
			this.getList()
			console.log("Order update correctly!")

		} catch(error) {
			console.error(error)
			throw error
		}
	}

	async getList() {
		const response = await fetch('https://localhost:8090/list', {
			method: 'GET',
			credentials: 'include'	
		});
		const { names  } = await response.json()
		list.innerHTML = ''
		app.store.notes = names
		this.renderList(app.store.notes)
	}

	openModal = () => {
		console.log("open modal")
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
						action="https://localhost:8090/list"
						target="hidden-iframe"
					>
						<div class="flex flex-col h-full gap-y-2">
							<input 
								type="text" 
								id="new-name" 
								name="name" 
								class="rounded-md focus:outline-none font-bold text-2xl px-2"
							/>
							<textarea 
								id="new-content" 
								name="content" 
								class="rounded-md px-2 h-full focus:outline-none resize-none font-light text-large
									focus:border-gray-200"
							></textarea>
						</div>
						<button id="new-note-button" type="submit"
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

		//
		const observer = new MutationObserver((mutations, obs) => {
        const form = modal.querySelector('#add-name-form');
        if (form) {
            obs.disconnect(); // Stop observing
            this.setupFormListener(form, modal);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
		//

		setTimeout(() => {
			const newName = document.querySelector('#new-name');
			newName.focus();
		}, 10);

		modal.addEventListener('keydown', (event) => {
			if (event.key === 'Escape') {
				event.preventDefault(); 
				modal.close();
				modal.remove();
			}
		})

		modal.addEventListener('click', (event) => {
			const rect = modal.getBoundingClientRect();
			const isInDialog =
				rect.top <= event.clientY &&
				event.clientY <= rect.top + rect.height &&
				rect.left <= event.clientX &&
				event.clientX <= rect.left + rect.width;
			if (!isInDialog) {
				modal.close();
				modal.remove()
			}
		});

		document.startViewTransition(()=>modal.showModal());
		const closeButton = modal.querySelector('#closeButton');
		closeButton.addEventListener('click', () => {
				modal.close();
				modal.remove()
		});

		const form = modal.querySelector('#add-name-form')
		console.log(form)
		
		//form.addEventListener('submit', async (event) => {
		//	console.log('ok')	
		//	event.preventDefault();
		//	const formObject = Object.fromEntries(new FormData(form))
		//	const { name: newName, content } = formObject;
		//	this.addNoteToList(newName, content);
		//	const response = await fetch('https://localhost:8090/list', {
		//			method: 'POST',
		//			credentials: 'include',
		//			headers: { "Content-Type": "application/json" },
		//			body: JSON.stringify(formObject)
		//	});
		//	if (response.ok) {
		//		console.log("response ok")
		//		form.reset();
		//		this.getList();
		//		const modal = document.querySelector('#modal')
		//		modal.close()
		//		modal.remove()
		//	} else {
		//		console.error('Failed to add name');
		//		const firstItem = list.firstElementChild
		//		firstItem.remove()
		//		const modal = document.querySelector('#modal')
		//		modal.close()
		//		modal.remove()
		//	}
		//});
	}

	setupFormListener = (form, modal) => {
    console.log('Setting up form listener');
    form.addEventListener('submit', async (event) => {
        console.log('Form submitted');
        event.preventDefault();
        const formObject = Object.fromEntries(new FormData(form));
        const { name: newName, content } = formObject;
        this.addNoteToList(newName, content);
        try {
            const response = await fetch('https://localhost:8090/list', {
                method: 'POST',
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formObject)
            });
            if (response.ok) {
                console.log("response ok");
                form.reset();
                await this.getList();
                modal.close();
                modal.remove();
            } else {
                throw new Error('Failed to add name');
            }
        } catch (error) {
            console.error('Error:', error);
            const firstItem = list.firstElementChild;
            if (firstItem) firstItem.remove();
            modal.close();
            modal.remove();
        }
    });
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
			<div id='main-page' class="page flex flex-col w-full max-w-[1200px] min-h-[100vh] h-fit items-center bg-zinc-200">
				<div id="header-bar" class="flex flex-row w-full justify-between p-4">
					<div class="flex flex-row gap-x-4 w-[120px] font-bold">QwikNotes</div>
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
				<div class="flex flex-col pb-10 w-full max-w-[1200px] gap-y-4 items-center px-4 sm:px-10 lg:px-20">
					<button 
						id="add-modal" 
						class="fixed bottom-[32px] right-[40px] w-[64px] h-[64px] bg-blue-700 rounded-full 
							 font-light text-center text-3xl text-white hover:bg-blue-500 transition-all"
					> 
						+
					</button>
					<div 
						id="list" 
						class="w-full grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4"
					>
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

		modalButton.addEventListener('click', this.openModal)
		document.addEventListener('keydown', (event) => {
			if (event.ctrlKey && event.key === 'n') {
				this.openModal()
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
