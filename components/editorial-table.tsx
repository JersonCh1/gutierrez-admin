import Link from "next/link"

export interface Column<T> {
  key: string
  label: string
  className?: string
  render: (row: T) => React.ReactNode
}

interface Props<T> {
  rows: T[]
  columns: Column<T>[]
  rowHref?: (row: T) => string
  rowKey: (row: T) => string
}

export function EditorialTable<T>({ rows, columns, rowHref, rowKey }: Props<T>) {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 pb-3 border-b border-[var(--color-border)]">
        {columns.map((c) => (
          <div key={c.key} className={`eyebrow ${c.className ?? "col-span-3"}`} style={{ fontSize: 10 }}>
            {c.label}
          </div>
        ))}
      </div>

      {/* Rows */}
      {rows.map((row, i) => {
        const content = (
          <div className={`grid grid-cols-12 gap-4 py-4 items-center transition-colors
              ${rowHref ? "hover:bg-surface/40" : ""}`}>
            {columns.map((c) => (
              <div key={c.key} className={`text-[14px] text-cream ${c.className ?? "col-span-3"}`}>
                {c.render(row)}
              </div>
            ))}
          </div>
        )
        const k = rowKey(row)
        return (
          <div key={k} className={i < rows.length - 1 ? "border-b border-[var(--color-border-2)]" : ""}>
            {rowHref ? <Link href={rowHref(row)} className="block">{content}</Link> : content}
          </div>
        )
      })}
    </div>
  )
}
