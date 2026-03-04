import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", fullWidth = false, children, ...props }, ref) => {

    const style: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: fullWidth ? "100%" : "auto",
      height: "48px",
      padding: "0 16px",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: 700,
      cursor: "pointer",
      transition: "all 0.2s ease",
      boxSizing: "border-box",
      backgroundColor: "#000000",
      color: "#ffffff",
      border: "1px solid #ffffff",
    };

    return (
      <button
        ref={ref}
        style={style}
        className={className}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";