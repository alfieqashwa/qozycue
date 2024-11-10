export const formattedPrice = new Intl.NumberFormat("id-ID")
export const formattedPriceWithRupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
})
