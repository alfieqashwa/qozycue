export const formattedPrice = (locale: string, value: number) =>
  new Intl.NumberFormat(locale).format(value)

export const formattedPriceBasedOnCountryCode = (
  locale: string,
  currency: string,
  value: number,
) => {
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value)

  // Insert space after currency symbol
  return formatted.replace(/^(\D+)/, "$1 ")
}
