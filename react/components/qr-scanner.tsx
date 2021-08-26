/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react'
import QrReader from 'react-qr-scanner'
import { useCssHandles } from 'vtex.css-handles'

import UseEan from './useEan'
// eslint-disable-next-line prettier/prettier
import type { QrReaderProps } from '../typings/global'
import formatQr from '../utils/formatQr'

import '../style/camStyle.global.css'

const CSS_HANDLES = ['QrContainer']

export default function QrContainer({setUseQr,separator,separatorApparition}: QrReaderProps) {
  const delay = 3000
  const [result, setResult] = useState(null)  
  const [ean, setEan] = useState<string>('')

  const [prevData, setPrevData] = useState<any>(null)
  const handles = useCssHandles(CSS_HANDLES)

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

  return (
    <div>
      <div className={`${handles.QrContainer} camStyle`}>
        <QrReader
          delay={delay}
          style={previewStyle}
          onError={handleError}
          onScan={handleScan}
        />   
      </div>
      {ean && <UseEan setUse = {setUseQr} ean={ean} type={'qr'} />}
    </div> 
  )
}