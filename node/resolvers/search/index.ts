export const queries = {
  getProductBySpecificationFilter: async (
    _: unknown,
    { ean }: QueryParamEan,
    ctx: Context
  ) => {
    const { idMultipleEan } = await ctx.clients.apps.getAppSettings(
      `${process.env.VTEX_APP_ID}`
    )

    return ctx.clients.multipleEan.getProductBySpecificationFilter(
      idMultipleEan,
      ean
    )
  },
}
