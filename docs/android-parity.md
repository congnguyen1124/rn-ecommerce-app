# Android Ecommerce parity notes

This document records the source behaviors intentionally reproduced from `on-tv-android/app/src/main/java/io/teragroup/onlala/presentation/ecommerce`.

## Navigation destinations

`ECommerceActivity` can enter mini home, landing, product detail, cart, checkout/payment result, order board/detail and address book. The React Native root stack exposes the same Ecommerce-only boundaries and omits unrelated TV/media screens.

## Product and variant behavior

- A no-variant product can be added directly; products with variants open a bottom sheet.
- Variant selection resets quantity to one and quantity is clamped to `1..stock`.
- A missing combination or zero-stock variant disables the primary action.
- Buy now creates a checkout payload without requiring a persisted cart row.
- Add to cart updates the badge and surfaces a success toast.

## Cart behavior

- Products are grouped by studio/seller profile.
- Product selection drives profile selection only when every item in that profile is selected.
- Invalid products remain unselected during select-all/profile selection.
- Quantity updates are optimistic and bounded by stock.
- Quantity one + decrement requests delete confirmation.
- Empty seller profiles are removed with their final product.
- Checkout receives only selected rows, grouped by seller.

## Checkout, addresses and orders

- Checkout requires shipping address and payment method.
- Preorder forces online payment and exposes personal-advice selection.
- Address validation covers name, Vietnamese mobile phone, full three-level area and street.
- Default address cannot be deleted; the address book is capped at ten items.
- Checkout displays raw shipping price, promotion discount and payable shipping.
- Order board matches the six Android tabs: waiting for payment, confirmation, shipping, delivering, done and cancelled.
