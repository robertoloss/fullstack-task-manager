

export class MainPage extends HTMLElement {
	constructor() {
		super()
	}

	connectedCallback() {
		const template = document.getElementById('main-page')
		const content = template.content.cloneNode(true)
		this.appendChild(content)
		this.render()
	}

	render() {
		const logOutButton = this.querySelector('#log-out')
		const list = this.querySelector('#list')
		const form = this.querySelector('#add-name-form')
		const displayUser = this.querySelector('#display-current-user')

		getList()
		getUser()

		logOutButton?.addEventListener('click', async (e) => {
			console.log('logging out...')
			e.preventDefault()
			const response = await fetch('/auth/logout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			})
			if (response.ok) {
				console.log("logged out successfully")
				app.router.go('/login')
			}
		})

		async function getUser() {
			try {
				const user = await getCurrentUser()
				console.log("")
				displayUser.innerHTML = ''
				displayUser.innerHTML = `${user}`	
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

		async function getList() {
			const response = await fetch('http://localhost:8090/list', {
				method: 'GET',
				credentials: 'include'	
			});
			const { names, user } = await response.json()
			renderList(names)
		}

		function renderList(names) {
			list.innerHTML = names.map(name => `
				<div class="flex flex-row justify-between w-full group hover:bg-yellow-100">
					<div class="name-item hover:text-blue-600 cursor-pointer" data-id="${name.id}">
						${name.name}
					</div>
					<button class="delete-button text-gray-300 cursor-pointer hover:text-red-600" data-id="${name.id}">
						Delete
					</button>
				</div>
			`).join('')
		}

		list?.addEventListener('click', (event) => {
				if (event.target.classList.contains('delete-button')) {
						deleteName(event);
				} else if (event.target.classList.contains('name-item')) {
						editName(event);
				}
		});

		form?.addEventListener('submit', async (event) => {
			event.preventDefault();
			const formObject = Object.fromEntries(new FormData(form))
			console.log("formObject: ", formObject)
			const { name: newName } = formObject;
			console.log("name: ", newName)
			addNameToList(newName);
			const response = await fetch(form.action, {
					method: 'POST',
					credentials: 'include',
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(formObject)
			});
			if (response.ok) {
				form.reset();
				getList();
			} else {
				console.error('Failed to add name');
				const firstItem = list.firstElementChild
				firstItem.remove()
			}
		});

		function addNameToList(name) {
			console.log(`Adding name (=${name}) to list...`)
			const newDiv = document.createElement('div')
			newDiv.className = "flex flex-row justify-between w-full group hover:bg-yellow-100";
			newDiv.innerHTML = `
				<div class="name-item group-hover:text-blue-600" data-id="${name.id}">
					${name}
				</div>
					<button class="delete-button text-gray-300 cursor-pointer hover:text-red-600" data-id="${name.id}">
							Delete
				</button>
			`;
			list.prepend(newDiv);
		}


		async function deleteName(event) {
			const savedList = list.innerHTML
			event.target.parentElement.remove();
			const id = event.target.getAttribute('data-id');
			console.log(`Deleting ${id}`)
			const response = await fetch(`http://localhost:8090/list/${id}`, {
				method: 'DELETE',
				credentials: 'include'
			});
			if (response.ok) {
			} else {
					console.error('Failed to delete the name');
					list.innerHTML = savedList
			}
		}

		//async function deleteUser(event) {
		//	const id = event.target.getAttribute('data-id')
		//	const response = await fetch(`http://localhost:8090/users/${id}`,{
		//		method: 'DELETE'
		//	})
		//	if (response.ok) {
		//	} else {
		//		console.error("Failed to delete user");
		//		console.log("response: ", response)
		//	}
		//}


		const iFrame = document.querySelector('iframe');
		if (iFrame) {
			iFrame.onload = function() {
				location.reload();
			};
		}


		const testDiv = this.querySelector('#test')
		let show = false;


		function renderTestDiv() {
			if (testDiv) {
				test.innerHTML = `
					${!show ? `
						<div>Hello</div>
					` : `
						<div>World!</div>
					`}	
				`
			}
		}

		renderTestDiv();

		const button = this.querySelector('#testButton');
		button?.addEventListener('click', ()=> console.log('alskdjfhaskld'))

		button?.addEventListener('click', ()=>{
			show = !show;
			renderTestDiv()
		})


		function editName(event) {
				const nameItem = event.target;
				const currentName = nameItem.textContent.trim();

				// Create an input element
				const inputElement = document.createElement('input');
				inputElement.type = 'text';
				inputElement.value = currentName;

				// Replace the text with the input field
				nameItem.textContent = '';
				nameItem.appendChild(inputElement);

				// Focus the input field
				inputElement.focus();

				// Handle key press events on the input field
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

				// Remove the input element on blur (if not pressing Enter)
				inputElement?.addEventListener('blur', () => {
						nameItem.textContent = currentName;
				});
		}
	}
}

customElements.define('main-page', MainPage)
