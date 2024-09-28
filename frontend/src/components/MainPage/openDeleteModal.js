import modalHtml from './delete-modal.html?raw'
import createModal from '../../utils/createModal'

export function openDeleteModal(deleteNote, noteTitle) {
	const modal = createModal({
		maxWidth: 'max-w-[calc(100vw-32px)] sm:max-w-[320px]',
		Height: 'h-fit',
		borderColor: 'border-black',
		borderWidth: 'border',
		modalHtml: modalHtml
	})
	const title = modal.querySelector('#delete-modal-title')
	title.innerHTML = ''
	title.innerHTML = `Are you sure you want to delete 
			${noteTitle ? 'the note titled ' + `"<span class="font-semibold">` + noteTitle + `</span>"`  + '?'
					: 'this note?'}`

	const cancelDeleteButton = document.getElementById('button-cancel-delete-note')
	const deleteButton = document.getElementById('button-delete-note')

	cancelDeleteButton.addEventListener('click', ()=>{
		modal.remove()
	})
	deleteButton.addEventListener('click',()=>{
		deleteNote()
		modal.remove()
	})
}

