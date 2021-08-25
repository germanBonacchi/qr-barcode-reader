import React, {useState} from 'react'
//import QrContainer from './qr-scanner.js'
import QrContainer from './qr-scanner'

import { useCssHandles } from 'vtex.css-handles'
import type { QrReaderProps } from './../typings/global'

const CSS_HANDLES = ['qrReader']

const QrReaderWrapper: StorefrontFunctionComponent<QrReaderProps> = ({separator, separatorApparition}) => {
  const [useQr, setUseQr]: any = useState(false)
  
  const onclickQrReader = () => {
    useQr?setUseQr(false):setUseQr(true)
  }

  const handles = useCssHandles(CSS_HANDLES)
  return (
    <div className={`${handles.qrReader} c-muted-1 db tc`}>
      <button onClick={onclickQrReader}>
        Qr Reader
      </button>
      {useQr && <QrContainer separator={separator} separatorApparition={separatorApparition}/>}
    </div>  
  )
}

QrReaderWrapper.schema = {
  title: 'editor.qr-reader.title',
  description: 'editor.qr-reader.description',
  type: 'object',
  properties: {},
}

export default QrReaderWrapper