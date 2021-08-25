/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, {useState} from 'react'
import { useCssHandles } from 'vtex.css-handles'
import type {
  MessageDescriptor} from 'react-intl';
import {
  useIntl,
  defineMessages,
} from 'react-intl'

import QrContainer from './qr-scanner'
import type { QrReaderProps } from "../typings/global"

const CSS_HANDLES = ['qrReader']

const QrReaderWrapper: StorefrontFunctionComponent<QrReaderProps> = ({separator, separatorApparition}) => {
  const [useQr, setUseQr]: any = useState(false)

  const intl = useIntl()

  const messagesInternationalization = defineMessages({
    buttonOpenReader: { id: 'store/qr-reader.buttonOpenReader' },
  })

  const translateMessage = (message: MessageDescriptor) =>
  intl.formatMessage(message)


  const onclickQrReader = () => {
    useQr?setUseQr(false):setUseQr(true)
  }

  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className={`${handles.qrReader} c-muted-1 db tc`}>
      <button onClick={onclickQrReader}>
      {`${translateMessage(messagesInternationalization.buttonOpenReader)}`}
      </button>
      {useQr && <QrContainer separator={separator} separatorApparition={separatorApparition}/>}
    </div>  
  )
}

export default QrReaderWrapper