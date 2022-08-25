/**
 * @param arr Array
 * @param item item to insert
 * @param index index at which to insert
 * @returns
 */
export function _arrayInsertAt<T>(arr: T[], item: T, index: number) {
  arr.splice(index, 0, item);
  return arr;
}

/**
 *
 * @param arr Array
 * @param index Index of the element to remove
 * @returns
 */
export function _arrayRemoveAt<T>(arr: T[], index: number) {
  arr.splice(index, 1);
  return arr;
}
