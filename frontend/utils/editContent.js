
const editContent = (event) => {
	console.log("edit content")
	const contentItem = event.target;
	const id = contentItem.getAttribute('data-id');
	const currentName = contentItem.innerHTML.replace(/<br\s*\/?>/gi, '\n').replace(/&nbsp;/g, ' ').trim();
	event.target.style.overflowY = 'hidden'
	document.body.style.overflow = 'hidden'
	
	let inputElement = document.querySelector(`#content-input${id}`)
	if (!inputElement) {
		console.log("creating an input")
		inputElement = document.createElement('textarea');
		inputElement.id = 'content-input${id}'
		//inputElement.rows = '20'
		inputElement.value = currentName;
		inputElement.style.resize = "none"
		inputElement.className = 'focus:outline-none bg-gray-50 w-full h-full scrollable'
//className="bg-gray-50"
	}

	contentItem.textContent = '';
	contentItem.appendChild(inputElement);
	contentItem.addEventListener('get-list', ()=> console.log("get list"))
	inputElement.focus();
	const updateNote = async (e) => {
		event.target.style.overflowY = 'auto'
		e.preventDefault();
		const newContent= inputElement.value.replace(/\n/g, '<br>').replace(/  /g, '&nbsp;&nbsp;');
		if (newContent !== currentName) {
			contentItem.innerHTML = ''
			contentItem.innerHTML = newContent;
			console.log("inputElement.value.: ", inputElement.value)
			try {
				const response = await fetch(`http://localhost:8090/list/${id}`, {
					method: 'PUT', 
					credentials: 'include',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ content: newContent })
				});
				if (!response.ok) {
					contentItem.innerHTML = ''
					contentItem.textContent = currentName;
					throw new Error('ERROR: Failed to update name');
				}
				document.querySelector('#main-page').dispatchEvent(new CustomEvent(
					'get-list',
					{ 'bubbles': true }
				))
			} catch (error) {
				console.error('Error updating content:', error);
			}
		} else {
			contentItem.innerHTML = ''
			contentItem.textContent = currentName;
		}
	};
	inputElement?.addEventListener('keydown', (e) => { 
		if (e.key === 'Escape') {
			e.preventDefault()
			updateNote(e)
		} 
	}) 
	inputElement?.addEventListener('keydown', (e) => { 
		console.log(e.key)
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        const cursorPos = inputElement.selectionStart;
        const textBefore = inputElement.value.substring(0, cursorPos);
        const textAfter = inputElement.value.substring(cursorPos);
        inputElement.value = textBefore + '\n' + textAfter;
        inputElement.setSelectionRange(cursorPos + 1, cursorPos + 1); // move cursor after the new line
    } else if (e.key === 'Enter') {
        e.preventDefault();
        updateNote(e);
    }
});
	inputElement?.addEventListener('blur', updateNote)
}

export default editContent
