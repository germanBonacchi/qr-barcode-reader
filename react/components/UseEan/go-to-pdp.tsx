import React, { useState, useEffect } from 'react'
import { Spinner, ModalDialog, Modal } from 'vtex.styleguide'
import { useLazyQuery, useMutation } from 'react-apollo'
import type { MessageDescriptor } from 'react-intl'
import { useIntl, defineMessages } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import type { ModalType, UseEanProps, SkuDataType } from '../../typings/global'
import getDataSku from '../../graphql/getSku.gql'
import getProduct from '../../graphql/getProduct.gql'
import logger from '../../graphql/logger.gql'
import saveLog from '../../utils/saveLog'
import findSkuOfMultipleEan from '../../utils/findSkuOfMultipleEan'

import '../../style/Loading.global.css'

const CSS_HANDLES = [
  'modalReaderMessagesError',
  'modalReaderMessagesErrorText',
  'modalReaderMessagesSucces',
  'modalReaderMessagesSuccesText',
  'listErrorMutipleProductText',
]

const messages = defineMessages({
  qrReaderModalError: { id: 'store/qr-reader.messageModalError' },
  qrReaderModalErrorRetry: { id: 'store/qr-reader.messageModalErrorRetry' },
  barcodeModalError: { id: 'store/barcode-reader.messageModalError' },
  barcodeModalErrorRetry: { id: 'store/barcode-reader.messageModalErrorRetry' },
  readerModalSucces: { id: 'store/reader.readerModalSucces' },
  retry: { id: 'store/reader.retry' },
  cancel: { id: 'store/reader.cancel' },
  searching: { id: 'store/reader.searching' },
  skuFound: { id: 'store/reader.skuFound' },
})

export default function UseEanGoToPDP({
  setButton,
  setRead,
  ean,
  type,
  mode,
  setState,
  setModalShows,
}: UseEanProps) {
  const times = 1000
  const [skuData, setSkuData] = useState<SkuDataType>()
  const [isRedirect, setIsRedirect] = useState<boolean>(false)

  const [modalResult, setModalResult] = useState(false)
  const [messageModal, setMessageModal] = useState<string>('')
  const [modalType, setModalType] = useState<ModalType>()

  const modalErrorId =
    type === 'qr' ? messages.qrReaderModalError : messages.barcodeModalError

  const modalErrorRetry =
    type === 'qr'
      ? messages.qrReaderModalErrorRetry
      : messages.barcodeModalErrorRetry

  const [loggerMutation] = useMutation(logger)

  const [
    getSkuQuery,
    { loading: loadingGetSku, error: errorGetSku, data: dataGetSku },
  ] = useLazyQuery(getDataSku)

  const [
    getProductQuery,
    {
      loading: loadingGetProduct,
      error: errorGetProduct,
      data: dataGetProduct,
    },
  ] = useLazyQuery(getProduct)

  const handles = useCssHandles(CSS_HANDLES)

  const intl = useIntl()

  const translateMessage = (message: MessageDescriptor) =>
    intl.formatMessage(message)

  const FormatErrorMessage = (
    error1: MessageDescriptor,
    eancode: string,
    error2: MessageDescriptor
  ) => {
    return `${translateMessage(error1)} (${eancode}) ${translateMessage(
      error2
    )}`
  }

  const openModalResult = () => {
    setModalResult(true)
  }

  const closeModalResult = () => {
    setModalResult(false)
  }

  useEffect(() => {
    const queryParam = ean

    console.info('loadingGetSku', loadingGetSku)
    console.info('errorGetSku', errorGetSku)
    console.info('dataGetSku', dataGetSku)

    saveLog('go to pdp', ean, loggerMutation)
    console.info('go to pdp', ean)
    try {
      getSkuQuery({ variables: { ean: queryParam } })
    } catch (error) {
      console.info('error getSkuQuery', error)
      saveLog('error getSkuQuery', error, loggerMutation)
      setMessageModal(FormatErrorMessage(modalErrorId, ean, modalErrorRetry))
      setState(FormatErrorMessage(modalErrorId, ean, modalErrorRetry))
      setModalShows(true)
      setRead(false)
      setModalType('error')
    }
  }, [])

  useEffect(() => {
    if (!loadingGetSku && !errorGetSku && !dataGetSku) return
    if (loadingGetSku) {
      console.info('loadingGetSku', loadingGetSku)
      setMessageModal(``)
      openModalResult()
    }

    if (errorGetSku) {
      console.info('errorGetSku', errorGetSku)
      if (mode === 'singleEan') {
        saveLog('errorGetSku singleEan', errorGetSku, loggerMutation)
        setMessageModal(FormatErrorMessage(modalErrorId, ean, modalErrorRetry))
        setState(FormatErrorMessage(modalErrorId, ean, modalErrorRetry))
        setModalShows(true)
        setRead(false)
        setModalType('error')
      } else if (mode === 'multipleEan') {
        saveLog('errorGetSku multipleEan', errorGetSku, loggerMutation)
        const queryParam = ean

        try {
          getProductQuery({ variables: { ean: queryParam } })
        } catch (error) {
          console.info('error getProductQuery', error)
          saveLog('error getProductQuery', error, loggerMutation)
          setMessageModal(
            FormatErrorMessage(modalErrorId, ean, modalErrorRetry)
          )
          setState(FormatErrorMessage(modalErrorId, ean, modalErrorRetry))
          setModalShows(true)
          setModalType('error')
        }
      }
    }

    if (dataGetSku) {
      console.info('dataGetSku', dataGetSku)
      const sku: SkuDataType = dataGetSku.getSku.data
      const productName: string = sku.NameComplete

      setMessageModal(
        `${translateMessage(messages.readerModalSucces)} ${productName}`
      )

      setState(`${translateMessage(messages.readerModalSucces)} ${productName}`)
      setModalShows(true)
      setModalType('success')
      setSkuData(sku)
    } else {
      null
    }
  }, [loadingGetSku, errorGetSku, dataGetSku])

  useEffect(() => {
    if (!loadingGetProduct && !errorGetProduct && !dataGetProduct) return
    if (loadingGetProduct) {
      setState(`${translateMessage(messages.searching)}`)
      setMessageModal(``)
      openModalResult()
    }

    if (errorGetProduct) {
      saveLog('errorGetProduct', errorGetProduct, loggerMutation)
      setMessageModal(FormatErrorMessage(modalErrorId, ean, modalErrorRetry))
      setState(FormatErrorMessage(modalErrorId, ean, modalErrorRetry))
      setModalShows(true)
      setModalType('error')
    }

    if (dataGetProduct) {
      const { data } = dataGetProduct.getProductBySpecificationFilter

      if (data.length > 0) {
        const [{ MultipleEan, linkText, items }] = data

        if (MultipleEan) {
          const skuFinded = findSkuOfMultipleEan(MultipleEan, ean)

          const { nameComplete } = items.find(
            (item) => item.itemId === skuFinded
          )

          const skuTemp: SkuDataType = {
            Id: skuFinded,
            NameComplete: nameComplete,
            DetailUrl: `${linkText}/p`,
          }

          setMessageModal(
            `${translateMessage(messages.readerModalSucces)} ${nameComplete}`
          )
          setState(
            `${translateMessage(messages.readerModalSucces)} ${nameComplete}`
          )
          setModalShows(true)
          setModalType('success')
          setSkuData(skuTemp)
        } else {
          setMessageModal(
            FormatErrorMessage(modalErrorId, ean, modalErrorRetry)
          )
          setState(FormatErrorMessage(modalErrorId, ean, modalErrorRetry))
          setModalShows(true)
          setModalType('error')
        }
      } else {
        setMessageModal(FormatErrorMessage(modalErrorId, ean, modalErrorRetry))
        setState(FormatErrorMessage(modalErrorId, ean, modalErrorRetry))
        setModalShows(true)
        setModalType('error')
      }
    }
  }, [loadingGetProduct, errorGetProduct, dataGetProduct])

  useEffect(() => {
    if (!skuData) return
    setRead(false)
    if (isRedirect) return
    const skuLink = `${skuData.DetailUrl}?skuId=${skuData.Id}`

    setIsRedirect(true)
    saveLog('window.location.replace skuLink', skuLink, loggerMutation)
    window.location.replace(skuLink)
  }, [skuData])

  return (
    <div>
      {modalType === 'error' && (
        <ModalDialog
          centered
          isOpen={modalResult}
          confirmation={{
            label: translateMessage(messages.retry),
            onClick: () => {
              closeModalResult()
              setRead(false)
              setTimeout(() => {
                setRead(true)
              }, times)
            },
          }}
          cancelation={{
            onClick: () => {
              closeModalResult()
              setButton(false)
            },
            label: translateMessage(messages.cancel),
          }}
          onClose={() => {
            closeModalResult()
          }}
        >
          <div className={`${handles.modalReaderMessagesError}`}>
            <span
              className={`${handles.modalReaderMessagesErrorText} f3 f3-ns fw3 gray c-action-primary fw5`}
            >
              {messageModal}
            </span>
            {(isRedirect || messageModal === '') && (
              <div className="loading-container">
                <Spinner />
              </div>
            )}
          </div>
        </ModalDialog>
      )}
      {modalType === 'success' && (
        <Modal
          centered
          isOpen={modalResult}
          onClose={() => {
            closeModalResult()
          }}
        >
          <div className={`${handles.modalReaderMessagesSucces}`}>
            <span
              className={`${handles.modalReaderMessagesSuccesText} f3 f3-ns fw3 gray c-action-primary fw5`}
            >
              {messageModal}
            </span>
            {(isRedirect || messageModal === '') && (
              <div className="loading-container">
                <Spinner />
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}
