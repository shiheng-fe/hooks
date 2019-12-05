export type Unpack<T> = T extends Promise<infer U> ? U : T;

export type ArgsType<T> = T extends (...args: infer U) => any ? U : never;

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export type PromiseFunction = (...args: any[]) => Promise<any>;

export type PromiseReturnType<T extends PromiseFunction> = Unpack<ReturnType<T>>;
