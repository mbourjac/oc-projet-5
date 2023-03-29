export function getUrlParameter(parameter) {
	const currentUrl = new URL(document.location);

	return currentUrl.searchParams.get(parameter);
}
