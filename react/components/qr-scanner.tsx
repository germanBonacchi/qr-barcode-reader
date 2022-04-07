import React, { useState, useEffect } from 'react'
import QrReader from 'react-qr-scanner'
import { useCssHandles } from 'vtex.css-handles'
import { Tag, Spinner, ToastProvider, ToastConsumer } from 'vtex.styleguide'
import type { MessageDescriptor } from 'react-intl'
import { useIntl, defineMessages } from 'react-intl'
import { useMutation } from 'react-apollo'

import UseEanGoToPDP from './UseEan/go-to-pdp'
import UseEanAddToCart from './UseEan/add-to-cart'
import type { QrReaderProps } from '../typings/global'
import formatQr from '../utils/formatQr'
import logger from '../graphql/logger.gql'
import saveLog from '../utils/saveLog'
import '../style/camStyle.global.css'
import '../style/Loading.global.css'

const CSS_HANDLES = ['qrContainer', 'state']

const messages = defineMessages({
  readyToScan: { id: 'store/reader.readyToScan' },
  checkPermissions: { id: 'store/reader.checkPermissions' },
  askPermissions: { id: 'store/reader.askPermissions' },
  processing: { id: 'store/reader.processing' },
})

const GetPermissions = () => {
  return navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: 'environment',
    },
  })
}

export default function QrContainer({
  setButtonUseQr,
  separator,
  eanIndex,
  action,
  mode,
}: QrReaderProps) {
  const delay = 3000
  const [result, setResult] = useState(null)
  const [ean, setEan] = useState<string>('')
  const [readQr, setReadQr] = useState<boolean>(true)

  const [modalShows, setModalShows] = useState<boolean>(false)
  const [loggerMutation] = useMutation(logger)

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
    if (!readQr) return

    GetPermissions()
      .then((stream) => {
        if (stream) {
          setEan('')
          setModalShows(false)
          setState(`${translateMessage(messages.readyToScan)}`)
        }
      })
      .catch(() => setState(`${translateMessage(messages.askPermissions)}`))
  }, [readQr])

  const handleScan = (data) => {
    if (!data || data?.text === prevData?.text) return

    setPrevData(data)
    setResult(data.text)
    setState(`${translateMessage(messages.processing)} ${data.text}`)
  }

  const handleError = (err) => {
    saveLog('qr handleError', err, loggerMutation)
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
        {!readQr && (
          <div className="loading-container">
            <Spinner />
          </div>
        )}
        {readQr && (
          <div className={`${handles.qrContainer} camStyle`}>
            <QrReader
              delay={delay}
              style={previewStyle}
              onError={handleError}
              onScan={handleScan}
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
