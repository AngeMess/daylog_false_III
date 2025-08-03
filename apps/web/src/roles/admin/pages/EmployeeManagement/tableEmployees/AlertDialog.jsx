import React, { createContext, useContext, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils"
import { buttonVariants } from "./Button"

const AlertDialogContext = createContext(null);

const AlertDialog = ({ children, open, onOpenChange }) => {
  const [isOpen, setIsOpen] = useState(open || false);
  
  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);
  
  const handleOpenChange = (value) => {
    setIsOpen(value);
    if (onOpenChange) {
      onOpenChange(value);
    }
  };
  
  return (
    <AlertDialogContext.Provider value={{ isOpen, onOpenChange: handleOpenChange }}>
      {children}
    </AlertDialogContext.Provider>
  );
};

const AlertDialogTrigger = ({ children, asChild, ...props }) => {
  const { onOpenChange } = useContext(AlertDialogContext) || {};
  const Comp = asChild ? React.cloneElement(children, {
    ...props,
    onClick: (e) => {
      onOpenChange?.(true);
      children.props.onClick?.(e);
    },
  }) : (
    <button
      type="button"
      onClick={() => onOpenChange?.(true)}
      {...props}
    >
      {children}
    </button>
  );
  
  return Comp;
};

const AlertDialogPortal = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const { isOpen } = useContext(AlertDialogContext) || {};
  
  useEffect(() => {
    setMounted(true);
    
    return () => setMounted(false);
  }, []);
  
  if (!mounted || !isOpen) return null;
  
  return createPortal(
    children,
    document.body
  );
};

const AlertDialogOverlay = React.forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "fixed inset-0 z-50 bg-transparent backdrop-blur-md transition-opacity duration-200",
          className
        )}
        style={{ backdropFilter: 'blur(8px)' }}
        {...props}
      />
    );
  }
);

AlertDialogOverlay.displayName = "AlertDialogOverlay";

const AlertDialogContent = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    const { onOpenChange } = useContext(AlertDialogContext) || {};
    const contentRef = useRef(null);
    
    // Close dialog when clicking outside
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (contentRef.current && !contentRef.current.contains(e.target)) {
          onOpenChange?.(false);
        }
      };
      
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onOpenChange]);
    
    // Close on escape key press
    useEffect(() => {
      const handleEscape = (e) => {
        if (e.key === "Escape") {
          onOpenChange?.(false);
        }
      };
      
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }, [onOpenChange]);
    
    return (
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <div
          ref={(node) => {
            if (ref) {
              if (typeof ref === "function") ref(node);
              else ref.current = node;
            }
            contentRef.current = node;
          }}
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg transition-all duration-200 sm:rounded-lg",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </AlertDialogPortal>
    );
  }
);

AlertDialogContent.displayName = "AlertDialogContent";

const AlertDialogHeader = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn("text-lg font-semibold text-[#01426A]", className)}
      {...props}
    />
  )
);

AlertDialogTitle.displayName = "AlertDialogTitle";

const AlertDialogDescription = React.forwardRef(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-gray-500", className)}
      {...props}
    />
  )
);

AlertDialogDescription.displayName = "AlertDialogDescription";

const AlertDialogAction = React.forwardRef(
  ({ className, onClick, ...props }, ref) => {
    const { onOpenChange } = useContext(AlertDialogContext) || {};
    
    const handleClick = (e) => {
      onClick?.(e);
      onOpenChange?.(false);
    };
    
    return (
      <button
        ref={ref}
        className={cn(buttonVariants(), "bg-[#01426A] hover:bg-[#01426A]/90", className)}
        onClick={handleClick}
        {...props}
      />
    );
  }
);

AlertDialogAction.displayName = "AlertDialogAction";

const AlertDialogCancel = React.forwardRef(
  ({ className, onClick, ...props }, ref) => {
    const { onOpenChange } = useContext(AlertDialogContext) || {};
    
    const handleClick = (e) => {
      onClick?.(e);
      onOpenChange?.(false);
    };
    
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "mt-2 sm:mt-0 border-[#01426A] text-[#01426A] hover:bg-[#01426A]/10",
          className
        )}
        onClick={handleClick}
        {...props}
      />
    );
  }
);

AlertDialogCancel.displayName = "AlertDialogCancel";

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
