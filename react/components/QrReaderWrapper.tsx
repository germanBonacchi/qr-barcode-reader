import React, { useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import type { MessageDescriptor } from 'react-intl'
import { useIntl, defineMessages } from 'react-intl'
import { ButtonWithIcon } from 'vtex.styleguide'
import Search from '@vtex/styleguide/lib/icon/Search'

import QrContainer from './qr-scanner'
import type { QrReaderProps } from '../typings/global'

const CSS_HANDLES = ['qrReaderWrapper', 'qrReaderButton']

const QrReaderWrapper: StorefrontFunctionComponent<QrReaderProps> = ({
  separator,
  eanIndex,
  action,
  mode,
}) => {
  const [readQr, setReadQr] = useState<boolean>(false)

  const intl = useIntl()
  const searchIcon = <Search />

  const messagesInternationalization = defineMessages({
    buttonOpenReader: { id: 'store/qr-reader.buttonOpenReaderQr' },
  })

  const translateMessage = (message: MessageDescriptor) =>
    intl.formatMessage(message)

  const onclickQrReader = () => {
    setReadQr(!readQr)
  }

  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className={`${handles.qrReaderWrapper} c-muted-1 db tc`}>
      <div className={`${handles.qrReaderButton} mb2`}>
        <ButtonWithIcon icon={searchIcon} onClick={onclickQrReader}>
          {`${translateMessage(messagesInternationalization.buttonOpenReader)}`}
        </ButtonWithIcon>
      </div>
      {readQr && (
        <QrContainer
          setButtonUseQr={setReadQr}
          separator={separator}
          eanIndex={eanIndex}
          action={action}
          mode={mode}
        />
      )}
    </div>
  )
}

export default QrReaderWrapper
