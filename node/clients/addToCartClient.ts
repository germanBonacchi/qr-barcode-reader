/* eslint-disable prettier/prettier */

import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

export default class AddToCartClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(`http://${context.account}.vtexcommercestable.com.br/api/checkout/pub/orderForm`, context, {
    ...options,
      headers: {
        VtexIdClientAutCookie: context.storeUserAuthToken ?? context.authToken,
      }
    })
  }

  public async addToCart(orderFormId: string) {
    return this.http.patch(`/${orderFormId}/items`)
  }
}