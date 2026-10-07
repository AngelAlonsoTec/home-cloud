// Paths are always relative to the storage root and use "/" as separator,
// e.g. "" (root), "photos", "photos/2020"

/** Removes empty segments: "/photos//2020/" -> "photos/2020" */
export const normalizePath = (path = '') =>
  path.split('/').filter(Boolean).join('/');

export const joinPath = (dir, name) => (dir ? `${dir}/${name}` : name);

/** "photos/2020" -> [{ name: "photos", path: "photos" }, { name: "2020", path: "photos/2020" }] */
export const pathSegments = (path) =>
  path
    .split('/')
    .filter(Boolean)
    .map((name, i, names) => ({
      name,
      path: names.slice(0, i + 1).join('/'),
    }));

/** URL of the page that shows the content of a directory. */
export const browseUrl = (path) =>
  `/content/${path.split('/').map(encodeURIComponent).join('/')}`;
