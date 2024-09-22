import { serverURL } from "../server"


export default async function login(email, password) {
	try {
		const response = await fetch(`${serverURL}/auth/login`, {
			method: 'POST',
			credentials: 'include',
			headers: { 
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify({ email: email, password: password})
		})
		if (response.ok) {
			app.router.go('/')
			return
		}
		return response
	} catch (error) {
		console.error("There was an error while trying to login the user: ", error)
		return error
	}
} 


