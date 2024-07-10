import type { HTMLProps } from "react";

export const LoadingIndicator = (
  props: HTMLProps<HTMLDivElement> & { colors: string },
) => (
  <div
    {...props}
    className={`animate-spin rounded-full h-4 w-4 border-t-2 ${props.colors}`}
  />
);
