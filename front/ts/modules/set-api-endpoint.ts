export function setApiEndpoint(resourcePath) {
	const baseUrl = new URL('http://localhost:3000/api/');

	return new URL(resourcePath, baseUrl);
}
