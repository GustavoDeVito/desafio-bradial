import { HTMLProps } from "react";

export type IconProps = {
  fill?: string;
  filled?: boolean;
  size?: number;
  strokeWidth?: number;
  width?: string | number;
  height?: string | number;
  className?: HTMLProps<HTMLElement>["className"];
};
