

export default async function login(email, password) {
	try {
		const response = await fetch('http://localhost:8090/auth/login', {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email: email, password: password})
		})
		if (response.ok) {
			app.router.go('/')
		}
	} catch (error) {
		console.error("There was an error while trying to login the user: ", error)
	}
} 


