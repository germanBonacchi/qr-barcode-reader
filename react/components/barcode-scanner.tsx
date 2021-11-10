import React, { useState, useEffect } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { Tag } from 'vtex.styleguide'
import type { MessageDescriptor } from 'react-intl'
import { useIntl, defineMessages } from 'react-intl'

import BarCodeScanner from './library/BarcodeScannerComponent'
import UseEanGoToPDP from './UseEan/go-to-pdp'
import UseEanAddToCart from './UseEan/add-to-cart'
import type { BarcodeReaderProps } from '../typings/global'

import '../style/camStyle.global.css'
import '../style/Loading.global.css'
import '../style/dbrScanner-video.global.css'

const CSS_HANDLES = ['barcodeContainer', 'state']

export default function BarcodeContainer({
  setButtonUseBarcode,
  action,
  mode,
}: BarcodeReaderProps) {
  const [ean, setEan] = useState('')
  const handles = useCssHandles(CSS_HANDLES)
  const [useBarcode, setUseBarcode] = useState<boolean>(true)
  const [dataURL, setDataURL] = useState<string | undefined>(undefined)
  const [modalShows, setModalShows] = useState<boolean>(false)

  const intl = useIntl()

  const messagesInternationalization = defineMessages({
    readyToScan: { id: 'store/reader.readyToScan' },
    processing: { id: 'store/reader.processing' },
  })

  const translateMessage = (message: MessageDescriptor) =>
    intl.formatMessage(message)

  const [state, setState] = useState<string>(
    `${translateMessage(messagesInternationalization.readyToScan)}`
  )

  useEffect(() => {
    if (!useBarcode) return

    setEan('')
    setDataURL('')
    setModalShows(false)
    setState(`${translateMessage(messagesInternationalization.readyToScan)}`)
  }, [useBarcode])

  return (
    <div>
      <div className={`${handles.state} mb2`}>
        <Tag bgColor="#F71963">{state}</Tag>
      </div>
      {!useBarcode && (
        <img id="imgFromVideo" src={dataURL} style={{ minHeight: '375px' }} />
      )}

      {useBarcode && (
        <div className={`${handles.barcodeContainer} camStyle`}>
          <BarCodeScanner
            defaultImage={dataURL}
            onUpdate={(_, textResponse, dataURLResponse): void => {
              if (dataURLResponse) {
                setDataURL(dataURLResponse)
              }

              // eslint-disable-next-line vtex/prefer-early-return
              if (textResponse) {
                const text = textResponse.getText()

                setState(
                  `${translateMessage(
                    messagesInternationalization.processing
                  )} ${text}`
                )
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
