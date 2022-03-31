export const queries = {
  getSku: async (_: unknown, { ean }: QueryParamEan, ctx: Context) => {
    try {
      return await ctx.clients.skuByEan.getSku(ean)
    } catch (error) {
      throw new Error('No sku was found.')
    }
  },
}
