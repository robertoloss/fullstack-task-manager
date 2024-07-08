

const list = document.getElementById('list')
const form = document.getElementById('add-name-form')
const signupForm = document.getElementById('signup-form')

signupForm.addEventListener('submit', async (event) => {
	event.preventDefault();
	const { email, password } = Object.fromEntries(new FormData(signupForm))
	
	const response = await fetch('http://localhost:8090/auth/register', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email: email, password: password })
	})
	if (response.ok) {
		form.reset
	} else {
		console.error("There was an error while creating the user")
	}
})

async function getList() {
	const response = await fetch('http://localhost:8090/list');
	const names = await response.json()
	renderList(names)
}

function renderList(names) {
	list.innerHTML = names.map(name => `
		<div class="flex flex-row justify-between w-full group hover:bg-yellow-100">
			<div class="name-item group-hover:text-blue-600" data-id="${name.id}">
				${name.name}
			</div>
			<button class="delete-button text-gray-300 cursor-pointer hover:text-red-600" data-id="${name.id}">
				Delete
			</button>
		</div>
	`).join('')
}

list.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-button')) {
        deleteName(event);
    } else if (event.target.classList.contains('name-item')) {
        editName(event);
    }
});



form.addEventListener('submit', async (event) => {
	event.preventDefault();
	const formObject = Object.fromEntries(new FormData(form))
	console.log("formObject: ", formObject)
	const { name: newName } = formObject;
	console.log("name: ", newName)
	addNameToList(newName);
	const response = await fetch(form.action, {
			method: 'POST',
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
	const newDiv = document.createElement('div')
	newDiv.className = "flex flex-row justify-between w-full group hover:bg-yellow-100";
	newDiv.innerHTML = `
		<div class="name-item group-hover:text-blue-600" data-id="${name.id}">
			${name}
		</div>
			<button class="delete-button text-gray-300 cursor-pointer hover:text-red-600" data-id="${name.id}">
					Delete
		</button>
	`;
	list.prepend(newDiv);
}


async function deleteName(event) {
	const savedList = list.innerHTML
	event.target.parentElement.remove();
	const id = event.target.getAttribute('data-id');
	console.log(`Deleting ${id}`)
	const response = await fetch(`http://localhost:8090/list/${id}`, {
			method: 'DELETE'
	});
	if (response.ok) {
	} else {
			console.error('Failed to delete the name');
			list.innerHTML = savedList
	}
}

getList()

document.querySelector('iframe').onload = function() {
	location.reload();
};


const testDiv = document.getElementById('test')
let show = false;


function renderTestDiv() {
	test.innerHTML = `
		${!show ? `
			<div>Hello</div>
		` : `
			<div>World!</div>
		`}	
	`
}

renderTestDiv();

const button = document.getElementById('testButton');

button.addEventListener('click', ()=>{
	show = !show;
	console.log("show: ", show)
	renderTestDiv()
})


function editName(event) {
    const nameItem = event.target;
    const currentName = nameItem.textContent.trim();

    // Create an input element
    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.value = currentName;

    // Replace the text with the input field
    nameItem.textContent = '';
    nameItem.appendChild(inputElement);

    // Focus the input field
    inputElement.focus();

    // Handle key press events on the input field
    inputElement.addEventListener('keypress', async (e) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				const newName = inputElement.value.trim();
				if (newName !== currentName) {
					nameItem.textContent = newName;
					try {
						const id = nameItem.getAttribute('data-id');
						const response = await fetch(`http://localhost:8090/list/${id}`, {
							method: 'PUT', 
							headers: {
									'Content-Type': 'application/json'
							},
							body: JSON.stringify({ name: newName })
						});
						if (!response.ok) {
								nameItem.textContent = currentName;
								throw new Error('ERROR: Failed to update name');
						}
						getList()
					} catch (error) {
						console.error('Error updating name:', error);
					}
				} else {
					nameItem.textContent = currentName;
				}
			}
    });

    // Remove the input element on blur (if not pressing Enter)
    inputElement.addEventListener('blur', () => {
        nameItem.textContent = currentName;
    });
}

