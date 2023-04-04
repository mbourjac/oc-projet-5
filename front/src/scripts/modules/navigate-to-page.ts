import { setPageUrl } from './set-page-url.js';

export function navigateToPage(page, parameters) {
  const newPageUrl = setPageUrl(page, parameters);

  window.location.assign(newPageUrl);
}
