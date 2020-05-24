export type Unpack<T> = T extends Promise<infer U> ? U : T;

export type PromiseReturnType<T extends (...args: any[]) => any> = Unpack<ReturnType<T>>;
