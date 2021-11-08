/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react'
import { useCssHandles } from 'vtex.css-handles'

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
  const [dataURL, setDataURL] = useState<string | undefined>(undefined)
  const [successAlert, setSuccessAlert]: any = useState<string>('')
  const [state, setState]: any = useState<string>('Ready to Scan')

  useEffect(() => {
    if (!useBarcode) return
    if (useBarcode){
      setEan('')
      setDataURL('')
      setState('Ready to Scan')
    }

  }, [useBarcode])

  console.info({successAlert})
  return (
    <div>
    <div className={`camStyle`}>
      <p>{state}</p>
    </div>

    {!useBarcode && 
      <img id="imgFromVideo" src={dataURL} style={{minHeight: '375px'}}/>
    }

    {useBarcode && (
      <div className={`${handles.QrContainer} camStyle`}>
        <BarCodeScanner
          defaultImage={dataURL}

          onUpdate={(_, textResponse, dataURLResponse): void => {
            if (dataURLResponse) {
              setDataURL(dataURLResponse)
            }
            if (textResponse) {
              const text = textResponse.getText()
              setState('Procesando ', text)
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
    )}
      
    </div>
  )
}
