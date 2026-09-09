import { useState } from "react";

type RGBColor = `rgb(${number}, ${number}, ${number})`;

export const useColor = (defaultColor: RGBColor = "rgb(255, 0, 0)") => {
  const [color, setColor] =
    useState<`rgb(${number}, ${number}, ${number})`>(defaultColor);
  return [color, setColor];
};
