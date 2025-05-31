export function currencyFormat(amount: number) {
    return "RM" + (amount / 1000).toFixed(2)
}