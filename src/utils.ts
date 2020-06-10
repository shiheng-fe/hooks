/** @internal */
export type Unpack<T> = T extends Promise<infer U> ? U : T;

/** @internal */
export type PromiseReturnType<T extends (...args: any[]) => any> = Unpack<ReturnType<T>>;

/** @internal */
export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
