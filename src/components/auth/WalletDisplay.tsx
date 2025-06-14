
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Copy, ExternalLink, Eye, EyeOff, Network } from 'lucide-react';
import { useMagicAuth } from '@/contexts/MagicAuthContext';
import { toast } from 'sonner';
import { NETWORKS } from '@/lib/infura';

export const WalletDisplay = () => {
  const { user, connectWallet } = useMagicAuth();
  const [showFullAddress, setShowFullAddress] = useState(false);

  if (!user) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Address copied to clipboard!');
  };

  const openEtherscan = (address: string) => {
    // Use Sepolia explorer for testnet
    const explorerUrl = `https://sepolia.etherscan.io/address/${address}`;
    window.open(explorerUrl, '_blank');
  };

  const formatAddress = (address: string) => {
    if (showFullAddress) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-50/80 to-indigo-50/80 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200/50 dark:border-purple-700/50 shadow-xl shadow-purple-500/10">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25 mb-3">
          <Wallet className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
          Your Web3 Wallet
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400 flex items-center justify-center gap-1">
          <Network className="h-3 w-3" />
          {NETWORKS.sepolia.name} • Powered by Magic
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Wallet Address</p>
            <p className="text-sm font-mono text-slate-900 dark:text-white truncate">
              {formatAddress(user.publicAddress)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowFullAddress(!showFullAddress)}
            >
              {showFullAddress ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => copyToClipboard(user.publicAddress)}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => openEtherscan(user.publicAddress)}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Button
          variant="outline"
          className="w-full bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/50 dark:to-indigo-950/50 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:from-purple-100 hover:to-indigo-100 dark:hover:from-purple-900/50 dark:hover:to-indigo-900/50"
          onClick={connectWallet}
        >
          <Wallet className="mr-2 h-4 w-4" />
          Connect to DApps
        </Button>
      </CardContent>
    </Card>
  );
};
