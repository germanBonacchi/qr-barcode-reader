export interface QrReaderProps {
  separator: string
  eanIndex: number
  action: string
}

export interface BarcodeReaderProps {
  action: string
}

export interface SkuDataType {
  Id: string
  NameComplete: string
  DetailUrl: string
}

export type UseEanType = 'qr' | 'barcode'

export interface UseEanProps {
  setSuccessAlert: ((alert: string) => void) | null
  ean: string
  type: UseEanType
}

export type ModalType = 'success' | 'error'
