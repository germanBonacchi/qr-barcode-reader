import { LogLevel } from '@vtex/api'

export const mutations = {
  logger: async (
    _: unknown,
    { message, detail }: MutationParamLogger,
    ctx: Context
  ) => {
    try {
      ctx.vtex.logger.log(
        {
          message,
          detail: JSON.parse(detail),
        },
        LogLevel.Info
      )

      return { status: 200 }
    } catch (error) {
      try {
        ctx.vtex.logger.log(
          {
            message,
            detail: JSON.parse(detail),
          },
          LogLevel.Info
        )

        return { status: 200 }
      } catch (_errorAfterTimeout) {
        throw new Error('Error on mutation logger')
      }
    }
  },
}
