import React, { useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import type { MessageDescriptor } from 'react-intl'
import { useIntl, defineMessages } from 'react-intl'
import { ButtonWithIcon } from 'vtex.styleguide'
import Search from '@vtex/styleguide/lib/icon/Search'

import type { BarcodeReaderWrapperProps } from '../typings/global'
import BarcodeContainer from './barcode-scanner'

const CSS_HANDLES = ['barcodeReaderWrapper', 'barcodeReaderButton']

const BarcodeReaderWrapper: StorefrontFunctionComponent<
  BarcodeReaderWrapperProps
> = ({ action, mode }) => {
  const [readBarcode, setReadBarcode] = useState<boolean>(false)

  const intl = useIntl()
  const searchIcon = <Search />
  const messagesInternationalization = defineMessages({
    buttonOpenReader: { id: 'store/barcode-reader.buttonOpenReaderBarcode' },
  })

  const translateMessage = (message: MessageDescriptor) =>
    intl.formatMessage(message)

  const onclickBarcodeReader = () => {
    setReadBarcode(!readBarcode)
  }

  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className={`${handles.barcodeReaderWrapper} c-muted-1 db tc`}>
      <div className={`${handles.barcodeReaderButton} mb2`}>
        <ButtonWithIcon
          icon={searchIcon}
          variation="primary"
          onClick={onclickBarcodeReader}
        >
          {`${translateMessage(messagesInternationalization.buttonOpenReader)}`}
        </ButtonWithIcon>
      </div>
      {readBarcode && (
        <BarcodeContainer
          setButtonUseBarcode={setReadBarcode}
          action={action}
          mode={mode}
        />
      )}
    </div>
  )
}

export default BarcodeReaderWrapper
