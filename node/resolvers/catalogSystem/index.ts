export const queries = {
  getSku: async (_: unknown, { ean }: QueryParamEan, ctx: Context) => {
    try {
      console.info('getSku', ean)

      return await ctx.clients.skuByEan.getSku(ean)
    } catch (error) {
      console.error('error getSku', error)
      throw new Error('No sku was found.')
    }
  },
}
