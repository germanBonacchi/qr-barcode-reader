import React, { useState, useEffect } from 'react'
import { QrReader } from 'react-qr-reader';
import { useCssHandles } from 'vtex.css-handles'
import { Tag, Spinner, ToastProvider, ToastConsumer } from 'vtex.styleguide'
import type { MessageDescriptor } from 'react-intl'
import { useIntl, defineMessages } from 'react-intl'

import UseEanGoToPDP from './UseEan/go-to-pdp'
import UseEanAddToCart from './UseEan/add-to-cart'
import type { QrReaderProps } from '../typings/global'
import formatQr from '../utils/formatQr'
import '../style/camStyle.global.css'
import '../style/Loading.global.css'

const CSS_HANDLES = ['qrContainer', 'state']

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

export default function QrContainer({
  setButtonUseQr,
  separator,
  eanIndex,
  action,
  mode,
}: QrReaderProps) {
  const constraints = { facingMode: 'environment'}
  const delay = 2000
  const [result, setResult] = useState(null)
  const [ean, setEan] = useState<string>('')
  const [readQr, setReadQr] = useState<boolean>(true)

  const [modalShows, setModalShows] = useState<boolean>(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [prevData, setPrevData] = useState<any>(null)
  const handles = useCssHandles(CSS_HANDLES)

  const intl = useIntl()

  const translateMessage = (message: MessageDescriptor) =>
    intl.formatMessage(message)

  const [state, setState] = useState<string>(
    `${translateMessage(messages.checkPermissions)}`
  )

  useEffect(() => {
    if (readQr) {
      setEan('')
      setResult(null)
      prevData && setPrevData(null)
      setModalShows(false)
      setState(`${translateMessage(messages.readyToScan)}`)

      return
    }

    GetPermissions()
      .then((stream) => {
        // workaround to reload on IOS devices
        // eslint-disable-next-line no-restricted-globals
        if (forceReload) window.location.reload()
        if (stream) {
          setEan('')
          setResult(null)
          prevData && setPrevData(null)
          setModalShows(false)
          setState(`${translateMessage(messages.readyToScan)}`)
        }
      })
      .catch(() => {
        setState(`${translateMessage(messages.askPermissions)}`)
        forceReload = true
      })
  }, [readQr])

  const handleScan = (data) => {
    if (!data || data?.text === prevData?.text) return

    setPrevData(data)
    setResult(data.text)
    setState(`${translateMessage(messages.processing)} ${data.text}`)
  }

  useEffect(() => {
    if (!result) return

    setEan(formatQr(result, separator, eanIndex))
  }, [result])

  const previewStyle = {
    heigth: 500,
    width: 500,
    display: 'flex',
    justifyContent: 'center',
  }

  return (
    <ToastProvider positioning="window">
      <div>
        <div className={`${handles.state} mb2`}>
          <Tag bgColor="#F71963">{state}</Tag>
        </div>
        {(!readQr || modalShows) && (
          <div className="loading-container">
            <Spinner />
          </div>
        )}
        {readQr && !modalShows && (
          <div className={`${handles.qrContainer} camStyle`}>
            <QrReader
            constraints={constraints}
              scanDelay={delay}
              containerStyle={previewStyle}
              onResult={handleScan}
            />
          </div>
        )}
        {(readQr || modalShows) && (
          <div>
            {action === 'go-to-pdp' && ean && (
              <ToastConsumer>
                {({ showToast }) => (
                  <UseEanGoToPDP
                    setButton={setButtonUseQr}
                    setRead={setReadQr}
                    ean={ean}
                    type={'qr'}
                    mode={mode}
                    setModalShows={setModalShows}
                    setState={setState}
                    showToast={showToast}
                  />
                )}
              </ToastConsumer>
            )}
            {action === 'add-to-cart' && ean && (
              <ToastConsumer>
                {({ showToast }) => (
                  <UseEanAddToCart
                    setButton={setButtonUseQr}
                    setRead={setReadQr}
                    ean={ean}
                    type={'qr'}
                    mode={mode}
                    setModalShows={setModalShows}
                    setState={setState}
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
