import { Button } from "@/components/ui/button"

interface PlusButtonProps {
  size?: "default" | "sm" | "lg" | "icon"
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  text?: string
  onClick?: () => void
}

export default function PlusButton({ size = "sm", variant = "default", onClick, text = "" }: PlusButtonProps) {
  return (
    <Button size={size} variant={variant} onClick={onClick}>
      <span className="text-lg font-bold">{text}</span>
    </Button>
  )
}