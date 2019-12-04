export type Unpack<T> = T extends Promise<infer U> ? U : T;

export type ArgsType<T> = T extends (...args: infer U) => any ? U : never;
