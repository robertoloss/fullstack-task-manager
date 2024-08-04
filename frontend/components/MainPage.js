

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
		this.style.width= '100%'
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
			const { names  } = await response.json()
			list.innerHTML = ''
			renderList(names)
		}

		function renderList(names) {
			if (names.length === 0) {
				list.innerHTML = '<h1>No names yet</h1>'
			} else {
				list.innerHTML = names.map(name => `
					<card-component 
						data-id="${name.id}"
						data-name="${name.name}"
					>
					</card-component>
				`).join('')
			}
		}


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

			const card = document.createElement('card-component');
			card.setAttribute('data-id', name.id);
			card.setAttribute('data-name', name);

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
