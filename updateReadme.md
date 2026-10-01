# Updating README screenshots

This is the capture contract for the images embedded in [`README.md`](README.md). Update this file
in the same change whenever a screen, navigation path or screenshot filename changes.

## Capture standard

- Pixel Android emulator at **1080 × 2424** in portrait orientation.
- App language set to **English** from Settings before capturing.
- Use deterministic dummy data; do not replace names, stock states or order statuses manually.
- Keep the Android status and navigation bars visible so every image represents the real app frame.
- Encode stills as WebP at **420 px wide** with quality **82**.
- Store README media under `docs/images/` and retain the `-android` suffix.

Example conversion:

```bash
adb exec-out screencap -p > /tmp/home.png
ffmpeg -y -i /tmp/home.png -vf scale=420:-2 -quality 82 docs/images/home-android.webp
```

## Screen map

| Feature          | Required state                                         | Output                           |
| ---------------- | ------------------------------------------------------ | -------------------------------- |
| Home             | English locale; initial scroll position                | `home-android.webp`              |
| Catalog          | Open Technology from Home                              | `catalog-android.webp`           |
| Product detail   | Open Airy Pods from Technology                         | `product-detail-android.webp`    |
| Product preview  | Tap the Airy Pods hero image                           | `product-preview-android.webp`   |
| Variant selector | Tap Add to cart on Airy Pods                           | `variant-selector-android.webp`  |
| Cart             | Preserve selected, sold-out and alternate-variant rows | `cart-android.webp`              |
| Checkout         | Checkout the selected Airy Pods line                   | `checkout-android.webp`          |
| Payment methods  | Open payment selection before choosing a method        | `payment-methods-android.webp`   |
| Address list     | Open Shipping address from Checkout                    | `address-list-android.webp`      |
| Address form     | Tap Add new address                                    | `address-form-android.webp`      |
| Area picker      | Tap Choose area on a blank address form                | `area-picker-android.webp`       |
| Orders           | Select the Delivering tab                              | `orders-android.webp`            |
| Order detail     | Open order `ON24090182`                                | `order-detail-android.webp`      |
| Payment result   | Place a dummy COD order successfully                   | `payment-result-android.webp`    |
| Settings         | Open the EN avatar from Home                           | `language-settings-android.webp` |

## Review checklist

1. Open every output image and confirm the expected screen and fixture are visible.
2. Verify that visible UI copy is English. Vietnamese proper names and addresses are fixture data and
   may remain unchanged.
3. Check that no keyboard, toast, modal or developer overlay appears unless it is the documented
   state being demonstrated.
4. Run `file docs/images/*.webp`; portrait images should report `420x942` for this emulator.
5. Run `npm run format:check` and inspect the rendered README tables before committing.

Use a still when the README is demonstrating layout or a final state. Add a GIF only when the
behavior depends on motion and no single frame can explain it; keep GIFs small enough that the
README remains useful on a mobile connection.
