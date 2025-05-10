
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardCards } from "@/components/dashboard/DashboardCards";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/context/auth";
import { useRequests } from "@/context/requests";
import { Welcome } from "@/components/dashboard/Welcome";
import { RecentRequests } from "@/components/dashboard/RecentRequests";
import { Layout } from "@/components/Layout";

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
      <Layout>
        <div className="p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <Welcome name={user.name} />
            <DashboardCards user={user} requests={requests} />
            <RecentRequests requests={requests} />
            <DashboardTabs 
              user={user} 
              requests={requests} 
              totalRequestsCount={requests.length} 
            />
          </div>
        </div>
      </Layout>
    </RequireAuth>
  );
};

export default Dashboard;
