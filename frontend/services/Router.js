import { LoginPage } from "../components/LoginPage.js"

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

		Router.go(location.href)
		window.addEventListener('popstate', event => {
			Router.go(event.state.route, false)
		});
		if (path === '/login') {
			document.querySelector('main').remove()
			//document.getElementById('header-bar').remove()
			console.log("Path is: login")	

			const login = new LoginPage()
			document.body.appendChild(login)

		}

	},
	go: async (route, addToHistory=true) => {
		console.log(`Going to ${route}`)
		
		const path = location.href.substring(location.origin.length)
		const exceptions = ['/login','/signup']
		if (!exceptions.includes(path)) {
			console.log('not an exception')
			const res = await fetch('http://localhost:8090/auth/verify', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
			})
			console.log("verification status: ", JSON.stringify(res))
		}
		console.log("here")
		
		if (addToHistory) {
			history.pushState({ route },null,route)
			console.log("added to history")
		}
		const origin = location.origin
		switch (route) {
			case origin + '/new-page':
				document.getElementById('list').setAttribute('hidden',true)
				console.log('here')
				break
			case origin + '/':
				document.getElementById('list').removeAttribute('hidden')
				const main = document.querySelector('main')
				//main.innerHTML = ""
				break
			default:
				true
		}
	}
}

export default Router;
