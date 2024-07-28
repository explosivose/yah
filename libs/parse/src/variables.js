import { AsyncLocalStorage } from "node:async_hooks";
import parentLogger from "@yah/logger";
import _ from "lodash";

const logger = parentLogger.child({ name: "variables" });

class Variables {
  /**
   * @type {AsyncLocalStorage<Map<string, unknown>>}
   */
  #store = new AsyncLocalStorage();
  /**
   * @template T
   * @param {() => T | Promise<T>} callback
   * @returns {T | Promise<T>}
   */
  createContext(callback) {
    const context = new Map();
    return this.#store.run(context, callback);
  }
  /**
   * @param {string} variable
   * @param {unknown} value
   */
  set(variable, value) {
    const context = this.#store.getStore();
    context?.set(variable, value);
  }
  /**
   * @param {string} variable
   * @param {unknown} value
   */
  put(variable, value) {
    const context = this.#store.getStore();
    const path = variable.split(".");
    const retrieved = context?.get(path[0]);
    _.merge(retrieved, value);
    context?.set(path[0], retrieved);
  }
  /**
   * @param {string} variable
   * @returns {unknown}
   */
  get(variable) {
    const context = this.#store.getStore();
    const path = variable.split(".");
    const retrieved = context?.get(path[0]);
    return _.get(retrieved, path.slice(1));
  }
  /**
   * @returns {Record<string, unknown>}
   */
  getAll() {
    const context = this.#store.getStore();
    /**
     * @type Record<string, unknown>
     */
    const data = {};
    for (const key of context?.keys() || []) {
      data[key] = context?.get(key);
    }
    return data;
  }
}

export const variables = new Variables();
