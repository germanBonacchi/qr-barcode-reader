import { LogLevel } from '@vtex/api'

export const mutations = {
  logger: async (
    _: unknown,
    { message, detail }: MutationParamLogger,
    ctx: Context
  ) => {
    ctx.vtex.logger.log(
      {
        message,
        detail: JSON.parse(detail),
      },
      LogLevel.Info
    )

    return { status: 200 }
  },
}
