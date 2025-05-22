
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardCards } from "@/components/dashboard/DashboardCards";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/context/auth";
import { useRequests } from "@/context/requests";
import { Welcome } from "@/components/dashboard/Welcome";
import { RecentRequests } from "@/components/dashboard/RecentRequests";
// Layout import removed
import { DashboardActions } from "@/components/dashboard/DashboardActions";

const Dashboard = () => {
  const { user } = useAuth();
  const { requests } = useRequests();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'individual') {
      navigate('/solicitudes');
    }
  }, [user, navigate]);

  if (!user || user.role === 'individual') return null;
  
  return (
    <RequireAuth>
      {/* Layout component removed from here */}
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-6">
          <Welcome name={user.name} />
          <DashboardCards user={user} requests={requests} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RecentRequests requests={requests} />
            </div>
            <div className="lg:col-span-1">
              <DashboardActions user={user} />
            </div>
          </div>
          
          <DashboardTabs 
            user={user} 
            requests={requests} 
            totalRequestsCount={requests.length} 
          />
        </div>
      </div>
    </RequireAuth>
  );
};

export default Dashboard;
