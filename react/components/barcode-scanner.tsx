import React, { useState, useEffect } from 'react'
import { useCssHandles } from 'vtex.css-handles'

import BarCodeScanner from './library/BarcodeScannerComponent'
import UseEanGoToPDP from './UseEan/go-to-pdp'
import UseEanAddToCart from './UseEan/add-to-cart'
import type { BarcodeReaderProps } from '../typings/global'
import '../style/camStyle.global.css'
import '../style/Loading.global.css'
import '../style/dbrScanner-video.global.css'

const CSS_HANDLES = ['barcodeContainer']

export default function BarcodeContainer({
  setButtonUseBarcode,
  action,
  mode,
}: BarcodeReaderProps) {
  const [ean, setEan] = useState('')
  const handles = useCssHandles(CSS_HANDLES)
  const [useBarcode, setUseBarcode] = useState<boolean>(true)
  const [dataURL, setDataURL] = useState<string | undefined>(undefined)
  const [state, setState] = useState<string>('Ready to Scan')
  const [modalShows, setModalShows] = useState<boolean>(false)

  useEffect(() => {
    if (!useBarcode) return

    setEan('')
    setDataURL('')
    setModalShows(false)
    setState('Ready to Scan')
  }, [useBarcode])

  return (
    <div>
      <div className={`camStyle`}>
        <div className="pa3 br2 c-action-primary hover-c-action-primary active-c-action-primary dib mr5 mv0 ba b--action-primary hover-b-action-primary active-b-action-primary">
          {state}
        </div>
      </div>

      {!useBarcode && (
        <img id="imgFromVideo" src={dataURL} style={{ minHeight: '375px' }} />
      )}

      {useBarcode && (
        <div className={`${handles.QrContainer} camStyle`}>
          <BarCodeScanner
            defaultImage={dataURL}
            onUpdate={(_, textResponse, dataURLResponse): void => {
              if (dataURLResponse) {
                setDataURL(dataURLResponse)
              }

              // eslint-disable-next-line vtex/prefer-early-return
              if (textResponse) {
                const text = textResponse.getText()

                setState(`Procesando ${text}`)
                setEan(text)
              }
            }}
          />
        </div>
      )}
      {(useBarcode || modalShows) && (
        <div>
          {action === 'go-to-pdp' && ean && (
            <UseEanGoToPDP
              setButton={setButtonUseBarcode}
              setUse={setUseBarcode}
              ean={ean}
              type={'barcode'}
              mode={mode}
              setState={setState}
              setModalShows={setModalShows}
            />
          )}
          {action === 'add-to-cart' && ean && (
            <UseEanAddToCart
              setButton={setButtonUseBarcode}
              setUse={setUseBarcode}
              ean={ean}
              type={'barcode'}
              mode={mode}
              setState={setState}
              setModalShows={setModalShows}
            />
          )}
        </div>
      )}
    </div>
  )
}
