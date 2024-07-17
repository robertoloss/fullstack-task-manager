



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
		Router.go(location.href)
		window.addEventListener('popstate', event => {
			Router.go(event.state.route, false)
		});

	},
	go: (route, addToHistory=true) => {
		console.log(`Going to ${route}`)

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
			default:
				document.getElementById('list').removeAttribute('hidden')
				true
		}
	}
}

export default Router;
