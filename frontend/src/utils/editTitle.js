

const editTitle = (event) => {
	console.log(event.target)
	const nameItem = event.target;
	const currentName = nameItem.textContent.trim();

	let inputElement = document.querySelector('#title-input')

	if (!inputElement) {
		inputElement = document.createElement('input');
		inputElement.type = 'text';
		inputElement.id = 'title-input'
		inputElement.value = currentName;
		inputElement.className = 'focus:outline-none bg-gray-50 w-full'
	}

	nameItem.textContent = '';
	nameItem.appendChild(inputElement);
	nameItem.addEventListener('get-list', ()=> console.log("get list"))
	inputElement.focus();
	const updateNote = async (e) => {
		e.preventDefault();
		const newName = inputElement.value.trim();
		if (newName !== currentName) {
			nameItem.innerHTML = ''
			nameItem.textContent = newName;
			try {
				const id = nameItem.getAttribute('data-id');
				const response = await fetch(`https://localhost:8090/list/${id}`, {
					method: 'PUT', 
					credentials: 'include',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ title: newName })
				});
				if (!response.ok) {
					nameItem.innerHTML = ''
					nameItem.textContent = currentName;
					throw new Error('ERROR: Failed to update name');
				}
				document.querySelector('#main-page').dispatchEvent(new CustomEvent(
					'get-list',
					{ 'bubbles': true }
				))
			} catch (error) {
				console.error('Error updating name:', error);
			}
		} else {
			nameItem.innerHTML = ''
			nameItem.textContent = currentName;
		}
	};
	inputElement?.addEventListener('keypress', (e) => { if (e.key === 'Enter') updateNote(e) }) 
	inputElement?.addEventListener('blur', updateNote)
}

export default editTitle
