import { useState } from "react";

type RGBColor = `rgb(${number}, ${number}, ${number})` | `#${string}`;

/**
 * Sets a color in RGB or Hex.
 */
export const useColor = (defaultColor: RGBColor = "rgb(255, 0, 0)") => {
  const [color, setColor] =
    useState<`rgb(${number}, ${number}, ${number})`>(defaultColor);
  return [color, setColor];
};
