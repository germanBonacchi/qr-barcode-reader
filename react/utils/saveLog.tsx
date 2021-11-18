const saveLog = async (message, detail, loggerMutation) => {
  await loggerMutation({
    variables: { message, detail: JSON.stringify(detail) },
  })
}

export default saveLog
