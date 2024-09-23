import editTitle from "../utils/editTitle.js"
import editContent from "../utils/editContent.js"
import { openDeleteModal } from "./MainPage/openDeleteModal.js"
import svgHandle from "./svg-handle.html?raw"
import { serverURL } from "../actions/server.js"

export class Card extends HTMLElement {
	constructor(toggleOnValue, noteTitle) {
		super()
		if (toggleOnValue) {
			this.toggleOn = toggleOnValue
		}
		if (noteTitle) {
			this.noteTitle = noteTitle
		}
	}
	connectedCallback() {
		this.noteId = this.dataset.id
		this.noteTitle = this.noteTitle ?? this.dataset.name
		this.content = this.dataset.content
		this.toggleOn = this.toggleOn ?? this.dataset.toggleon ? JSON.parse(this.dataset.toggleon) : false
		this.addEventListener('click', (event)=>{
			if (['delete-button','title', 'delete-button-2'].includes(event.target.id)) return
			if (['note-handle'].includes(event.target.className)) return
			const modal = document.createElement('dialog')
			modal.id = `modal-note-${this.noteId}`
			modal.className = `border border-black rounded-md p-6 pl-8 w-full max-w-[600px] h-full max-h-[600px] overflow-hidden`
			modal.innerHTML = `
				<div class="flex flex-row justify-end mb-6">
					<button class="self-end text-sm text-gray-500 font-light hover:text-blue-700 transition-all" 
						id="closeButton"
					>
						close
					</button>
				</div>
				<div class="flex flex-col gap-y-4 overflow-hidden justify-between h-full">
					<div class="flex flex-col gap-y-4 overflow-hidden h-full">
						<h1 id="note-title${this.noteId}" class="font-bold text-2xl" data-id="${this.noteId}">
							${this.noteTitle}
						</h1>
						<h1 
							id="note-content${this.noteId}"
							data-id="${this.noteId}"
							class="font-light text-large focus:outline-none overflow-y-auto h-[75%]"
						>
							${this.content || '[Insert content here...]'}
						</h1>
					</div>
					<div id="buttons-container"></div>
				</div>
			`
			document.body.appendChild(modal);
			document.body.style.overflow = 'hidden'
			const mainPage = document.getElementById('main-page')
			setTimeout(() => {
				mainPage.style.marginRight = '0px'
			},0)

			const noteTitle = document.querySelector(`#note-title${this.noteId}`);
			noteTitle.addEventListener('click', (event)=>{
				editTitle(event)
			})
			const noteContent = document.querySelector(`#note-content${this.noteId}`)
			noteContent.classList.add('scrollable')
			noteContent.addEventListener('click', (event)=>{
				editContent(event)

			})

			modal.addEventListener('keydown', (event) => {
				if (event.key === 'Escape') {
					event.preventDefault(); 
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
					document.body.style.overflow = 'auto'
					if (mainPage.length != 0) mainPage.style.marginRight = '0px'
				}
			});

			document.startViewTransition(()=>modal.showModal());
			const closeButton = modal.querySelector('#closeButton');
			closeButton.addEventListener('click', () => {
				modal.close();
				document.body.style.overflow = 'auto'
				document.body.removeChild(modal)
				if (mainPage.length != 0) mainPage.style.marginRight = '0px'
			});
		})
		this.render()
	}

	async deleteName(event) {
		event.target.closest('card-component').remove();
		const id = event.target.getAttribute('data-id');
		const response = await fetch(`${serverURL}/list/${id}`, {
			method: 'DELETE',
			credentials: 'include'
		});
		if (response.ok) {
		} else {
			console.error('Failed to delete the name');
		}
		const list = document.getElementById('list')
		list.dispatchEvent(new CustomEvent('update-list', { bubbles: true }));
	}
	
	render() {
		this.innerHTML = `
			<div 
				id='card-${this.noteId}'
				class="flex flex-col justify-between w-full group cursor-pointer p-4 bg-white border-[0.5px]
					border-gray-900 rounded-lg gap-y-6 min-w-[280px] ${this.toggleOn ? '' : 'max-w-[520px]'} 
					${this.toggleOn ? 'h-[80px]' : 'h-[280px]'} transition-all"
			>
				<div class="flex flex-col gap-y-4 justify-start h-full ${this.toggleOn ? 'justify-center' : ''}">
					<div class="flex flex-row w-full justify-between">
						<div 
							id="title" 
							class="${this.toggleOn ? 'w-fit' : 'w-full'} name-item text-wrap hover:text-blue-600 cursor-pointer font-semibold text-lg" 
							data-id="${this.noteId}"
						>
							${this.noteTitle}
						</div>
						<div class="flex flex-row gap-x-4 ">
							<button 
								id="delete-button-2" 
								class="delete-button text-gray-300 w-fit self-center place-self-center cursor-pointer hover:text-red-600 text-sm 
									font-light transition-colors ${this.toggleOn ? '' : 'hidden'}" 
								data-id="${this.noteId}"
							>
								delete
							</button>
							<div 
								id="svg-handle"
								class="note-handle hover:cursor-grab active:cursor-grabbing ${this.toggleOn ? 'self-center' : ''}"
							>
								${svgHandle}
							</div>
						</div>
					</div>
					<div 
						id="content"
						class="w-full text-wrap  cursor-pointer font-light text-base line-clamp-6 ${this.toggleOn ? 'hidden' : 'block'}" 
						data-id="${this.noteId}"
					>
						${this.content}
					</div>
				</div>
				<button 
					id="delete-button" 
					class="delete-button text-gray-300 w-fit self-center cursor-pointer hover:text-red-600 text-sm font-light transition-colors
						${this.toggleOn ? 'hidden' : ''}" 
					data-id="${this.noteId}"
				>
					delete
				</button>
			</div>
		`
		this.addEventListener('click', (event) => {
				if (event.target.classList.contains('delete-button') || event.target.classList.contains('delete-button-2')) {
					openDeleteModal(()=>this.deleteName(event))
				} else if (event.target.classList.contains('name-item')) {
					editTitle(event);
				}
		});
		
	}
}

customElements.define('card-component', Card)
