export default function debounce(callback, timeout = 400) {
  let cleanup;

  return (...args) => {
    crearTimeout(cleanup);
    cleanup = setTimeout(callback.bind(null, ...args), timeout);
  };
}
