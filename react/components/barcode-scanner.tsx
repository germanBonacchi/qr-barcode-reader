/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from 'react'
import BarCodeScanner from 'barcode-react-scanner'
import { useCssHandles } from 'vtex.css-handles'

import UseEanGoToPDP from './UseEan/go-to-pdp'
import UseEanAddToCart from './UseEan/add-to-cart'
import { BarcodeReaderProps } from '../typings/global'
import '../style/camStyle.global.css'

import '../style/dbrScanner-video.global.css'

const CSS_HANDLES = ['barcodeContainer']

export default function BarcodeContainer({
  setUseBarcode,
  action,
}: BarcodeReaderProps) {
  const [ean, setEan] = useState('')
  const handles = useCssHandles(CSS_HANDLES)

  return (
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
        <UseEanGoToPDP setUse={setUseBarcode} ean={ean} type={'barcode'} />
      )}
      {action === 'add-to-cart' && ean && (
        <UseEanAddToCart setUse={setUseBarcode} ean={ean} type={'barcode'} />
      )}
    </div>
  )
}
