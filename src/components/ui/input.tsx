import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "mt-3 flex h-[3.375rem] w-full rounded-[10px] bg-dark-300 px-5 py-[1.0625rem] text-base  text-light-200 outline-none  file:border-0 file:bg-transparent file:text-sm file:font-medium  placeholder:text-white focus-visible:outline-none ",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
