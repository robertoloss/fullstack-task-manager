
export class Card extends HTMLElement {
	constructor() {
		super()
	}
	connectedCallback() {
		this.nameId = this.dataset.id
		this.nameName = this.dataset.name
		this.render()
	}

	render() {
		console.log("rendering Card")
		this.addEventListener('click', (event) => {
				if (event.target.classList.contains('delete-button')) {
						deleteName(event);
				} else if (event.target.classList.contains('name-item')) {
						editName(event);
				}
		});
		async function deleteName(event) {
			const savedList = list.innerHTML
			event.target.closest('card-component').remove();
			const id = event.target.getAttribute('data-id');
			console.log(`Deleting ${id}`)
			const response = await fetch(`http://localhost:8090/list/${id}`, {
				method: 'DELETE',
				credentials: 'include'
			});
			if (response.ok) {
				this.parentElement["renderList"]
			} else {
					console.error('Failed to delete the name');
					list.innerHTML = savedList
			}
		}
		function editName(event) {
			const nameItem = event.target;
			const currentName = nameItem.textContent.trim();
			const inputElement = document.createElement('input');
			inputElement.type = 'text';
			inputElement.value = currentName;
			nameItem.textContent = '';
			nameItem.appendChild(inputElement);
			inputElement.focus();
			inputElement?.addEventListener('keypress', async (e) => {
				if (e.key === 'Enter') {
					e.preventDefault();
					const newName = inputElement.value.trim();
					if (newName !== currentName) {
						nameItem.textContent = newName;
						try {
							const id = nameItem.getAttribute('data-id');
							const response = await fetch(`http://localhost:8090/list/${id}`, {
								method: 'PUT', 
								credentials: 'include',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({ name: newName })
							});
							if (!response.ok) {
									nameItem.textContent = currentName;
									throw new Error('ERROR: Failed to update name');
							}
							getList()
						} catch (error) {
							console.error('Error updating name:', error);
						}
					} else {
						nameItem.textContent = currentName;
					}
				}
			});
			inputElement?.addEventListener('blur', () => {
					nameItem.textContent = currentName;
			});
		}
		this.innerHTML = `<div 
				class="flex flex-row justify-between w-full group hover:bg-yellow-50
					border border-blue-950 p-4 bg-slate-200 rounded-lg transition "
			>
				<div class="name-item hover:text-blue-600 cursor-pointer" data-id="${this.nameId}">
					${this.nameName}
				</div>
				<button class="delete-button text-gray-300 cursor-pointer hover:text-red-600" data-id="${this.nameId}">
					Delete
				</button>
			</div>`
	}

}

customElements.define('card-component', Card)
