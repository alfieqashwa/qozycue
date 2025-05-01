export const formattedPrice = (locale: string) => new Intl.NumberFormat(locale)

export const formattedPriceBasedOnCountryCode = (
  locale: string,
  currency: string,
) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  })
