
export default function useTailwind(root) {
	const link = document.createElement('link');
	link.setAttribute('rel', 'stylesheet');
	link.setAttribute('href', './output.css');
	root.appendChild(link)
}
