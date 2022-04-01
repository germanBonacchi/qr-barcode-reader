export const queries = {
  getSku: async (_: unknown, { ean }: QueryParamEan, ctx: Context) => {
    try {
      console.info('getSku', ean)

      return await ctx.clients.skuByEan.getSku(ean)
    } catch (error) {
      console.info('No sku was found.')
      console.info(error.response)
      console.info(error.response.data)
      throw new Error('No sku was found.')
    }
  },
}
