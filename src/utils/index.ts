export * from './media-utils';

export const naiveSerialize = (obj: unknown): string => JSON.stringify(obj);
export const naiveEquals = <T>(a: T, b: T): boolean => naiveSerialize(a) === naiveSerialize(b);
export const naiveDeepCopy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));
