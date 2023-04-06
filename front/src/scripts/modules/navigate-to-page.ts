import { setPageUrl } from './set-page-url';

export function navigateToPage(
  page: string,
  parameters?: { [key: string]: string }
): void {
  const newPageUrl = setPageUrl(page, parameters);

  window.location.assign(newPageUrl);
}
