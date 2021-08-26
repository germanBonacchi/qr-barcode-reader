export interface QrReaderProps {
  separator: string
  separatorApparition: number
}

export interface SkuDataType {
  Id: string
  NameComplete: string
  DetailUrl: string
}

export type UseEanType = 'qr' | 'barcode'

export interface UseEanProps {
  ean: string
  type: UseEanType
}
