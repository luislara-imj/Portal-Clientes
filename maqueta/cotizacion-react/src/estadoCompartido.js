// Estado compartido con las páginas HTML del prototipo (maqueta/estado.js).
// - Clave: localStorage['obp-prototipo-v1'] con forma { campanas: [ { codigo, estado, ... } ] }.
// - LIMITACIÓN: localStorage es por origen (protocolo + host + puerto). La app React y las
//   páginas HTML solo comparten este estado si se sirven desde el mismo origen. Con Vite en
//   otro puerto (p. ej. localhost:5173) o con las páginas abiertas como file://, cada lado ve
//   su propia copia y este cambio no llega a las páginas HTML.
// - Esta app no crea la estructura: si la clave no existe o está dañada, solo lo informa en consola.

export const CLAVE_ESTADO = 'obp-prototipo-v1'
export const CODIGO_CAMPANA_POR_DEFECTO = 'JRA-0021-ALPINA-ALPINA_LECHE-NOV-2026'

// cotizacion.json no tiene un campo dedicado al código de campaña del prototipo;
// si en el futuro trae codigo_campana o codigo, se usa ese.
export function codigoDeCampana(q) {
  return q?.codigo_campana || q?.codigo || CODIGO_CAMPANA_POR_DEFECTO
}

// Cambia el estado de la campaña indicada. Devuelve true si se guardó.
export function marcarCampana(codigo, estado) {
  let datos
  try {
    const crudo = localStorage.getItem(CLAVE_ESTADO)
    if (!crudo) {
      console.info(`[estado] No existe '${CLAVE_ESTADO}' en este origen; no se actualiza.`)
      return false
    }
    datos = JSON.parse(crudo)
  } catch (e) {
    console.info(`[estado] No se pudo leer '${CLAVE_ESTADO}'; se ignora.`, e)
    return false
  }
  if (!datos || !Array.isArray(datos.campanas)) {
    console.info(`[estado] '${CLAVE_ESTADO}' no tiene la forma esperada; se ignora.`)
    return false
  }
  const campana = datos.campanas.find((c) => c && c.codigo === codigo)
  if (!campana) {
    console.info(`[estado] No hay campaña con codigo '${codigo}'; no se actualiza.`)
    return false
  }
  campana.estado = estado
  try {
    localStorage.setItem(CLAVE_ESTADO, JSON.stringify(datos))
    return true
  } catch (e) {
    console.info(`[estado] No se pudo guardar '${CLAVE_ESTADO}'.`, e)
    return false
  }
}
