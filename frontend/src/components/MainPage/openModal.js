import modalHtml from './modal.html?raw'
import createModal from '../../utils/createModal'
import { serverURL } from '../../actions/server';

export function	openModal(addNoteToList, getList, toggleState) {
	const modal = createModal({
		maxWidth: 'max-w-[calc(100vw-32px)] sm:max-w-[600px]',
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
		//debugger
		console.log(JSON.stringify({
			newName, content, toggleState
		}))
		addNoteToList(newName, content, toggleState);
		form.reset();
		const modal = document.querySelector('#modal')
		modal?.close()
		app.modalIsOpen = false
		modal?.remove()
		const response = await fetch(`${serverURL}/list`, {
				method: 'POST',
				credentials: 'include',
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formObject)
		});
		if (response.ok) {
			getList();
		} else {
			console.error('Failed to add name');
			const firstItem = list.firstElementChild
			firstItem.remove()
			alert('An error occurred while saving your note')
		}
	});
}
