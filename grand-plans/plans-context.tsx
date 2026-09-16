import React, { createContext, useState, type PropsWithChildren } from "react";
import * as Api from "./api";
import type { Plan } from "./types";

type PlansContextType = {
  plans: Plan[];
  createPlan: (title: string) => Promise<void>;
  updatePlan: (id: number, updatedPlan: Partial<Omit<Plan, "id">>) => Promise<void>;
  removePlan: (id: number) => Promise<void>;
};
// But this is an alternative
export const createBetterContext = <T,>() => {
  const Context = createContext<T | null>(null);

  const useContext = () => {
    const ctx = React.useContext(Context);

    if (ctx === null) {
      throw new Error("Context was not properly set. Whoops!");
    }

    return ctx;
  };

  return [useContext, Context.Provider] as const;
};

// This isn't a bad way to go
// const PlansContext = createContext<PlansContextType>(null as unknown as PlansContextType);

const [usePlans, PlansProviderRaw] = createBetterContext<PlansContextType>();

export { usePlans };

// export function dummyFunction(value: string | null) {
//   if (value === null) throw new Error("Nope, it is null.");
//   console.log(value);
//   return value;
// }

export const PlansProvider = ({ children }: PropsWithChildren) => {
  const [plans, setPlans] = useState<Plan[]>([]);

  const createPlan = async (title: string) => {
    const plan = await Api.createPlan(title);
    setPlans((prevPlans) => [...prevPlans, plan]);
  };

  // Improvement: Can we type updatedPlan better?
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updatePlan = async (id: number, updatedPlan: any) => {
    const plan = await Api.updatePlan(id, updatedPlan);
    setPlans((prevPlans) => prevPlans.map((p) => (p.id === plan.id ? plan : p)));
  };

  const removePlan = async (id: number) => {
    const deleted = await Api.deletePlan(id);
    if (!deleted) return;
    setPlans((prevPlans) => prevPlans.filter((p) => p.id !== id));
  };

  return (
    // <PlansContext.Provider value={{ plans, createPlan, updatePlan, removePlan }}>
    //   {children}
    // </PlansContext.Provider>

    <PlansProviderRaw value={{ plans, createPlan, updatePlan, removePlan }}>
      {children}
    </PlansProviderRaw>
  );
};
