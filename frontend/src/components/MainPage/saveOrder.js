

export async function saveOrder(updatedNotes) {
	const newNotes = JSON.parse(JSON.stringify(updatedNotes))

	if (!Array.isArray(newNotes)) throw new Error("No array found")

	newNotes.forEach((note, i) => note.position = i+1)

	try {
		const response = await fetch('https://localhost:8090/update-notes-order', {
			credentials: 'include',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ notes: newNotes })
		})
		if (!response.ok) {
			throw new Error("failed to update the order")
		} 
		this.getList()

	} catch(error) {
		console.error(error)
		throw error
	}
}
