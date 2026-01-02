import React from "react";

// Wrap input with forwardRef so RHF register works
export const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`border rounded-md px-3 py-2 w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#5D866C] ${className}`}
      {...props}
    />
  );
});

Input.displayName = "Input";
