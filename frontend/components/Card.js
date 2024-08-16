
export class Card extends HTMLElement {
	constructor() {
		super()
	}
	connectedCallback() {
		this.nameId = this.dataset.id
		this.nameName = this.dataset.name
		this.content = this.dataset.content
		this.render()
	}

	async deleteName(event) {
		event.target.closest('card-component').remove();
		const id = event.target.getAttribute('data-id');
		const response = await fetch(`http://localhost:8090/list/${id}`, {
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
		this.addEventListener('click', (event) => {
				if (event.target.classList.contains('delete-button')) {
						this.deleteName(event);
				} else if (event.target.classList.contains('name-item')) {
						editName(event);
				}
		});
		const editName = (event) => {
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
							this.dispatchEvent(new CustomEvent(
								'get-list',
								{ 'bubbles' : true }
							))
							//getList()
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
		this.innerHTML = `
			<div class="flex flex-col justify-between w-full group hover:bg-yellow-50
					 p-4 bg-white shadow shadow-gray-700 rounded-lg transition gap-y-6 min-w-[280px]
					 h-[280px]"
			>
				<div class="flex flex-col gap-y-4 justify-start">
					<div class="name-item w-full text-wrap hover:text-blue-600 cursor-pointer font-semibold text-lg" 
						data-id="${this.nameId}"
					>
						${this.nameName}
					</div>
					<div class="name-item w-full text-wrap hover:text-blue-600 cursor-pointer font-light text-base" 
						data-id="${this.nameId}">
						${this.content}
					</div>
				</div>
				<button class="delete-button text-gray-300 cursor-pointer hover:text-red-600" data-id="${this.nameId}">
					Delete
				</button>
			</div>
		`
	}

}

customElements.define('card-component', Card)
