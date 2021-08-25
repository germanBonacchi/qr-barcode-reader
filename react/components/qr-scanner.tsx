/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react'
import QrReader from 'react-qr-scanner'
import { Modal, Spinner } from 'vtex.styleguide'
import { useLazyQuery } from 'react-apollo'
import type {
  MessageDescriptor} from 'react-intl';
import {
  useIntl,
  defineMessages,
} from 'react-intl'

import type { QrReaderProps, SkuDataType } from '../typings/global'
import formatQr from '../utils/formatQr'
import getDataSku from '../graphql/getSku.gql'


export default function QrContainer({separator,separatorApparition}: QrReaderProps) {
  const delay = 3000
  const [result, setResult] = useState(null)  
  const [ean, setEan] = useState<string>('')
  const [skuData, setSkuData] = useState<SkuDataType>()
  const [isRedirect, setIsRedirect] = useState<boolean>(false)
  const [prevData, setPrevData] = useState<any>(null)
  
  const [modalResult, setModalResult] = useState(false)
  const [messageModal, setMessageModal] = useState<string>('')

  const [getSkuQuery,{ loading: loadingGetSku, error: errorGetSku, data: dataGetSku }] = useLazyQuery(getDataSku)

  const intl = useIntl()

  const messagesInternationalization = defineMessages({
    messageModalError: { id: 'store/qr-reader.messageModalError' },
    messageModalSucces: { id: 'store/qr-reader.messageModalSucces' },
  })

  const translateMessage = (message: MessageDescriptor) =>
  intl.formatMessage(message)

  const openModalResult = () => {
    setModalResult(true)
  }

  const closeModalResult = () => {
    setModalResult(false)
    setPrevData(null)
  }

  const handleScan = (data: any) => {
    if (data && data.text!==prevData?.text){
      setPrevData(data)
      setResult(data.text)
    }
  }
  
  const handleError = (err: any) => {
    console.error(err)
  }

  useEffect(() => {
    if (result){
      setEan(formatQr(result,separator,separatorApparition))
    }
  }, [result])

  useEffect(() => {
    if (ean){
      const queryParam = ean

      getSkuQuery({ variables: { ean: queryParam } })
    }
  }, [ean])


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

  const previewStyle = {
    heigth: 500,
    width: 500,
    display: 'flex',
    justifyContent: "center"
  }

  const camStyle = {
    display : 'flex',
    justifyContent: "center",
    marginTop: '0px'
  }

  return (
    <div>
      <div style={camStyle}>
        <QrReader
          delay={delay}
          style={previewStyle}
          onError={handleError}
          onScan={handleScan}
        />   
      </div>
      <Modal
        centered
        isOpen={modalResult}
        onClose={() => {closeModalResult()}}>
        <div>
          <h3 className="t-heading-3 items-center">{messageModal}</h3>
          {isRedirect && <div className="loading-container"><Spinner /></div>}
        </div>
      </Modal>
    </div> 
  )
}