export type Unpack<T> = T extends Promise<infer U> ? U : T;

export type PromiseReturnType<T extends (...args: any[]) => any> = Unpack<
  ReturnType<T>
>;

export type Nullable<T> = T | undefined | null;

export function isFunction(fn: any): fn is Function {
  return typeof fn === 'function';
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const delayRun = (fn: Function) => setTimeout(fn);
