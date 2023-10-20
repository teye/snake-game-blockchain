import type { ExternalProvider } from '@ethersproject/providers';

export interface MetaMaskHolder {
  ethereum?: ExternalProvider;
}

const maybeEthereum = typeof window !== 'undefined' && (window as any).ethereum;
export const metaMask = maybeEthereum ? (maybeEthereum as Required<ExternalProvider>) : null;
