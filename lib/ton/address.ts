export function isLikelyTonAddress(value: string) {
  return /^(EQ|UQ|kQ|0Q)[A-Za-z0-9_-]{46}$/.test(value) || /^-?\d:[a-fA-F0-9]{64}$/.test(value);
}

export function truncateTonAddress(value: string) {
  if (value.length <= 12) {
    return value;
  }
  return `${value.slice(0, 6)}...${value.slice(-6)}`;
}
