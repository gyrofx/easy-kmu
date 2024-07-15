export type Unpack<T> = T extends (infer U)[]
  ? U
  : T extends readonly (infer U)[]
  ? U
  : T extends Promise<infer U>
  ? U
  : never

/**
 * The keys of T that have a value of type U.
 * type X = KeysOfType<{ a: string; b: number; c: string }, string> // "a" | "c"
 * type X = KeysOfType<{ a: string | number; b: number; c: string }, string> // "c"
 * type X = KeysOfType<{ a: string | number; b: number; c: string }, string | number> // "a" | "b" | "c"
 */
export type KeysOfType<T, U> = {
  [P in keyof T]: T[P] extends U ? P : never
}[keyof T]

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>
}

/**
 * Makes specific keys required
 */
export type RequireKeys<Type, Keys extends keyof Type> = Type & Required<Pick<Type, Keys>>

export type ValueOf<T> = T[keyof T]

/**
 * The opposite of `DeepReadonly<T>`
 */
export type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> }

export type DeepReadonly<T> = { readonly [P in keyof T]: DeepReadonly<T[P]> }
