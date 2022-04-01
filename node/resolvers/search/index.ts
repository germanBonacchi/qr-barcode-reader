export const queries = {
  getProductBySpecificationFilter: async (
    _: unknown,
    { ean }: QueryParamEan,
    ctx: Context
  ) => {
    try {
      const { idMultipleEan } = await ctx.clients.apps.getAppSettings(
        `${process.env.VTEX_APP_ID}`
      )

      const aux = await ctx.clients.multipleEan.getProductBySpecificationFilter(
        idMultipleEan,
        ean
      )

      if (aux.data.length > 0) {
        return aux
      }

      throw new Error('No product was found.')
    } catch (error) {
      console.info('No product was found.')
      console.info(error.response)
      console.info(error.response.data)
      throw new Error('No product was found.')
    }
  },
}
