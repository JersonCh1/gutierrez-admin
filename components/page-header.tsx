interface Props {
  eyebrow: string
  title: string
  caption?: string
  action?: React.ReactNode
}

export function PageHeader({ eyebrow, title, caption, action }: Props) {
  return (
    <header className="flex items-end justify-between gap-8 mb-10">
      <div className="min-w-0">
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h1 className="h1-serif">{title}</h1>
        <div className="rule-28 mt-4" />
        {caption && (
          <p className="text-silver text-[14px] leading-[22px] max-w-[60ch] mt-4">
            {caption}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  )
}
