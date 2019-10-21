export type UnpackPromise<T> = T extends Promise<infer U> ? U : T;

export type Unpacked<T extends (...args: any) => any> = UnpackPromise<ReturnType<T>>;
