import type { ClientsConfig, ServiceContext, RecorderState } from '@vtex/api'
import { LRUCache, method, Service } from '@vtex/api'

import { Clients } from './clients'
import { validate } from './middlewares/validate'
import { getSkuByEan } from './middlewares/getSkuByEan'

const TIMEOUT_MS = 5000

const memoryCache = new LRUCache<string, any>({ max: 5000 })

metrics.trackCache('status', memoryCache)

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
    },
    status: {
      memoryCache,
    },
  },
}

declare global {
  type Context = ServiceContext<Clients, State>

  interface State extends RecorderState {
    ean: String
  }
}

// Export a service that defines route handlers and client options.
export default new Service({
  clients,
  routes: {
    // `getSkuByEanRoute` is the route ID from service.json. It maps to an array of middlewares (or a single handler).
    getSkuByEanRoute: method({
      GET: [validate,getSkuByEan],
    }),
  },
})
