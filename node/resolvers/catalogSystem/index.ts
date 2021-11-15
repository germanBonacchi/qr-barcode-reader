export const queries = {
  getSku: async (_: unknown, { ean }: QueryParamEan, ctx: Context) => {
    return ctx.clients.skuByEan.getSku(ean)
  },
}
