import React, { useEffect, useState } from 'react'
import type { Result } from '@zxing/library'
import { BrowserBarcodeReader } from '@zxing/library'

const BarCodeScanner = ({
  defaultImage,
  onUpdate,
}: {
  defaultImage: string | undefined
  onUpdate(err: unknown, result: Result | undefined, dataURL: string): void
}): JSX.Element => {
  const codeReader = new BrowserBarcodeReader()
  let dataAuxURL = ''
  const [dataURL, setDataURL] = useState(defaultImage)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const videoInput: any = document.getElementById('video')

    codeReader.tryPlayVideo(videoInput).then(() => {
      setDataURL('')
    })

    codeReader.listVideoInputDevices().then((devices) => {
      let deviceSuggested: MediaDeviceInfo

      if (devices.length === 1) {
        deviceSuggested = devices[0]
      } else if (devices.length > 1) {
        deviceSuggested = devices.filter(
          (device) =>
            (device.label.includes('back') && device.label.includes('0')) ||
            (device.label.includes('trasera') && device.label.includes('0'))
        )[0]
          ? devices.filter(
              (device) =>
                (device.label.includes('back') && device.label.includes('0')) ||
                (device.label.includes('trasera') && device.label.includes('0'))
            )[0]
          : devices.filter(
              (device) =>
                device.label.includes('back') ||
                device.label.includes('trasera')
            )[0]
      } else {
        deviceSuggested = {
          deviceId: '',
          label: '',
          groupId: '',
          kind: 'videoinput',
          toJSON: () => {},
        }
      }

      const { deviceId } = deviceSuggested

      codeReader.decodeOnceFromVideoDevice(deviceId, 'video').then((result) => {
        if (!result) return
        if (videoInput) {
          const canvas = document.createElement('canvas')

          canvas.width = videoInput.clientWidth
          canvas.height = videoInput.clientHeight
          canvas
            .getContext('2d')
            ?.drawImage(videoInput, 0, 0, canvas.width, canvas.height)
          dataAuxURL = canvas.toDataURL()
          setDataURL(dataAuxURL)
        }

        onUpdate(null, result, dataAuxURL)
        codeReader.reset()
      })
    })

    return (): void => {
      codeReader.reset()
    }
  }, [])

  return (
    <div
      id="scanner-container"
      style={{ position: 'relative', minHeight: '375px' }}
    >
      {dataURL && (
        <img
          id="imgFromVideo"
          style={{ position: 'absolute', left: 0 }}
          src={dataURL}
        />
      )}
      <video id="video" className="dbrScanner-video" playsInline />
    </div>
  )
}

export default BarCodeScanner
