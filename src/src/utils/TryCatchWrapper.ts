import LOG from "./Logger";

/**
 * Generic function that accepts any number of parameters.
 */
type GenericFunction = (...args: any[]) => any;

/**
 * Can be used to wrap a function within a function with the
 * same signature.
 *
 * @param F - Function that should be wrapped.
 */
type TryCatchWrapper<F extends GenericFunction> = (
  ...args: Parameters<F>
) => ReturnType<F> | Promise<ReturnType<F>>;

/**
 * Wraps a function within a try/catch block to catch any
 * unhandled error.
 *
 * @param func - Function that should be wrapped.
 */
export function tryCatchWrapper<F extends GenericFunction>(
  func: F,
  objectName?: string,
): TryCatchWrapper<F> {
  return async function (...args) {
    try {
      return await func(...args);
    } catch (error) {
      LOG.error(`${objectName ? objectName + " - " : ""}${func.name}:`, error);
      throw error;
    }
  };
}

/**
 * Wraps all functions within an object with a try/catch block
 * to catch any unhandled error.
 * @param object - Object that should be wrapped.
 * @param objectName - Name of the object.
 * @returns Wrapped object.
 * @example
 * const UserApiV2 = {
 *  async getCurrentUser() {
 *    const response = await axiosClient.get<UserProfileModel>("/api/users/me");
 *    return response.data;
 *   },
 * };
 * TryCatchWrapper(UserApiV2, "UserApiV2");
 */
export default function TryCatchWrapper<T extends object>(
  object: T,
  objectName?: string,
): T {
  const wrappedObject = { ...object } as T;
  for (const key of Object.keys(wrappedObject)) {
    const method = object[key];
    if (typeof method === "function") {
      wrappedObject[key] = tryCatchWrapper(method, objectName);
    }
  }

  return wrappedObject;
}
