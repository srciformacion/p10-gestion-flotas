
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
    <div className="w-full max-w-7xl mx-auto space-y-8">
      <DashboardActions user={user} />
      <div className="w-full max-w-4xl mx-auto">
        <RecentRequests requests={recentRequests} />
      </div>
    </div>
  );
});

DashboardContent.displayName = 'DashboardContent';
