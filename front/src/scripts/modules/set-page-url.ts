export function setPageUrl(page, parameters) {
  const baseUrl = new URL('/front/html/', window.location.href);
  const pageUrl = new URL(page, baseUrl);

  if (parameters) {
    for (const [key, value] of Object.entries(parameters)) {
      pageUrl.searchParams.set(key, value);
    }
  }

  return pageUrl;
}
