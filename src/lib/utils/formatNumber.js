const fmt = new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 2,
    })
export default function formatNumber(number) {

    return fmt.format(number);
}