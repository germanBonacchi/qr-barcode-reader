/* eslint-disable prettier/prettier */

import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

export default class MultipleEanClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(`http://${context.account}.vtexcommercestable.com.br/api/catalog_system/pub/products/search`, context, {
    ...options,
    })
  }

  public async getProductBySpecificationFilter(idMultipleEan: string,  ean: string) {

    console.info('idMultipleEan',idMultipleEan)

    return this.http.getRaw(`?fq=specificationFilter_${idMultipleEan}:**${ean}**`)
  }
}


