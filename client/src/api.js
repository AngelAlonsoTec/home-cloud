const UNAUTHORIZED = 401;

let onUnauthorized = () => {};

/** Called whenever the session expires or is not valid anymore. */
export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

const toBody = (data) => {
  if (data === undefined || data instanceof FormData) {
    return { body: data };
  }
  return {
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  };
};

const withPath = (url, path) => `${url}?path=${encodeURIComponent(path)}`;

/** Every call resolves to { success, message, ...data }, it never throws. */
const request = async (method, url, data) => {
  try {
    const response = await fetch(`/api${url}`, { method, ...toBody(data) });
    if (response.status === UNAUTHORIZED && !url.startsWith('/auth')) {
      onUnauthorized();
    }
    return await response.json();
  } catch {
    return { success: false, message: 'Could not reach the server' };
  }
};

const filesToFormData = (files) => {
  const data = new FormData();
  Array.from(files).forEach((file) => data.append('file', file));
  return data;
};

const api = {
  login: (password) => request('POST', '/auth/login', { password }),
  logout: () => request('POST', '/auth/logout'),
  checkSession: () => request('GET', '/auth/session'),
  getContent: (path) => request('GET', withPath('/content', path)),
  mkDir: (path, name) => request('POST', withPath('/dir', path), { name }),
  uploadFiles: (path, files) =>
    request('POST', withPath('/upload', path), filesToFormData(files)),
  // Downloads are plain links: the browser streams the file and sends the
  // session cookie by itself
  downloadUrl: (path) => `/api${withPath('/download', path)}`,
};

export default api;
