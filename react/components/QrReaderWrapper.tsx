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
import { Button } from 'vtex.styleguide'

import QrContainer from './qr-scanner'
import type { QrReaderProps } from "../typings/global"

const CSS_HANDLES = ['qrReader']

const QrReaderWrapper: StorefrontFunctionComponent<QrReaderProps> = ({separator, separatorApparition}) => {
  const [useQr, setUseQr]: any = useState<boolean>(false)

  const intl = useIntl()

  const messagesInternationalization = defineMessages({
    buttonOpenReader: { id: 'store/qr-reader.buttonOpenReaderQr' },
  })

  const translateMessage = (message: MessageDescriptor) =>
  intl.formatMessage(message)


  const onclickQrReader = () => {
    setUseQr(!useQr)
  }

  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className={`${handles.qrReader} c-muted-1 db tc`}>
      <div className="mb4">
        <Button onClick={onclickQrReader}>
        {`${translateMessage(messagesInternationalization.buttonOpenReader)}`}
        </Button>
      </div>
      {useQr && <QrContainer setUseQr={setUseQr}separator={separator} separatorApparition={separatorApparition}/>}
    </div>  
  )
}

export default QrReaderWrapper