import modalHtml from './modal.html?raw'

export function	openModal(addNoteToList, getList) {
	const mainPage = document.getElementById('main-page');

	const modal = document.createElement('dialog')
	modal.className = `border border-black rounded-md p-6 w-full max-w-[600px] h-full max-h-[600px]`
	modal.id = 'modal'
	modal.innerHTML =  modalHtml
	document.body.appendChild(modal);
	setTimeout(() => {
		mainPage.style.marginRight = '0px'
	},5000)


	setTimeout(() => {
		const newName = document.querySelector('#new-name');
		newName.focus();
	}, 10);

	modal.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') {
			event.preventDefault(); 
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
			modal.close()
			modal.remove()
		}
	});

	document.startViewTransition(()=>modal.showModal());
	const closeButton = modal.querySelector('#closeButton');
	closeButton.addEventListener('click', () => {
			modal.remove()
	});

	const form = document.getElementById('add-name-form')
	
	form.addEventListener('submit', async (event) => {
		event.preventDefault()
	})

	const submitButton = modal.querySelector('#new-note-button');

	submitButton.addEventListener('click', async (event) => {
		event.preventDefault();
		const formObject = Object.fromEntries(new FormData(form))
		const { name: newName, content } = formObject;
		addNoteToList(newName, content);
		const response = await fetch('https://localhost:8090/list', {
				method: 'POST',
				credentials: 'include',
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formObject)
		});
		if (response.ok) {
			form.reset();
			getList();
			const modal = document.querySelector('#modal')
			modal.close()
			modal.remove()
		} else {
			console.error('Failed to add name');
			const firstItem = list.firstElementChild
			firstItem.remove()
			const modal = document.querySelector('#modal')
			modal.close()
			modal.remove()
		}
	});
}
