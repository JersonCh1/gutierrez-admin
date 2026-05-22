interface Props {
  label: string
  value: number | string
  tone?: "default" | "gold" | "wine"
}

const TONE: Record<NonNullable<Props["tone"]>, string> = {
  default: "text-white",
  gold:    "text-gold",
  wine:    "text-wine-2",
}

export function StatPill({ label, value, tone = "default" }: Props) {
  return (
    <div>
      <p className="eyebrow" style={{ fontSize: 10 }}>{label}</p>
      <p className={`font-serif text-[36px] leading-none mt-2 ${TONE[tone]}`}>{value}</p>
      <div className="rule-28 mt-3 opacity-60" />
    </div>
  )
}
