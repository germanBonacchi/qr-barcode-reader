/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react'
import BarCodeScanner from 'barcode-react-scanner'
import { useLazyQuery } from 'react-apollo'
import { Modal, Spinner } from 'vtex.styleguide'

import type {
  MessageDescriptor} from 'react-intl';
import {
  useIntl,
  defineMessages,
} from 'react-intl'

import type { SkuDataType } from '../typings/global'
import getDataSku from '../graphql/getSku.gql'


export default function BarcodeContainer() {
  const [ data, setData ] = useState('');

  const [skuData, setSkuData] = useState<SkuDataType>()
  const [isRedirect, setIsRedirect] = useState<boolean>(false)

  const [getSkuQuery,{ loading: loadingGetSku, error: errorGetSku, data: dataGetSku }] = useLazyQuery(getDataSku)
  const [modalResult, setModalResult] = useState(false)
  const [messageModal, setMessageModal] = useState<string>('')
  const intl = useIntl()

  const messagesInternationalization = defineMessages({
    messageModalError: { id: 'store/barcode-reader.messageModalError' },
    messageModalSucces: { id: 'store/barcode-reader.messageModalSucces' },
  })

  const translateMessage = (message: MessageDescriptor) =>
  intl.formatMessage(message)

  const openModalResult = () => {
    setModalResult(true)
  }

  const closeModalResult = () => {
    setModalResult(false)
  }

  useEffect(() => {
    if (data){
      getSkuQuery({ variables: { ean: data } })
    }
  }, [data])

  useEffect ( () => {
    if(loadingGetSku){
      setMessageModal(``)
      openModalResult()
    }

    if(errorGetSku){
      setMessageModal(`${translateMessage(messagesInternationalization.messageModalError)}`)
    }

    if(dataGetSku){
      const sku: SkuDataType = dataGetSku.getSku.data
      const productName: string = sku.NameComplete
      setMessageModal(`${translateMessage(messagesInternationalization.messageModalSucces)} ${productName}`)
      setSkuData(sku)
    }else{
      null
    }

  },[loadingGetSku,errorGetSku,dataGetSku]
  )

  useEffect(() => {
    if (skuData){
      if (!isRedirect){
        const skuLink = `${skuData.DetailUrl}?skuId=${skuData.Id}`

        setIsRedirect(true)
        window.location.replace(skuLink)
      }
    }
  }, [skuData])

  return (
    <div>
      <BarCodeScanner
        onUpdate={(err, resp): void => {
          if (resp) {
            const text = resp.getText()
            setData(text)
          }
          if (err) {
            console.log('err', err)
          }
        }}
      />
      <Modal
        centered
        isOpen={modalResult}
        onClose={() => {closeModalResult()}}>
        <div>
          <h3 className="t-heading-3 items-center">{messageModal}</h3>
          {(isRedirect || messageModal === '') && <div className="loading-container"><Spinner /></div>}
        </div>
      </Modal>

    </div> 
  )
}