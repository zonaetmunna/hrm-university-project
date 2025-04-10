
interface HeadingProps {
  title: string
  description?: string
}

/**
 * Heading component
 * 
 * A consistent heading component with optional description for page headers
 * 
 * @param {string} title - The main heading text
 * @param {string} description - Optional description text
 * @returns {JSX.Element}
 */
export function Heading({ title, description }: HeadingProps) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {description && (
        <p className="mt-2 text-muted-foreground">{description}</p>
      )}
    </div>
  )
}

/**
 * Changelog:
 * - 2023-07-20: Created component for consistent page headings
 * - Version: 1.0.0
 */ 