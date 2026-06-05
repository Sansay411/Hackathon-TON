export type TonNetwork = "testnet" | "mainnet";

export type TonAsset = {
  symbol: string;
  address: string | null;
  decimals: number;
};

export type TonTransactionReference = {
  txHash: string;
  network: TonNetwork;
  source: string;
  destination: string;
  amount: string;
  asset: TonAsset;
};
