/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from 'react'
import BarCodeScanner from 'barcode-react-scanner'

import UseEan from './useEan'

export default function BarcodeContainer() {
  const [ean, setEan] = useState('')

  return (
    <div>
      <BarCodeScanner
        onUpdate={(err, resp): void => {
          if (resp) {
            const text = resp.getText()

            setEan(text)
          }

          if (err) {
            console.log('err', err)
          }
        }}
      />
      {ean && <UseEan ean={ean} type={'barcode'} />}
    </div>
  )
}
