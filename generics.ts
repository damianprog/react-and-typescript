// Chcemy mieć linked list która przechowuje value danego typu
// który to typ może się różnić w zależności od potrzeby wykorzystania te linked list
// Można by było zrobić np. Link<number> ale wtedy ta linked list mogła by mieć value tylko number
// A z generykiem programista może sam zdecydować jaki typ value ma ta lista przechowywać

// type Link<T> = {
//   value: T;
//   next?: Link<T>;
// };

// const first: Link<string> = {
//   value: "first",
// };

// const second: Link<number> = {
//   value: 2,
// };

//Type 'Link<number>' is not assignable to type 'Link<string>'.
//   Type 'number' is not assignable to type 'string'.
// first.next = second;

// ==========================================================================================================

// Tap function to funkcja przymująca jakąś value
// wykorzystuje tą value do zrobienia czegoś
// i zwraca tą value identyczną jaką dostała na wejściu

// function tap<T>(value: T, fn: (value: T) => void): T {
//   fn(value);
//   return value;
// }

// const foo = tap("wow", (value) => console.log(value));

// T can be anything as long as it's string or number
function tap<T extends string | number>(value: T, fn: (value: T) => void): T {
  fn(value);
  return value;
}

const foo = tap("wow", (value) => console.log(value));

const add = (a: number, b: number) => a + b;

type Something = {
  foo: number;
  bar: string;
  baz: boolean;
};

// Object type shape only with properties passed
// type SomethingElse = Pick<Something, "foo" | "baz">;

// Object type shape without properties passed
// type SomethingElse = Omit<Something, "foo" | "baz">;

// Object type shape but with all properties optional
// type SomethingElse = Partial<Something>;

// Get type of value returned from function add
// type AddReturn = ReturnType<typeof add>;

// Get array of parameters that add function accepts.
// Because it's array you can use it with [parameterIndex] to get the parameter at given index.
type AddReturn = Parameters<typeof add>;

// ==========================================================================================================
