/** @internal */
export type Unpack<T> = T extends Promise<infer U> ? U : T;

/** @internal */
export type ArgsType<T> = T extends (...args: infer U) => any ? U : never;

/** @internal */
export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** @internal */
export type PromiseReturnType<T extends (...args: any[]) => any> = Unpack<ReturnType<T>>;
