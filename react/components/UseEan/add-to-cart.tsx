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
import { OrderItems } from 'vtex.order-items'

import type { ModalType, UseEanProps, SkuDataType } from '../../typings/global'
import getDataSku from '../../graphql/getSku.gql'

import '../../style/Loading.global.css'

const CSS_HANDLES = ['modalReaderMessagesError','modalReaderMessagesErrorText','modalReaderMessagesSucces','modalReaderMessagesSuccesText']
const { useOrderItems } = OrderItems
// const { orderForm: { items } } = useOrderForm()


export default function UseEanAddToCart({setUse, ean, type}: UseEanProps) {

  const [skuData, setSkuData] = useState<SkuDataType>()

  const [modalResult, setModalResult] = useState(false)
  const [messageModal, setMessageModal] = useState<string>('')
  const [modalType, setModalType] = useState<ModalType>()

  const [getSkuQuery,{ loading: loadingGetSku, error: errorGetSku, data: dataGetSku }] = useLazyQuery(getDataSku)
  const handles = useCssHandles(CSS_HANDLES)

  // const { updateQuantity } = useOrderItems()
  const { addItem } = useOrderItems()

  const intl = useIntl()

  let messagesInternationalization: any

  if (type === 'qr'){
     messagesInternationalization = defineMessages({
        messageModalError: { id: 'store/qr-reader.messageModalError' },
        messageModalSucces: { id: 'store/qr-reader.messageModalSucces' },
      })
  }else if (type === 'barcode'){
     messagesInternationalization = defineMessages({
        messageModalError: { id: 'store/barcode-reader.messageModalError' },
        messageModalSucces: { id: 'store/barcode-reader.messageModalSucces' },
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

    getSkuQuery({ variables: { ean: queryParam } })
  }, [])

  useEffect ( () => {
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
      // const productName: string = sku.NameComplete

      // setMessageModal(`${translateMessage(messagesInternationalization.messageModalSucces)} ${productName}`)
      // setModalType('succes')
      setSkuData(sku)
    }else{
      null
    }

  },[loadingGetSku,errorGetSku,dataGetSku]
  )

  useEffect(() => {
    if(!skuData) return
    // eslint-disable-next-line vtex/prefer-early-return
    if (skuData){
      console.info("skuData",skuData)
      addItem(
        [{
          id: skuData.Id,
          quantity: 1,
          seller: '1',
        }])
      setUse(false)
      setTimeout(() => {
        setUse(true)
      }, 1000);
  }
  }, [skuData])


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
            setUse(false)
            setTimeout(() => {
              setUse(true)
            }, 1);
          },
        }}
        cancelation={{
          onClick: () => {
            closeModalResult() 
            setUse(false)
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

