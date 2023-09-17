import { ethers } from "ethers";
import { useState } from "react";

interface WalletProps {
  account: string;
  setAccount: (account: string) => void;
}

export const Wallet = ({ account, setAccount }: WalletProps) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    setAccount(address);
  };

  const disconnectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    setAccount(address);
  };

  return (
    <div>
      <button onClick={connectWallet}>
        {account ? "Connected" : "Connect"}
      </button>
    </div>
  );
};
