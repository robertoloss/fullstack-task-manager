import { reactive, html } from "@arrow-js/core";
import { dragAndDrop } from "@formkit/drag-and-drop";


export function renderList(names, toggle) {
	console.log("renderList -- names: ", names)
	console.log(!names || names.length === 0)
	console.log(list)
	
	const noNotes = document.getElementById('no-notes') 
	if (names.length > 0 && noNotes) {
		noNotes.remove()
	}

	list.innerHTML = ''
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

	if (!names || names.length === 0) {
		const id = document.createElement('id')
		id.id = 'no-notes'
		id.className = "text-lg font-light max-w-[320px] text-center bg-gray-50/60 rounded-lg border-black border mt-10 p-10 h-fit"
		id.innerHTML = "No notes to show. <br>Create a new note by pressing '+' or via the shortcut 'CTRL+n'."
		list.prepend(id)
		//list.prepend = `
		//	<h1 
		//		id='no-notes'
		//		class="text-lg font-light max-w-[320px] text-center bg-gray-50/60 rounded-lg border-black border mt-10 p-10 h-fit"
		//	>
		//		No notes to show. <br>Create a new note by pressing '+' or via the shortcut 'CTRL+n'.
		//	</h1>
		//`
	} else {
		dragAndDrop({
			parent: document.getElementById("dndNotes"),
			getValues: ()=>state.dndNames,
			setValues: (newValues) => {
				this.previousOrder = [...state.dndNames];
				this.newValues = newValues
				state.dndNames = reactive(newValues);
			},
			config: {
				dragHandle: '.note-handle',
				handleEnd: () => {
					this.saveOrder(this.newValues).catch(() => {
						state.dndNames = reactive(this.previousOrder);
						alert('Failed to update the order. Reverting to previous state.');
					});
					console.log(toggle)
				},
				plugins: [
					//animations(),
					//swap()
				],
				dropZoneClass: 'dragging'
			}
		})
	} 
}

