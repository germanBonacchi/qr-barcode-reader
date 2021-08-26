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

import BarcodeContainer from './barcode-scanner'

const CSS_HANDLES = ['BarcodeReader']

const BarcodeReaderWrapper: StorefrontFunctionComponent<any> = () => {
  const [useBarcode, setUseBarcode]: any = useState(false)

  const intl = useIntl()

  const messagesInternationalization = defineMessages({
    buttonOpenReader: { id: 'store/barcode-reader.buttonOpenReaderBarcode' },
  })

  const translateMessage = (message: MessageDescriptor) =>
  intl.formatMessage(message)


  const onclickBarcodeReader = () => {
    useBarcode?setUseBarcode(false):setUseBarcode(true)
  }

  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className={`${handles.BarcodeReader} c-muted-1 db tc`}>
      <button onClick={onclickBarcodeReader}>
      {`${translateMessage(messagesInternationalization.buttonOpenReader)}`}
      </button>
      {useBarcode && <BarcodeContainer/>}
    </div>  
  )
}

export default BarcodeReaderWrapper