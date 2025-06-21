import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface PageHeaderProps {
  title: string
  description?: string
  backHref?: string
  backLabel?: string
  actions?: React.ReactNode
  helpText?: string
}

export default function PageHeader({
  title,
  description,
  backHref,
  backLabel = "Back",
  actions,
  helpText,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold leading-tight">{title}</h1>

          {helpText && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <HelpCircle className="h-5 w-5 text-muted-foreground" />
                    <span className="sr-only">Help</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{helpText}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        {backHref && (
          <Link href={backHref}>
            <Button variant="outline" size="sm">
              {backLabel}
            </Button>
          </Link>
        )}

        {actions}
      </div>
    </div>
  )
}
