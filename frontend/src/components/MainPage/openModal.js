import modalHtml from './modal.html?raw'
import createModal from '../../utils/createModal'
import { serverURL } from '../../actions/server';

export function	openModal(addNoteToList, getList, toggleState) {
	console.log(app.setIgnore)
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
		app.setIgnore(true)
		let ignore = false;
		app.setIgnore = (bool)=>{
			if (bool) ignore = bool
		}
		event.preventDefault();
		const formObject = Object.fromEntries(new FormData(form))
		const { name: newName, content } = formObject;
		//debugger
		console.log(JSON.stringify({
			newName, content, toggleState
		}))
		const noNotes = document.getElementById('no-notes');
		noNotes?.remove()
		const info = document.getElementById('info-h1');
		const mainContainer = document.querySelector('#main-container')
		if (!info) {
			const infoH1 = document.createElement('h1')
			infoH1.id = 'info-h1'
			infoH1.classList = 'px-4 py-5 min-h-[96px] text-sm text-gray-600 text-center font-light'
			infoH1.innerHTML = `
				To create a new note press the + button below or use the shortcut 'CTRL+n'
			`
			mainContainer.prepend(infoH1)
		}
		addNoteToList(newName, content, toggleState);
		form.reset();
		const modal = document.getElementById('modal')
		modal?.close()
		app.modalIsOpen = false
		modal?.remove()
		const response = await fetch(`${serverURL}/list`, {
				method: 'POST',
				credentials: 'include',
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formObject)
		});
		if (response.ok && !ignore) {
			getList(null, ignore);
		} else {
			console.error('Failed to add name');
			const firstItem = list.firstElementChild
			firstItem.remove()
			alert('An error occurred while saving your note')
		}
	});
}
