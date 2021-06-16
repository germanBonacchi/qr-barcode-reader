import React, { Component, useEffect } from 'react'
import QrReader from 'react-qr-scanner'

import formatQr from './formatQr.js'
//import controllerQr from './controllerQr.js'
import apiCallGetSkuByEan from './apiCallGetSkuByEan.js'

const initialMessegge = "Mantenga el QR limpio y quieto para escanear"

class QrContainer extends Component{
  constructor(props){
    super(props)
    this.state = {
      delay: 3000,
      resultToShow: initialMessegge,
      result: null,
      isLoaded: false,
      separator: null,
      separatorApparition: null,
      ean: null,
      skuData: null,
      isRedirect: false,
      prevData: null
    }
    this.handleScan = this.handleScan.bind(this)
  }
  
  handleScan(data){
    if (data && data.text!==this.state.prevData?.text){
      this.setState({prevData: data })
      this.setState({resultToShow: 'Decoded QR-Code: ' + data.text })
      this.setState({result: data.text })


      this.setState({ean: formatQr(this.state.result,this.state.separator,this.state.separatorApparition) })
      const getSkuByEan = apiCallGetSkuByEan(this.state.ean)
      getSkuByEan.then(response => {
        if(response.status === 200){
          this.setState({skuData: response.data })
        }else{
          console.log(response.data)
        }
      });
    }
  }
  
  handleError = err => {
    console.error(err)
  }

  componentDidMount() {
    this._isMounted = true
    if(this._isMounted){
      this.setState({isLoaded: true})
      this.setState({separator: this.props.separator})
      this.setState({separatorApparition: this.props.separatorApparition})
    }
  }
  componentWillUnmount(){
    this._isMounted = false
  }

  componentDidUpdate(prevState){
    if (!this.state.isRedirect && this.state.skuData && prevState.skuData !== this.state.skuData) {
      const skuLink = this.state.skuData.DetailUrl + '?skuId=' + this.state.skuData.Id
      this.setState({isRedirect: true})
      window.location.replace(skuLink)
    }
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
      textAlign: 'center',
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