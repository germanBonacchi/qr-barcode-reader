import React, { useState, useEffect } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { Tag, ToastProvider, ToastConsumer } from 'vtex.styleguide'
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

let forceReload = false

const messages = defineMessages({
  readyToScan: { id: 'store/reader.readyToScan' },
  checkPermissions: { id: 'store/reader.checkPermissions' },
  askPermissions: { id: 'store/reader.askPermissions' },
  processing: { id: 'store/reader.processing' },
})

const GetPermissions = () => {
  const constraints = {
    video: {
      facingMode: 'environment',
    },
  }

  return navigator.mediaDevices.getUserMedia(constraints)
}

export default function BarcodeContainer({
  setButtonUseBarcode,
  action,
  mode,
}: BarcodeReaderProps) {
  const [ean, setEan] = useState('')
  const handles = useCssHandles(CSS_HANDLES)
  const [readBarcode, setReadBarcode] = useState<boolean>(true)
  const [dataURL, setDataURL] = useState<string | undefined>(undefined)
  const [modalShows, setModalShows] = useState<boolean>(false)

  const intl = useIntl()

  const translateMessage = (message: MessageDescriptor) =>
    intl.formatMessage(message)

  const [state, setState] = useState<string>(
    `${translateMessage(messages.checkPermissions)}`
  )

  useEffect(() => {
    if (!readBarcode) return

    GetPermissions()
      .then((stream) => {
        // workaround to reload on IOS devices
        // eslint-disable-next-line no-restricted-globals
        if (forceReload) window.location.reload()
        if (stream) {
          setEan('')
          setDataURL('')
          setModalShows(false)
          setState(`${translateMessage(messages.readyToScan)}`)
        }
      })
      .catch(() => {
        setState(`${translateMessage(messages.askPermissions)}`)
        forceReload = true
      })
  }, [readBarcode])

  return (
    <ToastProvider positioning="window">
      <div>
        <div className={`${handles.state} mb2`}>
          <Tag bgColor="#F71963">{state}</Tag>
        </div>
        {!readBarcode && (
          <img id="imgFromVideo" src={dataURL} style={{ minHeight: '375px' }} />
        )}

        {readBarcode && (
          <div className={`${handles.barcodeContainer} camStyle`}>
            <BarCodeScanner
              defaultImage={dataURL}
              onUpdate={(_, textResponse, dataURLResponse): void => {
                if (!textResponse) return

                if (dataURLResponse) {
                  setDataURL(dataURLResponse)
                }

                const text = textResponse.getText()

                setState(`${translateMessage(messages.processing)} ${text}`)
                setEan(text)
              }}
            />
          </div>
        )}
        {(readBarcode || modalShows) && (
          <div>
            {action === 'go-to-pdp' && ean && (
              <ToastConsumer>
                {({ showToast }) => (
                  <UseEanGoToPDP
                    setButton={setButtonUseBarcode}
                    setRead={setReadBarcode}
                    ean={ean}
                    type={'barcode'}
                    mode={mode}
                    setState={setState}
                    setModalShows={setModalShows}
                    showToast={showToast}
                  />
                )}
              </ToastConsumer>
            )}
            {action === 'add-to-cart' && ean && (
              <ToastConsumer>
                {({ showToast }) => (
                  <UseEanAddToCart
                    setButton={setButtonUseBarcode}
                    setRead={setReadBarcode}
                    ean={ean}
                    type={'barcode'}
                    mode={mode}
                    setState={setState}
                    setModalShows={setModalShows}
                    showToast={showToast}
                  />
                )}
              </ToastConsumer>
            )}
          </div>
        )}
      </div>
    </ToastProvider>
  )
}
