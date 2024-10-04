
export default function	openModal({
	modalHtml,
	maxWidth,
	Height,
	borderWidth,
	borderColor
}) {
	const mainPage = document.getElementById('main-page');

	const modal = document.createElement('dialog')
	modal.id = "modal"
	modal.className = `${borderWidth} ${borderColor} ${Height} ${maxWidth} rounded-md p-6 w-full`
	modal.innerHTML =  modalHtml
	document.body.appendChild(modal);
	setTimeout(() => {
		mainPage.style.marginRight = '0px'
	},0)

	modal.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') {
			event.preventDefault(); 
			modal.remove();
			app.modalIsOpen = false
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
			app.modalIsOpen = false
		}
	});

	document.startViewTransition(()=>modal.showModal());
	const closeButton = modal.querySelector('#closeButton');
	closeButton?.addEventListener('click', () => {
		modal.remove()
		app.modalIsOpen = false
	});
	
	return modal
}

