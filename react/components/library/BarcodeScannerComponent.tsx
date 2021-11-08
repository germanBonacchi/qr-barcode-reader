import React, { useEffect,useState } from 'react'
import type { Result } from '@zxing/library';
import { BrowserBarcodeReader } from '@zxing/library'

const BarCodeScanner = ({defaultImage,onUpdate, }: {
  defaultImage: string | undefined
  onUpdate(err: unknown, result: Result | undefined, dataURL: string): void
}): JSX.Element => {
  const codeReader = new BrowserBarcodeReader()  
  let dataAuxURL: string = ''
  const [dataURL, setDataURL] = useState(defaultImage)

  useEffect(() => {
    const videoInput: any = document.getElementById("video")

    codeReader.listVideoInputDevices().then(devices => {
      let deviceSuggested: MediaDeviceInfo 
      
      if (devices.length === 1){
        deviceSuggested = devices[0]
      } else if (devices.length > 1) {
        deviceSuggested = devices.filter(device => device.label.includes('back') && device.label.includes('0'))[0] ? devices.filter(device => device.label.includes('back') && device.label.includes('0'))[0] : devices.filter(device => device.label.includes('back'))[0] 
      } else {
        deviceSuggested =  {deviceId: '', label: '', groupId: '', kind: 'videoinput', toJSON: () => {}}
      } 

      const {deviceId} = deviceSuggested

      codeReader.decodeFromVideoDevice(deviceId, 'video', result => {

        codeReader.tryPlayVideo(videoInput).then(() => {
          setDataURL('')
          if (result) {
            const video: any = document.getElementById("video");
            if (video){
              const canvas = document.createElement("canvas");
              canvas.width = video.clientWidth;
              canvas.height = video.clientHeight;      
              canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
              dataAuxURL = canvas.toDataURL()
              setDataURL(dataAuxURL)
            }
            onUpdate(null, result, dataAuxURL)
          }
        })     
      })
    })

    return (): void => {
      codeReader.reset()
    }
  }, [])

  return (
    <div id="scanner-container" style={{position: "relative", minHeight: '375px'}}>
      {dataURL && <img id="imgFromVideo" style={{position: "absolute", left: 0}} src={dataURL} />}
      <video id="video" className="dbrScanner-video" playsInline />
    </div>
  )
}

export default BarCodeScanner