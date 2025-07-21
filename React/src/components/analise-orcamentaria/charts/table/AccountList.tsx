// AccountList.tsx
import React from "react";
import { Account } from "@/components/interfaces/Account";

interface AccountListProps {
  accounts: Account[];
}

const AccountList: React.FC<AccountListProps> = ({ accounts }) => {
  if (accounts.length === 0) {
    return <p style={{ marginLeft: 16, fontStyle: "italic" }}>Nenhuma conta para este grupo.</p>;
  }
  return (
    <ul style={{ marginLeft: 16 }}>
      {accounts.map(acc => (
        <li key={acc.id}>
          {acc.cod} - {acc.name}
        </li>
      ))}
    </ul>
  );
};

export default AccountList;
