
export default async function sendEmail(email) {
	console.warn("Sending email!")
	const response = await fetch('/auth-code/create', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			email
		})
	})
	console.log(response)
	return response
}