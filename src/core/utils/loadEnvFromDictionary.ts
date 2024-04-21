export function loadEnvFromDictionary(dict: object): void {
  Object.keys(dict).forEach(key => {
    // @ts-expect-error arrumar isso
    process.env[key] = dict[key];
  });
}
