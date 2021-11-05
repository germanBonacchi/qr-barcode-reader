/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { Spinner, Alert } from 'vtex.styleguide'
import type { Result } from '@zxing/library';

import BarCodeScanner from './library/BarcodeScannerComponent'
import UseEanGoToPDP from './UseEan/go-to-pdp'
import UseEanAddToCart from './UseEan/add-to-cart'
import { BarcodeReaderProps } from '../typings/global'
import '../style/camStyle.global.css'
import '../style/Loading.global.css'
import '../style/Success.global.css'
import '../style/dbrScanner-video.global.css'

const CSS_HANDLES = ['barcodeContainer']

export default function BarcodeContainer({
  setButtonUseBarcode,
  action,
  mode,
}: BarcodeReaderProps) {
  const [ean, setEan] = useState('')
  const handles = useCssHandles(CSS_HANDLES)
  const [useBarcode, setUseBarcode]: any = useState<boolean>(true)
  const [successAlert, setSuccessAlert]: any = useState<string>('')
  const [state, setState]: any = useState<string>('')
  const [response, setResponse]: any = useState<Result | null>()
  useEffect(() => {
    if (!useBarcode) return

    setEan('')
  }, [useBarcode])

  useEffect(() => {
    if (response) {
      console.info('response', response)
      const text = response.getText()
      setEan(response.getText())
      setState('Procesando: ' + text)
    }
  }, [response])

  useEffect(() => {
    if (!state) {
      console.info('here we go again')
      setResponse(null)
      setEan('')
    }
  }, [state])
  return (
    <div>
      {successAlert && (
        <div className="success-container">
          <Alert
            type="success"
            autoClose={1000}
            onClose={() => setSuccessAlert('')}
          >
            {successAlert}
          </Alert>
        </div>
      )}
      {state && <p>{state}</p>}
        <div className={`${handles.QrContainer} camStyle`}>
          <BarCodeScanner
            state={state}
            response={response}
            setResponse={setResponse}
          />
        
          {action === 'go-to-pdp' && ean && (
            <UseEanGoToPDP
              setSuccessAlert={null}
              setButton={setButtonUseBarcode}
              setUse={setUseBarcode}
              ean={ean}
              type={'barcode'}
              mode={mode}
              setState={setState}
            />
          )}
          {action === 'add-to-cart' && ean && (
            <UseEanAddToCart
              setSuccessAlert={setSuccessAlert}
              setButton={setButtonUseBarcode}
              setUse={setUseBarcode}
              ean={ean}
              type={'barcode'}
              mode={mode}
              setState={setState}
            />
          )}
        </div>

      {!useBarcode && (
        <div className="loading-container">
          <Spinner />
        </div>
      )}
    </div>
  )
}
