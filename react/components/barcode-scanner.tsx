/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from 'react'
import BarCodeScanner from 'barcode-react-scanner'
import { useCssHandles } from 'vtex.css-handles'

import UseEan from './useEan'
import { BarcodeReaderProps } from '../typings/global'
import '../style/camStyle.global.css'

import '../style/dbrScanner-video.global.css'

const CSS_HANDLES = ['BarcodeContainer']

export default function BarcodeContainer({
  setUseBarcode,
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
      {ean && <UseEan setUse={setUseBarcode} ean={ean} type={'barcode'} />}
    </div>
  )
}
