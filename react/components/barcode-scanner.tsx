/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react'
import BarCodeScanner from 'barcode-react-scanner'
import { useCssHandles } from 'vtex.css-handles'
import { Spinner, Alert } from 'vtex.styleguide'

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
}: BarcodeReaderProps) {
  const [ean, setEan] = useState('')
  const handles = useCssHandles(CSS_HANDLES)
  const [useBarcode, setUseBarcode]: any = useState<boolean>(true)

  const [successAlert, setSuccessAlert]: any = useState<string>('')

  useEffect(() => {
    if (!useBarcode) {
      setEan('')
    }
  }, [useBarcode])

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
      {useBarcode && (
        <div className={`${handles.QrContainer} camStyle`}>
          <BarCodeScanner
            onUpdate={(_, resp): void => {
              if (resp) {
                const text = resp.getText()

                setEan(text)
              }
            }}
          />
          {action === 'go-to-pdp' && ean && (
            <UseEanGoToPDP
              setSuccessAlert={null}
              setButton={setButtonUseBarcode}
              setUse={setUseBarcode}
              ean={ean}
              type={'barcode'}
            />
          )}
          {action === 'add-to-cart' && ean && (
            <UseEanAddToCart
              setSuccessAlert={setSuccessAlert}
              setButton={setButtonUseBarcode}
              setUse={setUseBarcode}
              ean={ean}
              type={'barcode'}
            />
          )}
        </div>
      )}
      {!useBarcode && (
        <div className="loading-container">
          <Spinner />
        </div>
      )}
    </div>
  )
}
