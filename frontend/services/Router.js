import { LoginPage } from "../components/LoginPage.js"
import { MainPage } from "../components/MainPage.js"
import { SignupPage } from "../components/SignupPage.js"

const Router = {
	init: () => {
		const initialLocation = location.href
		const origin = location.origin
		const path = initialLocation.substring(origin.length)
		console.log("initial location: ", location.href)
		console.log("path: ", path)

		window.addEventListener('popstate', event => {
			console.log("popstate")
			Router.go(event.state.route, false)
		});
		
		if (path === '/login') {
			const login = new LoginPage()
			document.body.appendChild(login)
		} else {
			Router.go(location.href)
		}
	},
	go: async (route, addToHistory=true) => {
		console.log(`Going to ${route}`)
		const origin = location.origin
		console.log('route - origin: ', route.substring(origin.length).length - route.length)
		console.log("route: ", route)
		console.log("route_substring_etc: ", route.substring(origin.length).length )
		const sub = route.substring(origin.length).length
		if (route.length > 0 && sub < route.length && sub > 0)	{
			route = route.substring(origin.length)
			console.log("changed route to: ", route)
		}
		const exceptions = ['/login','/signup']
		if (!exceptions.includes(route)) {
			console.log('not an exception')
			const res = await fetch('http://localhost:8090/auth/verify', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
			})
			const data = await res.json()
			if (data.redirect) {
				console.log("redirecting client-side")
				window.location.href = data.redirect
				return
			}
			console.log("verification status: ", JSON.stringify(res))
		} else {
			console.log("either /login or /signup")
		}
		if (addToHistory) {
			history.pushState({ route },null,route)
			console.log("added to history:", route)
		}
		console.log("origin: ", origin)
		console.log("origin + route", origin + route)
		switch (origin + route) {
			case origin + '/':
				console.log("route in first case:", route)
				console.log("Router: we are at /")
				document.body.innerHTML = ''
				const main = new MainPage()
				document.body.appendChild(main)
				break
			case origin + '/signup':
				console.log("rerouted to /signup")
				document.body.innerHTML = ''
				const signup = new SignupPage()
				document.body.appendChild(signup)
				break
			case origin + '/login':
				console.log("rerouted to /login")
				document.body.innerHTML = ''
				const login = new LoginPage()
				document.body.appendChild(login)
				break
			default:
				console.log("Router: we are at:", route)
				document.body.innerHTML = ''
				const main2 = new MainPage()
				document.body.appendChild(main2)
				break
		}
	}
}

export default Router;
