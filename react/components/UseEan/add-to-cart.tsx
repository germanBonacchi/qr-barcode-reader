/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react'
import { Spinner, ModalDialog } from 'vtex.styleguide'
import { useLazyQuery } from 'react-apollo'
import type {
  MessageDescriptor} from 'react-intl';
import {
  useIntl,
  defineMessages,
} from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { useOrderItems } from 'vtex.order-items/OrderItems'

import type { ModalType, UseEanProps, SkuDataType } from '../../typings/global'
import getDataSku from '../../graphql/getSku.gql'

import '../../style/Loading.global.css'

const CSS_HANDLES = ['modalReaderMessagesError', 'modalReaderMessagesErrorText', 'modalReaderMessagesSucces', 'modalReaderMessagesSuccesText']
// const { orderForm: { items } } = useOrderForm()

export default function UseEanAddToCart({setSuccessAlert, ean, type}: UseEanProps) {

  const [skuData, setSkuData] = useState<SkuDataType>()

  const [modalResult, setModalResult] = useState(false)
  const [messageModal, setMessageModal] = useState<string>('')
  const [modalType, setModalType] = useState<ModalType>()

  const [getSkuQuery,{ loading: loadingGetSku, error: errorGetSku, data: dataGetSku }] = useLazyQuery(getDataSku)
  const handles = useCssHandles(CSS_HANDLES)

  const { addItems } = useOrderItems()

  const intl = useIntl()

  let messagesInternationalization: any

  if (type === 'qr') {
    messagesInternationalization = defineMessages({
      messageModalError: { id: 'store/qr-reader.messageModalError' },
      theProduct: { id: 'store/reader.theProduct' },
      addToCartSucces: { id: 'store/reader.addToCartSucces' },
    })
  } else if (type === 'barcode') {
    messagesInternationalization = defineMessages({
      messageModalError: { id: 'store/barcode-reader.messageModalError' },
      theProduct: { id: 'store/reader.theProduct' },
      addToCartSucces: { id: 'store/reader.addToCartSucces' },
    })
  }

  const translateMessage = (message: MessageDescriptor) =>
  intl.formatMessage(message)

  const openModalResult = () => {
    setModalResult(true)
  }

  const closeModalResult = () => {
    setModalResult(false)
  }
  
  useEffect(() => {
    const queryParam = ean
    console.log("useeffect getSkuQuery", String(queryParam))
    getSkuQuery({ variables: { ean: String(queryParam) } })
  }, [])

  useEffect ( () => {
    console.log("hola useEffect2")
    console.log(loadingGetSku)
    console.log(errorGetSku)
    console.log(dataGetSku)
    if(!loadingGetSku && !errorGetSku && !dataGetSku ) {
      return
    }

    if(loadingGetSku){
      setMessageModal(``)
      openModalResult()
    }

    if(errorGetSku){
      setMessageModal(`${translateMessage(messagesInternationalization.messageModalError)}`)
      setModalType('error')
    }

    if(dataGetSku){
      const sku: SkuDataType = dataGetSku.getSku.data

      setSkuData(sku)
    }

  },[loadingGetSku, errorGetSku, dataGetSku]
  )

  useEffect(() => {
    if(!skuData) return
    // eslint-disable-next-line vtex/prefer-early-return
    if (skuData){
      console.info("skuData",skuData)
      setSuccessAlert?.(`${translateMessage(messagesInternationalization.theProduct)} ${skuData.NameComplete} ${translateMessage(messagesInternationalization.addToCartSucces)}`)
      
      handleAddToCart(skuData)
  }
  }, [skuData])

  const handleAddToCart = async (skuData) => {
    const addItemsPromise = addItems([{
      id: skuData.Id,
      quantity: 1,
      seller: '1',
    }])
    await addItemsPromise
  }

  return (
    <div>
      {modalType === 'error' && 
      <ModalDialog
        centered
        isOpen={modalResult}
        confirmation={{
          label: 'Reintentar',
          onClick: () => {
            closeModalResult()
          },
        }}
        cancelation={{
          onClick: () => {
            closeModalResult() 
          },
          label: 'Cancel',
        }}
        onClose={() => {closeModalResult()}}>
        <div className={`${handles.modalReaderMessagesError}`}>
          <span className={`${handles.modalReaderMessagesErrorText} f3 f3-ns fw3 gray c-action-primary fw5`}> {messageModal} </span>
          {(messageModal === '') && <div className="loading-container"><Spinner /></div>}
        </div>
      </ModalDialog>}
    </div> 
  )
}

