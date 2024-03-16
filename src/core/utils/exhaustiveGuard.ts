export function exhaustiveGuard(_value: never): never {
  /**
   * @about This is an utility function to help identify
   * code that shouldn't be reached
   */
  throw new Error(`ERROR! Reached forbidden guard function with unexpected value: ${JSON.stringify(_value)}`);
}
