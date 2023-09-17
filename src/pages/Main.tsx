import { useState } from "react";
import { Wallet } from "../components/wallet";
import { Farm } from "./Farm";

export const Main = () => {
  const [account, setAccount] = useState("");
  return (
    <div>
      <Wallet account={account} setAccount={setAccount}></Wallet>
      <Farm account={account} setAccount={setAccount}></Farm>
    </div>
  );
};
