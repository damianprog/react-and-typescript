import { Card } from "$/common/components/card";
import { useState, type Dispatch } from "react";

type CounterControlsProps = {
  setCount: Dispatch<React.SetStateAction<number>>;
};

const CounterControls = ({ setCount }: CounterControlsProps) => {
  return (
    <div className="flex gap-2">
      <button onClick={() => setCount((previous) => previous - 1)}>
        ➖ Decrement
      </button>
      <button onClick={() => setCount(0)}>🔁 Reset</button>
      <button onClick={() => setCount((previous) => previous + 1)}>
        ➕ Increment
      </button>
    </div>
  );
};

type CounterFormProps = {
  onFormSubmit: (count: number) => void;
};

const CounterForm = ({ onFormSubmit }: CounterFormProps) => {
  const [draftCount, setDraftCount] = useState(0);
  const handleInputNumberChange: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) =>
    setDraftCount(
      Number.isNaN(event.target.valueAsNumber) ? 0 : event.target.valueAsNumber,
    );

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    onFormSubmit(draftCount);
  };

  return (
    <form className="flex items-center gap-2" onSubmit={handleSubmit}>
      <input
        className="ring-primary-600 focus:border-primary-800 rounded border border-slate-500 px-4 py-2 outline-none focus:ring-2"
        type="number"
        onChange={handleInputNumberChange}
        value={draftCount}
      />
      <button type="submit">Update Counter</button>
    </form>
  );
};

export const Counter = () => {
  const [count, setCount] = useState(0);

  const onCounterFormSubmit = (draftCount: number) => {
    setCount(draftCount);
  };

  return (
    <Card className="border-primary-500 flex w-2/3 flex-col items-center gap-8">
      <h1>Days Since the Last Accident</h1>
      <p className="text-6xl">{count}</p>
      <CounterControls setCount={setCount} />
      <CounterForm onFormSubmit={onCounterFormSubmit} />
    </Card>
  );
};
