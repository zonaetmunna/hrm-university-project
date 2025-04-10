"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

// Sidebar
interface SidebarContextValue {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  isCollapsed: boolean
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(undefined)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

interface SidebarProviderProps {
  children: React.ReactNode
  defaultOpen?: boolean
  defaultCollapsed?: boolean
}

export function SidebarProvider({ children, defaultOpen = true, defaultCollapsed = false }: SidebarProviderProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen, isCollapsed, setIsCollapsed }}>
      {children}
    </SidebarContext.Provider>
  )
}

const sidebarVariants = cva(
  "relative h-full w-full overflow-y-auto overflow-x-hidden bg-background text-foreground flex flex-col gap-4 z-30 border-r",
  {
    variants: {
      variant: {
        default: "w-64",
        floating: "w-64 border rounded-lg shadow-lg m-2",
      },
      collapsible: {
        none: "",
        icon: "transition-all duration-300 ease-in-out",
        offcanvas: "transition-all duration-300 ease-in-out",
      },
    },
    defaultVariants: {
      variant: "default",
      collapsible: "none",
    },
  },
)

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof sidebarVariants> {}

export function Sidebar({ className, variant, collapsible, ...props }: SidebarProps) {
  const { isOpen, isCollapsed } = useSidebar()

  return (
    <aside
      className={cn(
        sidebarVariants({ variant, collapsible }),
        isCollapsed && collapsible === "icon" && "w-16",
        !isOpen && collapsible === "offcanvas" && "w-0 border-0 m-0 p-0",
        className,
      )}
      {...props}
    />
  )
}

// Sidebar Trigger - Adding the missing component
interface SidebarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function SidebarTrigger({ className, ...props }: SidebarTriggerProps) {
  const { setIsOpen } = useSidebar()

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-9 w-9", className)}
      onClick={() => setIsOpen((prev) => !prev)}
      {...props}
    >
      <Menu className="h-5 w-5" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}

// Sidebar Header
interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarHeader({ className, ...props }: SidebarHeaderProps) {
  return <div className={cn("px-3 py-2", className)} {...props} />
}

// Sidebar Content
interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarContent({ className, ...props }: SidebarContentProps) {
  return <div className={cn("flex flex-col gap-2 px-3 py-2", className)} {...props} />
}

// Sidebar Footer
interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarFooter({ className, ...props }: SidebarFooterProps) {
  return <div className={cn("mt-auto px-3 py-2", className)} {...props} />
}

// Sidebar Group
interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarGroup({ className, ...props }: SidebarGroupProps) {
  return <div className={cn("flex flex-col gap-1", className)} {...props} />
}

// Sidebar Group Label
interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
}

export function SidebarGroupLabel({ className, asChild = false, ...props }: SidebarGroupLabelProps) {
  return <div className={cn("px-3 py-1.5 text-xs font-medium text-muted-foreground", className)} {...props} />
}

// Sidebar Group Content
interface SidebarGroupContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarGroupContent({ className, ...props }: SidebarGroupContentProps) {
  return <div className={cn("space-y-1", className)} {...props} />
}

// Sidebar Menu
interface SidebarMenuProps extends React.HTMLAttributes<HTMLUListElement> {}

export function SidebarMenu({ className, ...props }: SidebarMenuProps) {
  return <ul className={cn("space-y-1", className)} {...props} />
}

// Sidebar Menu Item
interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLLIElement> {}

export function SidebarMenuItem({ className, ...props }: SidebarMenuItemProps) {
  return <li className={cn("", className)} {...props} />
}

// Sidebar Menu Button
const sidebarMenuButtonVariants = cva(
  "flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      isActive: {
        true: "bg-accent text-accent-foreground",
        false: "transparent",
      },
    },
    defaultVariants: {
      isActive: false,
    },
  },
)

interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof sidebarMenuButtonVariants> {
  asChild?: boolean
  tooltip?: string
}

export const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, isActive, asChild = false, tooltip, ...props }, ref) => {
    const { isCollapsed } = useSidebar()
    const Comp = asChild ? React.Fragment : "button"
    const buttonProps = asChild ? {} : { ref, ...props }

    return (
      <Comp {...buttonProps}>
        <button
          ref={ref}
          className={cn(sidebarMenuButtonVariants({ isActive }), className)}
          data-tooltip={isCollapsed ? tooltip : null}
          {...props}
        />
      </Comp>
    )
  },
)
SidebarMenuButton.displayName = "SidebarMenuButton"

// Sidebar Toggle
interface SidebarToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function SidebarToggle({ className, ...props }: SidebarToggleProps) {
  const { setIsOpen } = useSidebar()

  return (
    <button
      className={cn(
        "absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-md border bg-background text-foreground",
        className,
      )}
      onClick={() => setIsOpen((prev) => !prev)}
      {...props}
    />
  )
}

// Sidebar Collapse
interface SidebarCollapseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function SidebarCollapse({ className, ...props }: SidebarCollapseProps) {
  const { setIsCollapsed } = useSidebar()

  return (
    <button
      className={cn(
        "absolute right-2 top-14 flex h-8 w-8 items-center justify-center rounded-md border bg-background text-foreground",
        className,
      )}
      onClick={() => setIsCollapsed((prev) => !prev)}
      {...props}
    />
  )
}
