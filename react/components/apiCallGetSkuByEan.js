const apiCallGetSkuByEan = async (ean) => {
  const url = `https://${window.location.hostname}/v0/skuByEan/${ean}`
  let response = await fetch(url, {
    method: 'GET',
  })
  let json = null
  if (response.ok) {
    json = await response.json()
  } else {
    json = 'HTTP-Error: ' + response.status
  }
  return {"status": response.status, "data": json}
}

export default apiCallGetSkuByEan
