export async function getSkuByEan(ctx: Context, next: () => Promise<any>) {
  const {
    state: { ean },
    clients: { skuByEan },
  } = ctx

  const response = await skuByEan.getSku(ean)
  console.info('response:', response)
  ctx.body = response

  await next()
}
