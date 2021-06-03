import React, {useState} from 'react'
import QrContainer from './qr-scanner.js'

interface QrReaderProps {}


const QrReader: StorefrontFunctionComponent<QrReaderProps> = ({}) => {
  const [useQr, setUseQr]: any = useState(false)
  
  const onclickQrReader = () => {
    useQr?setUseQr(false):setUseQr(true)
  }

  return (
    <div>
      <button onClick={onclickQrReader}>
        Qr Reader
      </button>
      {useQr && <QrContainer/>}
    </div>  
  )
}

QrReader.schema = {
  title: 'editor.qr-reader.title',
  description: 'editor.qr-reader.description',
  type: 'object',
  properties: {},
}

export default QrReader
