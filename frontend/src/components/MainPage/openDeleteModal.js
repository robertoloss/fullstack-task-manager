import modalHtml from './delete-modal.html?raw'
import createModal from '../../utils/createModal'

export function openDeleteModal(deleteNote) {
	const modal = createModal({
		maxWidth: 'max-w-[400px]',
		Height: 'h-fit',
		borderColor: 'border-red-600',
		borderWidth: 'border-2',
		modalHtml: modalHtml
	})

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
