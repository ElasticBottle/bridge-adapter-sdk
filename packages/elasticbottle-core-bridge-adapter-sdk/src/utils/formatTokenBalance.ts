export function formatTokenBalance(balance: string) {
  const [ones, decimals] = balance.split(".");
  if (ones === "0" && decimals.slice(0, 5) === "00000") {
    return "< 0.00001";
  }
  return `${ones}.${decimals.slice(0, 5)}`;
}
