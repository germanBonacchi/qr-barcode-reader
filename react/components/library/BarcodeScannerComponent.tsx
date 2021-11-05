import React, { useEffect, useState } from 'react'
import { BrowserBarcodeReader } from '@zxing/library'
import type { Result } from '@zxing/library';

const BarCodeScanner = ({/*onUpdate,*/ state, response, setResponse}: {
  //onUpdate(err: unknown, result: Result | undefined): void
  state: string
  response: Result | null
  setResponse: (response: Result | null) => void
}): JSX.Element => {
  const codeReader = new BrowserBarcodeReader()  
  const [results, setResults]: any = useState<any>([])

  useEffect(() => {
    //console.log('state', state)
    if (!state && !response){
      codeReader.listVideoInputDevices().then(devices => {
        console.info('devices', devices)
        let deviceSuggested: MediaDeviceInfo 
        
        if (devices.length === 1){
          deviceSuggested = devices[0]
        } else if (devices.length > 1) {
          deviceSuggested = devices.filter(device => device.label.includes('back') && device.label.includes('0'))[0] ? devices.filter(device => device.label.includes('back') && device.label.includes('0'))[0] : devices.filter(device => device.label.includes('back'))[0] 
        } else {
          deviceSuggested =  {deviceId: '', label: '', groupId: '', kind: 'videoinput', toJSON: () => {}}
        } 
  
        const {deviceId} = deviceSuggested
        
        codeReader.decodeFromVideoDevice(deviceId, 'video', (result: Result) => {
          if (result && results.length<4) {
            console.log('result', result)
            const resultAux = results
            resultAux.push(result)
            setResults(resultAux)
          }else{
            setResponse(null)
          }

          if(results.length>2){
            const resultsWithCount = results.map(result => {
              return {result: result, count: results.filter(r => r==result).length}
            })
            const finalResult = resultsWithCount.reduce(function(prev, current) {
              return (prev.count > current.county) ? prev : current
            })
            setResponse(finalResult.result)
            setResults([])
            //codeReader.reset()
          }
        })
      })
    }
  }, [codeReader])

  return (
    <div id="scanner-container">
      <video id="video" className="dbrScanner-video" playsInline />
    </div>
  )
}

export default BarCodeScanner
