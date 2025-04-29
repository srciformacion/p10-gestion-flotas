
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { RequireAuth } from "@/components/RequireAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BiRecord } from "@/types";
import { Spinner } from "@/components/ui/spinner";
import { BiDashboardCharts } from "@/components/admin/bi/BiDashboardCharts";
import { BiDataTable } from "@/components/admin/bi/BiDataTable";
import { BiEmptyState } from "@/components/admin/bi/BiEmptyState";

const BiDashboard = () => {
  const [biData, setBiData] = useState<BiRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // In a real application, this would call an API endpoint
        const storedData = localStorage.getItem('bi_records');
        const data = storedData ? JSON.parse(storedData) : [];
        setBiData(data);
      } catch (error) {
        console.error("Error fetching BI data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Add console log for debugging
    console.log("BiDashboard component mounted");
  }, []);

  return (
    <RequireAuth allowedRoles={["admin"]}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Business Intelligence</h1>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Spinner size="lg" />
              </div>
            ) : biData.length === 0 ? (
              <BiEmptyState />
            ) : (
              <Tabs defaultValue="dashboard">
                <TabsList className="mb-6">
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="rawData">Datos detallados</TabsTrigger>
                </TabsList>
                
                <TabsContent value="dashboard">
                  <BiDashboardCharts biData={biData} />
                </TabsContent>
                
                <TabsContent value="rawData">
                  <BiDataTable biData={biData} />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </main>
      </div>
    </RequireAuth>
  );
};

export default BiDashboard;
