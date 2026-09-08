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
