📢 Use this project, [contribute](https://github.com/vtex-apps/qr-barcode-reader) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

# Qr & Barcode Reader

<!-- DOCS-IGNORE:start -->
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
<!-- DOCS-IGNORE:end -->

Scan Qr codes and Barcodes with the Ean of a product embedded and then redirect to the PDP of that product.

![Media Placeholder](https://user-images.githubusercontent.com/55905671/131380395-e39ce499-2efa-4aaa-9506-f934fe9af8cf.gif)

:warning: **Supported Barcodes:**
- Ean 13
- Ean 8
- UPC-A
---
## Configuration 

### Step 1 - Adding the Qr & Barcode Reader app to your theme's dependencies

1. Using your terminal and the [VTEX IO Toolbelt](https://vtex.io/docs/recipes/development/vtex-io-cli-installment-and-command-reference), log into the desired VTEX account.
2. Run `vtex install vtexarg.qr-barcode-reader` on the account you're working on.
3. Add the app as a theme peerDependency in the `manifest.json` file;
```json
"peerDependencies": {
  "vtexarg.qr-barcode-reader": "0.x"
}
```
Now, you are able to use all blocks exported by the `qr-barcode-reader` app. Check out the full list below:

| Block name     | Description | 
| -------------- | ----------- | 
| `qr-reader` | Renders a button that allows you to scan a qr code. | 
| `barcode-reader` | Renders a button that allows you to scan a barcode. | 

### Step 2 - Adding the Qr & Barcode Reader's blocks to your theme's templates

To add the Qr & Barcode Reader's blocks in your theme, you just need to declare them as block of any component, this is because all exported blocks are thinking to be added anywhere in the store.

```json
  "store.home": {
      "blocks": [
        "qr-reader",
        "barcode-reader"
      ]
    },
```

The `qr-reader` block in this app has two props:

| Prop name          | Type      |  Description | Default value |
| --------------------| ----------|--------------|---------------|
| `separator` | `string` | The `separator` is a pattern that describes where each division of the qr code should occur. |`X`|
| `eanIndex` | `number` | The `eanIndex` is the index of the division made by the `separator` in which the Ean will be within the qr code. |  `0`  |

For example:

```json
"qr-reader":{
  "props":{
    "separator": "X",
    "eanIndex": 3
  }
},
```

If the qr code have this code embeded: `division0Xdivision1Xdivision2X33675134Xdivision4`, we will split by the `separator` in 5 division (0 to 4), and with the `eanIndex` we will get the division number 3 that in this case contains the Ean.

Every block in this app only has two props in common:

| Prop name          | Type      |  Description | Default value |
| --------------------| ----------|--------------|---------------|
|  `action`  |  `string`  |  The `action` that will do after the scan. Possible values are: `go-to-pdp` and `add-to-cart` | `go-to-pdp` |
|  `blockClass`  |  `string`  |  Block  ID  of your choosing to  be  used  in [CSS  customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization#using-the-blockclass-property). | 

---

## Customization

In order to apply CSS customizations in this and other blocks, follow the instructions given in the recipe on [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).

| CSS Handles |
| ----------- | 
| `qrReaderWrapper` | 
| `qrContainer` | 
| `barcodeReaderWrapper` | 
| `barcodeContainer` | 
| `modalReaderMessagesSucces` | 
| `modalReaderMessagesSuccesText` | 
| `modalReaderMessagesError` | 
| `modalReaderMessagesErrorText` | 

---
<!-- DOCS-IGNORE:start -->

## Contributors ✨

Thanks goes to these wonderful people:
<table>
  <tr>
    <td align="center"><a href="https://github.com/germanBonacchi"><img src="https://avatars.githubusercontent.com/u/55905671?v=4" width="100px;" alt=""/><br /><sub><b>Germán Bonacchi</b></sub></a><br /><a href="https://github.com/vtex-apps/quantity-on-cart/commits?author=germanBonacchi" title="Code">💻</a></td>
  </tr>
</table>
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!

<!-- DOCS-IGNORE:end -->