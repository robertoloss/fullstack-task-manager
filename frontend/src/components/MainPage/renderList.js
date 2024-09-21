import { reactive, html } from "@arrow-js/core";
import { dragAndDrop } from "@formkit/drag-and-drop";


export function renderList(names, toggle) {
	console.log("renderList - toggle: ", toggle)
		if (names.length === 0) {
			list.innerHTML = '<h1>No notes yet</h1>'
		} else {
			list.innerHTML = ''
			const state = reactive({
				dndNames: names.sort((a,b)=>a.position - b.position)
			})
			html`
				<ul 
					id="dndNotes" 
					class="${!toggle
										? "w-full grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 h-fit"
										: "w-full max-w-[800px] grid grid-cols-1 gap-4 h-fit" 
					}"
				>
					${()=>
							state.dndNames.map((name) => {
								console.log("toggle in dnd render: ", toggle)
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

