export function toChf(amount: number) {
  if (!amount) return 'Fr. 0.00'
  return `Fr. ${amount.toFixed(2)}`
}
