import { AsyncLocalStorage } from "node:async_hooks";

class Variables {
  /**
   * @type {AsyncLocalStorage<Map<string, unknown>>}
   */
  #store = new AsyncLocalStorage();
  /**
   * @template T
   * @param {() => T} callback
   * @returns {T}
   */
  createContext(callback) {
    const context = new Map();
    return this.#store.run(context, callback);
  }
  /**
   *
   * @param {string} variable
   * @param {unknown} value
   */
  set(variable, value) {
    const context = this.#store.getStore();
    context?.set(variable, value);
  }
  /**
   * @param {string} variable
   * @returns {unknown}
   */
  get(variable) {
    const context = this.#store.getStore();
    return context?.get(variable);
  }
}

export const variables = new Variables();
