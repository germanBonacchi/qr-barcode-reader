export interface QrReaderProps {
  setButtonUseQr: (qr: boolean) => void
  separator: string
  eanIndex: number
  action: string
}

export interface BarcodeReaderProps {
  setButtonUseBarcode: (barcode: boolean) => void
  action: string
}

export interface SkuDataType {
  Id: string
  NameComplete: string
  DetailUrl: string
}

export type UseEanType = 'qr' | 'barcode'

export interface UseEanProps {
  setButton: (button: boolean) => void
  setUse: (code: boolean) => void
  setSuccessAlert: ((alert: string) => void) | null
  ean: string
  type: UseEanType
}

export type ModalType = 'success' | 'error'

export interface OrderFormContext {
  loading: boolean
  orderForm: OrderFormType | undefined
  setOrderForm: (orderForm: Partial<OrderFormType>) => void
}
