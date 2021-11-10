/* eslint-disable vtex/prefer-early-return */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react'
import QrReader from 'react-qr-scanner'
import { useCssHandles } from 'vtex.css-handles'
import { Tag, Spinner } from 'vtex.styleguide'
import type { MessageDescriptor } from 'react-intl'
import { useIntl, defineMessages } from 'react-intl'

import UseEanGoToPDP from './UseEan/go-to-pdp'
import UseEanAddToCart from './UseEan/add-to-cart'
// eslint-disable-next-line prettier/prettier
import type { QrReaderProps } from '../typings/global'
import formatQr from '../utils/formatQr'

import '../style/camStyle.global.css'
import '../style/Loading.global.css'

const CSS_HANDLES = ['qrContainer', 'state']

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
  const [useQr, setUseQr]: any = useState<boolean>(true)

  const [modalShows, setModalShows] = useState<boolean>(false)

  const [prevData, setPrevData] = useState<any>(null)
  const handles = useCssHandles(CSS_HANDLES)

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
    if (!useQr) return

    setEan('')
    setModalShows(false)
    setState(`${translateMessage(messagesInternationalization.readyToScan)}`)
  }, [useQr])

  const handleScan = (data: any) => {
    if (data && data.text !== prevData?.text) {
      setPrevData(data)
      setResult(data.text)
      setState(
        `${translateMessage(messagesInternationalization.processing)} ${
          data.text
        }`
      )
    }
  }

  const handleError = (err: any) => {
    console.error(err)
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

  console.info({ modalShows })

  return (
    <div>
      <div className={`${handles.state} mb2`}>
        <Tag bgColor="#F71963">{state}</Tag>
      </div>
      {!useQr && (
        <div className="loading-container">
          <Spinner />
        </div>
      )}
      {useQr && (
        <div className={`${handles.qrContainer} camStyle`}>
          <QrReader
            delay={delay}
            style={previewStyle}
            onError={handleError}
            onScan={handleScan}
          />
        </div>
      )}
      {(useQr || modalShows) && (
        <div>
          {action === 'go-to-pdp' && ean && (
            <UseEanGoToPDP
              setButton={setButtonUseQr}
              setUse={setUseQr}
              ean={ean}
              type={'qr'}
              mode={mode}
              setModalShows={setModalShows}
              setState={setState}
            />
          )}
          {action === 'add-to-cart' && ean && (
            <UseEanAddToCart
              setButton={setButtonUseQr}
              setUse={setUseQr}
              ean={ean}
              type={'qr'}
              mode={mode}
              setModalShows={setModalShows}
              setState={setState}
            />
          )}
        </div>
      )}
    </div>
  )
}
