import { LoginPage } from "../components/LoginPage.js"
import { MainPage } from "../components/MainPage.js"

const Router = {
	init: () => {
		document.querySelectorAll('a.navlink').forEach(a => {
			a.addEventListener('click', e => {
				e.preventDefault()
				const url = a.href
				console.log("Url from listener: ", url)
				// const url2 = a.getAttribute("href")
				Router.go(url)
			})
		})
		const initialLocation = location.href
		const origin = location.origin
		const path = initialLocation.substring(origin.length)
		console.log("initial location: ", location.href)
		console.log("path: ", path)

		window.addEventListener('popstate', event => {
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
		}
		console.log("here")
		
		if (addToHistory) {
			history.pushState({ route },null,route)
			console.log("added to history")
		}
		const origin = location.origin
		switch (route) {
			case origin + '/':
				console.log("Router: we are at /")
				document.body.innerHTML = ''
				const main = new MainPage()
				document.body.appendChild(main)
				break
			case origin + '/login':
				console.log("rerouted to /login")
				//document.querySelector('main').remove()
				const login = new LoginPage()
				document.body.appendChild(login)
			default:
				console.log("Router: we are at /")
				document.body.innerHTML = ''
				const main2 = new MainPage()
				document.body.appendChild(main2)
				break
		}
	}
}

export default Router;
