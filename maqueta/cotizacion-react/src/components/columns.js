// Column order and Figma Cell variant per column (see FIGMA_TABLE_SPEC.md section 1).
// variant: 'default' | 'fecha' | 'numerica'. kind: how the value is formatted.
export const COLUMNS = [
  { key: 'ciudad', label: 'Ciudad', variant: 'default', width: 200 },
  { key: 'formato', label: 'Formato', variant: 'default', width: 200 },
  { key: 'detalle', label: 'Detalle', variant: 'default', width: 260, multiline: true },
  { key: 'clave', label: 'Clave IMJ', variant: 'default', width: 220 },
  { key: 'unidades', label: 'Unidades', variant: 'numerica', kind: 'integer', width: 112 },
  { key: 'tiempo_servicio', label: 'Tiempo de servicio', variant: 'default', width: 168 },
  { key: 'inicio', label: 'Inicio', variant: 'fecha', kind: 'date', width: 132 },
  { key: 'fin', label: 'Fin', variant: 'fecha', kind: 'date', width: 132 },
  { key: 'precio_unitario', label: 'Precio unitario', variant: 'numerica', kind: 'money', width: 168 },
  { key: 'contratacion_mensual', label: 'Contratación mensual', variant: 'numerica', kind: 'money', width: 192 },
  { key: 'costo_impresion', label: 'Costo de impresión', variant: 'numerica', kind: 'money', width: 176 },
  { key: 'total', label: 'Total', variant: 'numerica', kind: 'money', width: 168 },
]

export const MONEY_COLUMNS = COLUMNS.filter((c) => c.kind === 'money')
