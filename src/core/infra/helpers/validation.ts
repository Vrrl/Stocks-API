export const throwIfUndefinedOrEmptyString = (target: any, errorMessage?: string): string => {
  if (typeof target !== 'string' || target.length === 0) {
    throw new Error(errorMessage || `Expected to target variable to be an valid string: ${target}`);
  }
  return target;
};

export const throwIfUndefined = <T = any>(target: T, errorMessage?: string): T => {
  if (target === undefined) {
    throw new Error(errorMessage || `Expected to target variable to not be undefined.`);
  }
  return target;
};

export const throwIfNotBoolean = (target: any, errorMessage?: string): boolean => {
  if (!['true', 'True', 'false', 'False', 0, 1].includes(target)) {
    throw new Error(errorMessage || `Expected to target variable to be an valid boolean, got ${target}.`);
  }
  return Boolean(target);
};

export const throwIfUndefinedOrNotEnum = <T extends { [key: string]: any }>(
  target: any,
  enumType: T,
  errorMessage?: string,
): T[keyof T] => {
  if (target === undefined || !Object.values(enumType).includes(target)) {
    throw new Error(errorMessage || `Expected target variable to be a valid enum value, got ${target}.`);
  }
  return target;
};

export const throwIfNotNumber = (target: any, errorMessage?: string): number => {
  if (typeof target !== 'number' || isNaN(target)) {
    throw new Error(errorMessage || `Expected target variable to be a valid number, got ${target}.`);
  }
  return target;
};
