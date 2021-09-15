/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from 'react'
import BarCodeScanner from 'barcode-react-scanner'
import { useCssHandles } from 'vtex.css-handles'

// import UseEanGoToPDP from './UseEan/go-to-pdp'
// import UseEanAddToCart from './UseEan/add-to-cart'
import { BarcodeReaderProps } from '../typings/global'
import '../style/camStyle.global.css'
import '../style/Loading.global.css'
import '../style/Success.global.css'
import '../style/dbrScanner-video.global.css'
import { useLazyQuery } from 'react-apollo'
import getDataSku from '../graphql/getSku.gql'

import { usePixel } from 'vtex.pixel-manager'
import { addToCart as ADD_TO_CART } from 'vtex.checkout-resources/Mutations'
import { OrderForm as OrderFormType } from 'vtex.checkout-graphql'
import { useMutation } from 'react-apollo'
import { OrderForm } from 'vtex.order-manager'

const CSS_HANDLES = ['barcodeContainer']

export default function BarcodeContainer({
  action,
}: BarcodeReaderProps) {
  const handles = useCssHandles(CSS_HANDLES)
  const [ean, setEan] = useState('')
  const [getSkuQuery, { loading: loadingGetSku, error: errorGetSku, data: dataGetSku }] = useLazyQuery(getDataSku)
  const { push } = usePixel()
  const { setOrderForm }: OrderFormContext = OrderForm.useOrderForm()

  const [
    addToCart,
    { error: mutationError/*, loading: mutationLoading*/ },
  ] = useMutation<{ addToCart: OrderFormType }, { items: [] }>(ADD_TO_CART)

  useEffect ( () => {
      if (ean === '') {
        return
      }
      console.log("ean effect called")
      getSkuQuery({ variables: { ean: String(ean) } })
    }, [ean]
  )

  useEffect ( () => {
      console.log(action)
      console.log("hola useEffect3")
      console.log(loadingGetSku)
      console.log(errorGetSku)
      console.log(dataGetSku)
      console.log(ean)
      if (ean === '') {
        return
      }
      if(!loadingGetSku && !errorGetSku && !dataGetSku ) {
        return
      }

      if(loadingGetSku){
        console.log("loading")
      }

      if(errorGetSku){
        console.log("error")
      }

      if(dataGetSku){
        console.log(dataGetSku)
        console.log(dataGetSku.Id)
        // handleAddToCart(dataGetSku)
        callAddToCart([{
          id: parseInt(dataGetSku.getSku.data.Id),
          quantity: 1,
          seller: '1',
        }])
      }

    }, [loadingGetSku, errorGetSku, dataGetSku]
  )

  // const handleAddToCart = async (skuData) => {
  //   console.log("skuData", skuData)
  //   const addItemsPromise = addItems([{
  //     id: skuData.getSku.data.Id,
  //     quantity: 1,
  //     seller: '1',
  //   }])
  //   await addItemsPromise

  //   push([{
  //     event: 'addToCart',
  //     items: {
  //       skuId: dataGetSku.getSku.data.Id,
  //       variant: "item.skuName",
  //       price: "item.sellingPrice",
  //       priceIsInt: true,
  //       name: "getNameWithoutVariant(item)",
  //       quantity: "item.quantity",
  //       productId: "item.productId",
  //       productRefId: "item.productRefId",
  //       brand: "item.additionalInfo ? item.additionalInfo.brandName : ''",
  //       category: "productCategory(item)",
  //       detailUrl: "item.detailUrl",
  //       imageUrl: "item.imageUrls ? fixUrlProtocol(item.imageUrls.at3x) : item.imageUrl ?? ''",
  //       referenceId: "item.refId",
  //     },
  //   }])
  // }

  const callAddToCart = async (items: any) => {
    const mutationResult = await addToCart({
      variables: {
        items: items.map((item: any) => {
          return {
            ...item,
          }
        }),
      },
    })

    if (mutationError) {
      console.error(mutationError)
      // toastMessage({ success: false, isNewItem: false })
      return
    }

    // Update OrderForm from the context
    mutationResult.data && setOrderForm(mutationResult.data.addToCart)

    const adjustSkuItemForPixelEvent = (item: any) => {
      return {
        skuId: item.id,
        quantity: item.quantity,
      }
    }
    // Send event to pixel-manager
    const pixelEventItems = items.map(adjustSkuItemForPixelEvent)
    push({
      event: 'addToCart',
      items: pixelEventItems,
    })

    // if (
    //   mutationResult.data?.addToCart?.messages?.generalMessages &&
    //   mutationResult.data.addToCart.messages.generalMessages.length
    // ) {
    //   mutationResult.data.addToCart.messages.generalMessages.map((msg: any) => {
    //     return showToast({
    //       message: msg.text,
    //       action: undefined,
    //       duration: 30000,
    //     })
    //   })
    // } else {
    //   toastMessage({ success: true, isNewItem: true })
    // }

    return
  }


  return (
    <div>
      {(
        <div className={`${handles.QrContainer} camStyle`}>
          <BarCodeScanner
            onUpdate={(_, resp): void => {
              if (resp) {
                const text = resp.getText()
                console.log("textlength", text.length)
                if (text !== ean) {
                  if (text.length > 5) {
                    console.log("--------text", text)
                    setEan(text)
                  }
                }
              }
            }}
          />
        </div>
      )}
    </div>
  )
}


interface OrderFormContext {
  loading: boolean
  orderForm: OrderFormType | undefined
  setOrderForm: (orderForm: Partial<OrderFormType>) => void
}