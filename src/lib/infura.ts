
// Infura configuration
// Get your free API key from: https://infura.io/
export const INFURA_PROJECT_ID = 'YOUR_INFURA_KEY'; // Replace with your actual Infura project ID

export const getInfuraUrl = (network: 'mainnet' | 'sepolia' = 'sepolia') => {
  return `https://${network}.infura.io/v3/${INFURA_PROJECT_ID}`;
};

// Network configurations
export const NETWORKS = {
  mainnet: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: getInfuraUrl('mainnet'),
  },
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: getInfuraUrl('sepolia'),
  },
} as const;
