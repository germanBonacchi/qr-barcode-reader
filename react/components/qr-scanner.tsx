/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react'
import QrReader from 'react-qr-scanner'

import UseEan from './useEan'
import type { QrReaderProps } from '../typings/global'
import formatQr from '../utils/formatQr'

export default function QrContainer({separator,separatorApparition}: QrReaderProps) {
  const delay = 3000
  const [result, setResult] = useState(null)  
  const [ean, setEan] = useState<string>('')

  const [prevData, setPrevData] = useState<any>(null)
  

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
      {ean && <UseEan ean={ean} type={'qr'} />}
    </div> 
  )
}