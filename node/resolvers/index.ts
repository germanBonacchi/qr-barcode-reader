import { queries as catalogSystemQueries } from './catalogSystem'
import { queries as searchQueries } from './search'
import { mutations as loggerMutations } from './logger'

export const resolvers = {
  Query: {
    ...catalogSystemQueries,
    ...searchQueries,
  },
  Mutation: {
    ...loggerMutations,
  },
}
