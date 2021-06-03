import React, { Component } from 'react'
import QrReader from 'react-qr-scanner'

import controllerQr from './controllerQr.js'

const initialMessegge = "Mantenga el QR limpio y quieto para escanear"

class QrContainer extends Component {
  constructor(props){
    super(props)
    
    this.state = {
      delay: 3000,
      resultToShow: initialMessegge,
      result: null,
      isLoaded: false
    }
    this.handleScan = this.handleScan.bind(this)
  }

  handleScan(data){
    if (data){
      this.setState({resultToShow: 'Decoded QR-Code: ' + data.text })
      this.setState({result: data.text })
      controllerQr(this.state.result, 'aaa', 2)
      //buscar EAN producto
      //obtener link product
      //redirect
    }
  }

  handleError = err => {
    console.error(err)
  }

  componentDidMount() {
    this._isMounted = true
    if(this._isMounted){
      this.setState({isLoaded: true})
    }
  }
  componentWillUnmount(){
    this._isMounted = false
  }

  render() {
    const previewStyle = {
      heigth: 500,
      width: 500,
      display: 'flex',
      justifyContent: "center"
    }

    const camStyle = {
      display : 'flex',
      justifyContent: "center",
      marginTop: '0px'
    }

    const textStyle = { 
      fontSize: '30px',
      "text-align": 'center',
      marginTop: '0px'
    }

    const isLoaded = this.state.isLoaded;
 
    return (
      <React.Fragment>
        <div style={camStyle}>
          { isLoaded && 
            <QrReader
              delay={this.state.delay}
              style={previewStyle}
              onError={this.handleError}
              onScan={this.handleScan}
            />
          }     
        </div>
        <p style={textStyle}>-
          {this.state.resultToShow}
        </p>

      </React.Fragment>
    )
  }

}

export default QrContainer