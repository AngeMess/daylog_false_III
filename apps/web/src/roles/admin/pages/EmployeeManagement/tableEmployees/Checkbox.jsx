import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Checkbox = forwardRef(({ className, checked, indeterminate, onChange, disabled, ...props }, ref) => {
  const [isChecked, setIsChecked] = React.useState(checked || false);
  const [isIndeterminate, setIsIndeterminate] = React.useState(indeterminate || false);

  React.useEffect(() => {
    setIsChecked(checked || false);
  }, [checked]);

  React.useEffect(() => {
    setIsIndeterminate(indeterminate || false);
  }, [indeterminate]);

  const handleChange = () => {
    if (disabled) return;
    
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    setIsIndeterminate(false);
    
    if (onChange) {
      onChange(newChecked);
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center",
        className
      )}
      {...props}
    >
      <div
        role="checkbox"
        aria-checked={isChecked}
        aria-disabled={disabled}
        onClick={handleChange}
        className={cn(
          "relative size-4 shrink-0 rounded border border-gray-300 cursor-pointer",
          "hover:border-[#01426A] transition-colors",
          isChecked ? "bg-[#01426A] border-[#01426A]" : "bg-white",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {isChecked && (
          <svg
            width="9"
            height="9"
            viewBox="0 0 9 9"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.53547 0.62293C8.88226 0.849446 8.97976 1.3142 8.75325 1.66099L4.5083 8.1599C4.38833 8.34356 4.19397 8.4655 3.9764 8.49358C3.75883 8.52167 3.53987 8.45309 3.3772 8.30591L0.616113 5.80777C0.308959 5.52987 0.285246 5.05559 0.563148 4.74844C0.84105 4.44128 1.31533 4.41757 1.62249 4.69547L3.73256 6.60459L7.49741 0.840706C7.72393 0.493916 8.18868 0.396414 8.53547 0.62293Z"
            />
          </svg>
        )}
        {isIndeterminate && (
          <svg
            width="9"
            height="9"
            viewBox="0 0 9 9"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.75 4.5C0.75 4.08579 1.08579 3.75 1.5 3.75H7.5C7.91421 3.75 8.25 4.08579 8.25 4.5C8.25 4.91421 7.91421 5.25 7.5 5.25H1.5C1.08579 5.25 0.75 4.91421 0.75 4.5Z"
            />
          </svg>
        )}
      </div>
    </div>
  );
});

Checkbox.displayName = "Checkbox";

export { Checkbox };
