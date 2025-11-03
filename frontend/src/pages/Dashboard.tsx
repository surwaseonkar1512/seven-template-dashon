import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { useState } from "react";
import { RootState } from "../Redux/store";
import { useSelector } from "react-redux";

export default function Dashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const handleViewChange = (view: string) => {
    navigate(`/dashboard/${view}`);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar currentView={""} onViewChange={handleViewChange} mode={user?.user?.role} />

      <div className="flex-1 flex flex-col">
        <Header mode={user?.user?.role} title="Dashboard" />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            <Outlet /> {/* Nested route content appears here */}
          </div>
        </main>
      </div>
    </div>
  );
}
