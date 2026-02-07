/**
 * Se ejecuta una vez al iniciar el servidor Next.js.
 * Asegura que en Node (y en entornos con --localstorage-file roto)
 * exista un localStorage con getItem/setItem válidos para evitar
 * "TypeError: localStorage.getItem is not a function".
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const g = globalThis as typeof globalThis & { localStorage?: Storage };
  const current = g.localStorage;

  const isBroken =
    current != null &&
    (typeof current.getItem !== "function" ||
      typeof current.setItem !== "function");

  if (typeof current === "undefined" || isBroken) {
    const noop = () => {};
    g.localStorage = {
      getItem: () => null,
      setItem: noop,
      removeItem: noop,
      clear: noop,
      key: () => null,
      get length() {
        return 0;
      },
    };
  }
}
