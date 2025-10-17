import { AlertCircle, Search } from 'lucide-react'

interface NoSelectionFoundProps {
  title?: string
  description?: string
  showIcon?: boolean
  variant?: 'default' | 'compact'
}

export function NoSelectionFound({
  title = 'No Selection Found',
  description = 'Please select an option to view the allocation details',
  showIcon = true,
  variant = 'default',
}: NoSelectionFoundProps) {
  if (variant === 'compact') {
    return (
      <div className="flex items-center justify-center rounded-lg border border-border bg-secondary/30 px-4 py-6">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-2 h-5 w-5 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-96 items-center justify-center rounded-lg border-2 border-dashed border-border bg-gradient-to-br from-secondary/20 to-secondary/5 p-8">
      <div className="text-center">
        {showIcon && (
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-submit/5 p-4">
              <Search className="h-8 w-8 text-submit" />
            </div>
          </div>
        )}

        <h3 className="mb-2 text-2xl font-bold text-foreground">{title}</h3>
        <p className="mb-6 text-base text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
