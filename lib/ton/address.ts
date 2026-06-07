export function isLikelyTonAddress(value: string) {
  return /^(EQ|UQ|kQ|0Q)[A-Za-z0-9_-]{46}$/.test(value) || /^-?\d:[a-fA-F0-9]{64}$/.test(value);
}

export function truncateTonAddress(value: string) {
  if (value.length <= 12) {
    return value;
  }
  return `${value.slice(0, 6)}...${value.slice(-6)}`;
}

function base64UrlDecode(input: string): Uint8Array {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "===".slice((normalized.length + 3) % 4);
  const binary = typeof atob === "function"
    ? atob(padded)
    : Buffer.from(padded, "base64").toString("binary");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function crc16Ccitt(data: Uint8Array): number {
  let crc = 0;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i] << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) !== 0 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc;
}

export function userFriendlyToRawAddress(value: string): string | null {
  if (!/^(EQ|UQ|kQ|0Q)[A-Za-z0-9_-]{46}$/.test(value)) {
    if (/^-?\d:[a-fA-F0-9]{64}$/.test(value)) {
      return value;
    }
    return null;
  }
  try {
    const bytes = base64UrlDecode(value);
    if (bytes.length !== 36) {
      return null;
    }
    const expected = crc16Ccitt(bytes.slice(0, 34));
    const actual = (bytes[34] << 8) | bytes[35];
    if (expected !== actual) {
      return null;
    }
    const workchain = bytes[1] > 127 ? bytes[1] - 256 : bytes[1];
    const hash = Array.from(bytes.slice(2, 34))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();
    return `${workchain}:${hash}`;
  } catch {
    return null;
  }
}
