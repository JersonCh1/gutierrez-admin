// Datos institucionales del estudio. Reflejo de constants/firm.ts de la app móvil.
export const FIRM = {
  legalName:   "Estudio Gutiérrez Oliva Abogados SAC",
  shortName:   "Estudio Gutiérrez Oliva",
  ruc:         "20605678212",
  practice:    "Litigio Penal",
  slogan:      "Litigio Estratégico",
  emails: {
    estudio:  "estudio@gutierrezolivaabogados.com",
    fundador: "lgutierrez@gutierrezolivaabogados.com",
  },
  whatsapp: {
    raw:     "+51969527409",
    display: "+51 969 527 409",
    url:     "https://wa.me/51969527409",
  },
  emergencyHours: "Atención 24h en emergencias",
  officeHours:    "Lunes a viernes · 08:00 – 18:30",
  consulta: {
    price:           200,
    currency:        "S/",
    durationMinutes: "20 – 30",
    modes:           "virtual o presencial",
  },
  payments: {
    yape: "+51 987 604 106",
    bcp:  "215-265325-0021",
    cci:  "002-21500-26532500-21-27",
  },
} as const

export type SedeKey = "AREQUIPA" | "CUSCO" | "JULIACA"

export const SEDES: Array<{
  key: SedeKey
  city: string
  address: string
  district?: string
  maps?: string
  status: "OPERATIVA" | "PROXIMA"
}> = [
  {
    key:     "AREQUIPA",
    city:    "Arequipa",
    address: "Av. Metropolitana s/n, City Center, Torre Sur, Piso 11, Of. 1105",
    district: "Challapampa · Cerro Colorado",
    maps:    "https://maps.app.goo.gl/3RnL3f7985anS1Aw8",
    status:  "OPERATIVA",
  },
  {
    key:     "CUSCO",
    city:    "Cusco",
    address: "Torre Empresarial Amauta, 4to piso, Of. 404 · Av. Los Incas con Amauta",
    district: "Huanchaq",
    maps:    "https://maps.app.goo.gl/zWkhZqoZdAtfeqhd7",
    status:  "OPERATIVA",
  },
  {
    key:     "JULIACA",
    city:    "Juliaca",
    address: "Próxima apertura",
    status:  "PROXIMA",
  },
]
