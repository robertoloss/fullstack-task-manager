import { serverURL } from "../actions/server.js"
import { LoginPage } from "../components/LoginPage.js"
import { MainPage } from "../components/MainPage.js"
import ResetPwPage from "../components/ResetPwPage.js"
import { SignupPage } from "../components/SignupPage.js"

const Router = {
	init: () => {
		const initialLocation = location.href
		const origin = location.origin
		const path = initialLocation.substring(origin.length)

		window.addEventListener('popstate', event => {
			console.log("popstate")
			Router.go(event.state.route, false)
		});
		
		if (path === '/login') {
			const login = new LoginPage()
			document.body.appendChild(login)
		} else if  (path === '/signup') {
			const signup = new SignupPage()
			document.body.appendChild(signup)
		} else {
			Router.go(location.href)
		}
	},
	go: async (route, addToHistory=true) => {
		const origin = location.origin
		const sub = route.substring(origin.length).length
		if (route.length > 0 && sub < route.length && sub > 0)	{
			route = route.substring(origin.length)
		}
		const exceptions = ['/login','/signup','/reset-password']
		if (!exceptions.includes(route)) {
			const res = await fetch(`${serverURL}/auth/verify`, {
				mode: 'cors',
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
			})
			const data = await res.json()
			if (data.redirect) {
				console.log("redirecting to: ", data.redirect)
				window.location.href = data.redirect
				return
			}
		} 
		if (addToHistory) {
			history.pushState({ route },null,route)
			document.title = "Cool website"
		}
		function switchPage() {
			switch (origin + route) {
				case origin + '/':
					document.body.innerHTML = ''
					const main = new MainPage()
					document.body.appendChild(main)
					break
				case origin + '/signup':
					document.body.innerHTML = ''
					const signup = new SignupPage()
					document.body.appendChild(signup)
					break
				case origin + '/login':
					console.log("switch origin + route: ", origin + route)
					document.body.innerHTML = ''
					const login = new LoginPage()
					document.body.appendChild(login)
					break
				case origin + '/reset-password':
					document.body.innerHTML = ''
					const reset = new ResetPwPage()
					document.body.appendChild(reset)
					break
				default:
					document.body.innerHTML = ''
					const main2 = new MainPage()
					document.body.appendChild(main2)
					break
			}
		}
		if (document.startViewTransition) {
			document.startViewTransition(()=>switchPage())
		} else switchPage()
	}
}

export default Router;
