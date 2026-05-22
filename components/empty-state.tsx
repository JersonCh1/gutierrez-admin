interface Props {
  eyebrow: string
  title?: string
  description: string
  action?: React.ReactNode
}

export function EmptyState({ eyebrow, title, description, action }: Props) {
  return (
    <div className="py-20 max-w-[60ch]">
      <p className="eyebrow eyebrow-gold mb-3">{eyebrow}</p>
      {title && <p className="h3-serif text-white mb-4">{title}</p>}
      <p className="text-silver text-[14px] leading-[22px]">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
