export const initialState = {
  count: 0,
};

type Action = {
  type: string;
  payload?: unknown;
};

interface IncrementAction extends Action {
  type: "increment";
  payload?: never;
}

interface DecrementAction extends Action {
  type: "decrement";
  payload?: never;
}

interface SetCountAction extends Action {
  type: "set-count";
  payload: number;
}

export type CounterAction = IncrementAction | DecrementAction | SetCountAction;

// Improvement: Define a proper Action type instead of using 'any'.

export const counterReducer = (
  state = initialState,
  action: CounterAction,
): { count: number } => {
  console.log({ action });
  const { count } = state;

  if (action.type === "increment") {
    const newCount = count + 1;
    return { count: newCount };
  }

  if (action.type === "decrement") {
    const newCount = count - 1;
    return { count: newCount };
  }

  if (action.type === "set-count") {
    const newCount = action.payload;
    return { count: newCount };
  }

  return state;
};
