import modalHtml from './modal.html?raw'
import createModal from '../../utils/createModal'

export function	openModal(addNoteToList, getList) {
	const modal = createModal({
		maxWidth: 'max-w-[600px]',
		Height: 'h-full max-h-[600px]',
		borderColor: 'border-black',
		borderWidth: 'border',
		modalHtml: modalHtml
	})
	setTimeout(() => {
		const newName = document.querySelector('#new-name');
		newName.focus();
	}, 10);
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
			modal?.close()
			app.modalIsOpen = false
			modal?.remove()
		} else {
			console.error('Failed to add name');
			const firstItem = list.firstElementChild
			firstItem.remove()
			const modal = document.querySelector('#modal')
			modal?.close()
			app.modalIsOpen = false
			modal?.remove()
		}
	});
}
