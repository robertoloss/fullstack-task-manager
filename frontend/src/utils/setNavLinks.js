

export default function setNavLinks(component) {
	component.querySelectorAll('a.navlink').forEach(a => {
		a.addEventListener('click', e => {
			e.preventDefault()
			const url = a.href
			app.router.go(url)
		})
	})
}
