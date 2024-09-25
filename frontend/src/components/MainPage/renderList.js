import { reactive, html } from "@arrow-js/core";
import { dragAndDrop, handleEnd } from "@formkit/drag-and-drop";
import { custom } from "zod";


export function renderList(names, toggle) {
	const list = document.getElementById('list')	

	const noNotes = document.getElementById('no-notes') 
	if (names.length > 0) {
		const eventNotes =  new CustomEvent('there-are-notes')
		document.dispatchEvent(eventNotes)
		if (noNotes) {
			noNotes.remove()
		}
	}

	if (list) list.innerHTML = ''
	const state = reactive({
		dndNames: names.sort((a,b)=>a.position - b.position)
	})
	html`
		<ul 
			id="dndNotes" 
			class="${!toggle
								? "w-full grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 h-fit"
								: "w-full max-w-[800px] grid grid-cols-1 gap-2 h-fit" 
			}"
		>
			${()=>
					state.dndNames.map((name) => {
						return html`
							<card-component 
								data-id="${name.id}"
								data-name="${name.title}"
								data-content="${name.content}"
								data-toggleon="${JSON.stringify(toggle)}"
							>
							</card-component>
						`
					}
			)}
		</ul>
	`(document.getElementById('list'))

	const listEvent = new CustomEvent('list-rendered')
	document.dispatchEvent(listEvent)

	if (!names || names.length === 0) {
		const eventNoNotes = new CustomEvent('there-are-no-notes')
		document.dispatchEvent(eventNoNotes)
		const id = document.createElement('id')
		id.id = 'no-notes'
		id.className = "text-lg font-light max-w-[320px] text-center bg-gray-50/60 rounded-lg border-black border mt-10 p-10 h-fit"
		id.innerHTML = "No notes to show. <br>Create a new note by pressing '+' or via the shortcut 'CTRL+n'."
		list.prepend(id)
	} else {
		const mainPage = document.getElementById('main-main-page')
		dragAndDrop({
			parent: document.getElementById("dndNotes"),
			getValues: ()=>state.dndNames,
			setValues: (newValues) => {
				mainPage.previousOrder = [...state.dndNames];
				mainPage.newValues = newValues
				state.dndNames = reactive(newValues);
			},
			config: {
				dragHandle: '.note-handle',
				handleEnd: (data) => {
					state.dndNames = reactive([...mainPage.newValues]);
					const starEvent = new CustomEvent('start-saving-order')
					document.dispatchEvent(starEvent)
					mainPage.saveOrder(mainPage.newValues).catch(() => {
						state.dndNames = reactive(mainPage.previousOrder);
						alert('Failed to update the order. Reverting to previous state.');
					});
					const endEvent = new CustomEvent('end-saving-order')
					document.dispatchEvent(endEvent)
					const draggingElements = document.querySelectorAll('.dragging');
					draggingElements.forEach(el => el.classList.remove('dragging'));
					handleEnd(data)
				},
				plugins: toggle ? [ 
					//
				] : [
					//
				],
				dropZoneClass: 'dragging',
			}
		})
	} 
}

