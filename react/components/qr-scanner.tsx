import React, { useState, useEffect } from 'react'
import QrReader from 'react-qr-scanner'
import type { QrReaderProps } from '../typings/global'

import formatQr from './formatQr'
import apiCallGetSkuByEan from './apiCallGetSkuByEan.js'

import { Modal, Spinner } from 'vtex.styleguide'

export default function QrContainer({separator,separatorApparition}: QrReaderProps) {
  const delay = 3000
  const [result, setResult] = useState(null)  
  const [ean, setEan] = useState(null)
  const [skuData, setSkuData] = useState<any>(null)
  const [isRedirect, setIsRedirect] = useState<boolean>(false)
  const [prevData, setPrevData] = useState<any>(null)
  
  const [modalResult, setModalResult] = useState(false)
  const [messageModal, setMessageModal] = useState<string>('')

  const openModalResult = () => {
    setModalResult(true)
  }

  const closeModalResult = () => {
    setModalResult(false)
  }

  const handleScan = (data: any) => {
    if (data && data.text!==prevData?.text){
      setPrevData(data)
      setResult(data.text)
    }
  }
  
  const handleError = (err: any) => {
    console.log(err)
  }


  useEffect(() => {
    if (result){
      setEan(formatQr(result,separator,separatorApparition))
    }
  }, [result])

  useEffect(() => {
    if (ean){
      openModalResult()
      const getSkuByEan = apiCallGetSkuByEan(ean)
      getSkuByEan.then(response => {
        if(response.status === 200){
          const product: string = response.data.NameComplete
          setMessageModal(`Te redigiremos al Producto ${product}`)
          if(skuData != response.data){
            setSkuData(response.data)
          }
        }else{
          setMessageModal(`El Qr mostrado no concide con ningun producto, por favor intente con otro.`)
        }
      });
    }
  }, [ean])

  useEffect(() => {
    if (skuData){
      if (!isRedirect){
        const skuLink = skuData.DetailUrl + '?skuId=' + skuData.Id
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