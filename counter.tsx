import { Card } from "$/common/components/card";
import { useReducer, useState, type ActionDispatch } from "react";
import { Button } from "./button";
import {
  counterReducer,
  initialState,
  type CounterAction,
} from "./counter-reducer";

type DispatchCountAction = {
  dispatch: ActionDispatch<[action: CounterAction]>;
};

const CounterControls = ({ dispatch }: DispatchCountAction) => {
  return (
    <div className="flex gap-2">
      <Button onClick={() => dispatch({ type: "decrement" })}>
        ➖ Decrement
      </Button>
      <Button onClick={() => dispatch({ type: "set-count", payload: 0 })}>
        🔁 Reset
      </Button>
      <Button onClick={() => dispatch({ type: "increment" })}>
        ➕ Increment
      </Button>
    </div>
  );
};

/**
 *
 * A special kind of form for counter operations
 */
const CounterForm = ({ dispatch }: DispatchCountAction) => {
  const [draftCount, setDraftCount] = useState(0);

  return (
    <form
      className="flex items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        dispatch({ type: "set-count", payload: draftCount });
      }}
    >
      <input
        className="ring-primary-600 focus:border-primary-800 rounded border border-slate-500 px-4 py-2 outline-none focus:ring-2"
        type="number"
        name="count"
        onChange={(e) => setDraftCount(e.target.valueAsNumber)}
        value={draftCount}
      />
      <Button type="submit">Update Counter</Button>
    </form>
  );
};

export const Counter = () => {
  const [{ count }, dispatch] = useReducer(counterReducer, initialState);

  return (
    <Card className="border-primary-500 flex w-2/3 flex-col items-center gap-8">
      <h1>Days Since the Last Accident</h1>
      <p className="text-6xl">{count}</p>
      <CounterControls dispatch={dispatch} />
      <CounterForm dispatch={dispatch} />
    </Card>
  );
};
