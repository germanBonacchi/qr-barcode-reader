import { UserInputError } from '@vtex/api'

export async function validate(ctx: Context, next: () => Promise<any>) {
  const {
    vtex: {
      route: { params },
    },
  } = ctx

  const {ean} = params

  if (!ean) {
    throw new UserInputError('Ean is required') 
  }

  ctx.state.ean = String(ean)

  await next()
}
