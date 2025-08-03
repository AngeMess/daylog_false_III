import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return (
      <input
              type={type}
              className={cn("pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-[#01426A] w-64 transition-all", className)}
              ref={ref}
              {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
