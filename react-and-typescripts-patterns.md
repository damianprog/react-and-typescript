## React + TS: wyniesienie formularza do osobnego komponentu (2026-09-08)

**Zadanie:** kurs React and TypeScript v3 — wydzielić `<form>` z `Counter` do `CounterForm` i poprawnie otypować propsy.

### Luka 1 — detal: jak przekazać event do handlera z dodatkowym argumentem

Napisałem `onSubmit={onFormSubmit(event, draftCount)}` licząc, że `event` „skądś się weźmie".
Efekt: funkcja wywołuje się **podczas renderu**, do `onSubmit` trafia `undefined`, a `event` odnosi się do globalnego `window.event` (dlatego TS nie krzyknął).

Fix: owijka strzałkowa — dopiero ona odracza wywołanie i przyjmuje event od Reacta.

```tsx
<form onSubmit={(event) => onFormSubmit(event, draftCount)}>
```

**Reguła:** `onX={handler}` przekazuje referencję; `onX={handler(arg)}` wywołuje natychmiast. Chcesz dołożyć argument → potrzebna strzałka.

### Luka 2 — brak złożenia: gdzie kończy się odpowiedzialność dziecka

Pierwsze podejście przekazywało `React.FormEvent<HTMLFormElement>` **w górę**, do rodzica, który robił `preventDefault()`.
Działa, ale rodzic musi wtedy wiedzieć, że dziecko jest formularzem — komponent przestaje być wymienialny.

Poprawka: `preventDefault()` zostaje w `CounterForm`, w górę idzie sama wartość.

```tsx
type CounterFormProps = {
  onFormSubmit: (count: number) => void;
};

const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
  event.preventDefault();
  onFormSubmit(draftCount);
};
```

**Reguła:** props-callback opisuje _co się stało_ (`onFormSubmit(count)`), nie _jak_ zostało kliknięte. Szczegóły DOM zostają wewnątrz.

### Detale wyłapane przy review

- **Typy handlerów z Reacta zamiast ręcznych:** `React.FormEventHandler<HTMLFormElement>` / `React.ChangeEventHandler<HTMLInputElement>` — typuje się zmienną, nie parametr, więc `event` wychodzi z inferencji.
- **Zbędna owijka:** `onSubmit={(event) => handleSubmit(event)}` → `onSubmit={handleSubmit}`, skoro sygnatury są identyczne.
- **Handler-przelotka:** `const onCounterFormSubmit = (n: number) => setCount(n)` da się zastąpić `onFormSubmit={setCount}` — `Dispatch<SetStateAction<number>>` jest przypisywalny do `(count: number) => void`.
- **`valueAsNumber` daje `NaN`** po wyczyszczeniu inputa. Guard: `Number.isNaN(v) ? 0 : v` (albo trzymanie draftu jako `string`).
- **Nazewnictwo:** `handleX` = kto obsługuje (wewnątrz komponentu), `onX` = prop opisujący zdarzenie. Moje pierwsze `handleSubmit` obsługiwało w rzeczywistości `onChange` inputa — mylące.

### Do przemyślenia

`CounterControls` dostaje cały `setCount` — ten sam zarzut co w Luce 2, tylko lżejszy: dziecko może ustawić licznik na dowolną wartość. Alternatywa: `onIncrement` / `onDecrement` / `onReset`.

## Context + TypeScript: `createBetterContext` (React and TypeScript v3, lekcja „Context Selector Types”)

### Problem

`createContext` wywołuje się na poziomie modułu, a prawdziwa wartość kontekstu (`plans` z `useState` i metody) powstaje dopiero w Providerze. TS wymaga typu i wartości domyślnej od razu. Są trzy wyjścia:

1. `createContext<T | null>(null)`: uczciwe, ale sprawdzanie null w każdym konsumencie.
2. `null as unknown as T`: hack, okłamujesz TS.
3. Własny wrapper: `createContext<T | null>(null)` + hook, który rzuca błąd przy null (zawężanie typu przez `throw`), zwraca `T` i Provider jako krotkę (`as const`).

### Rozwiązanie (wzorzec)

```tsx
export const createBetterContext = <T,>() => {
  const Context = createContext<T | null>(null);
  const useContext = () => {
    const ctx = React.useContext(Context);
    if (ctx === null) throw new Error("Brak Providera!");
    return ctx; // T
  };
  return [useContext, Context.Provider] as const;
};

// poziom modułu, NIE wewnątrz komponentu
const [usePlans, PlansProviderRaw] = createBetterContext<PlansContextType>();
```

### Co zrobiłem dobrze

- Poprawnie przepiąłem `PlansProvider` na `PlansProviderRaw` i wyeksportowałem `usePlans`.
- Zrozumiałem główną korzyść: null sprawdzany jest raz, w hooku, a konsument dostaje czysty `PlansContextType`.
- Przy przejściu na opcję 3 pozbyłem się błędnego `createContext<X | null>(null as unknown as X)`. Hack z `| null` w generyku nic nie dawał.

### Co poszło źle / luki

- **brak złożenia:** nie wiedziałem, gdzie umieścić wywołanie `createBetterContext<...>()`. Klocki miałem (wrapper, Provider, hook), ale nie widziałem, że to zamiennik `const PlansContext = createContext(...)` na poziomie modułu.
- **brak narzędzia:** źle wskazałem źródło null. Myślałem, że chodzi o obiekt przekazany w `value`. W rzeczywistości null to **wartość domyślna**, którą `useContext` zwraca, gdy nad komponentem **nie ma Providera**. `T` samo w sobie nigdy nie jest null, `T | null` to typ tego, co może zwrócić kontekst.

### Do zapamiętania

- `createContext(default)`: `default` trafia tylko do komponentów **bez Providera** nad sobą.
- `throw` zawęża typ skuteczniej niż `return` (nie dokleja `undefined` do typu zwracanego).
- `<T,>` w `.tsx`: przecinek, żeby parser nie wziął generyka za JSX.
- `as const` na zwracanej tablicy daje krotkę `readonly [A, B]` zamiast `(A | B)[]`, tak jak w `useState`.
- Kontekst tworzymy poza komponentem, inaczej powstaje nowy przy każdym renderze.
