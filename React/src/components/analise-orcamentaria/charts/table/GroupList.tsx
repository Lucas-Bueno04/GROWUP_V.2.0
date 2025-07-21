// GroupList.tsx
import React from "react";
import { Group } from "@/components/interfaces/Group"; 
import AccountList from "./AccountList";

interface GroupListProps {
  groups: Group[];
}

const GroupList: React.FC<GroupListProps> = ({ groups }) => {
  return (
    <div>
      {groups.map(group => (
        <div key={group.id} style={{ marginBottom: 16, border: "1px solid #ccc", padding: 8 }}>
          <h3>
            {group.cod} - {group.name} ({group.accounts.length} contas)
          </h3>
          <AccountList accounts={group.accounts} />
        </div>
      ))}
    </div>
  );
};

export default GroupList;
