
import { memo } from 'react';
import { User } from "@/types";
import { TransportRequest } from "@/types/request";
import { DashboardActions } from "./DashboardActions";
import { RecentRequests } from "./RecentRequests";

interface DashboardContentProps {
  user: User;
  requests: TransportRequest[];
}

export const DashboardContent = memo(({ user, requests }: DashboardContentProps) => {
  const recentRequests = requests.slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <DashboardActions user={user} />
      <RecentRequests requests={recentRequests} />
    </div>
  );
});

DashboardContent.displayName = 'DashboardContent';
