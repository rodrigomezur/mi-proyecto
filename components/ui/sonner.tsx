"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      position="top-right"
      closeButton
      duration={5000}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover, #1e293b)",
          "--normal-text": "var(--popover-foreground, #e2e8f0)",
          "--normal-border": "var(--border, #334155)",
          "--border-radius": "0.5rem",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
