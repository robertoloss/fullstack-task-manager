import { serverURL } from "../actions/server";


export default function checkInactivity(minutes) {
	let inactivityTimeout;
	const logoutTime = minutes * 60 * 1000; 
	
	async function logoutUser() {
		console.log("logging out...")
		const response = await fetch(`${serverURL}/auth/logout`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			mode: 'cors'
		})
		app.store.notes = null
		app.store.user = null
		console.log("response: ", response)
		console.log("response headers: ", response.headers)
		if (response.ok) {
			app.router.go('/login')
		}
	}
	
	function resetInactivityTimeout() {
		clearTimeout(inactivityTimeout);  
		inactivityTimeout = setTimeout(logoutUser, logoutTime); 
	}
	
	const activityEvents = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
	activityEvents.forEach(event => {
		document.addEventListener(event, resetInactivityTimeout);
	});

	resetInactivityTimeout();
}
